'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type {
  NotificationType,
  NotificationPlatform,
  NotificationChannel,
  NotificationOptions,
  EnhancedNotificationOptions,
  PendingNotification,
  ActiveNotification,
  ActionType,
  NotificationReceivedEvent,
  ActionPerformedEvent,
} from '@/types/notification'
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_ICONS,
  DEFAULT_ACTION_TYPES,
  Importance,
  Visibility,
} from '@/types/notification'

// ============================================
// Legacy Types (backward compatibility)
// ============================================

export interface CustomNotificationOptions {
  title: string
  body?: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
  silent?: boolean
}

// ============================================
// Helper Functions
// ============================================

function isTauri(): boolean {
  if (typeof window === 'undefined') return false
  return typeof (window as any).__TAURI__ !== 'undefined'
}

function detectPlatform(): NotificationPlatform {
  if (typeof window === 'undefined') return 'web'

  const tauri = isTauri()
  const userAgent = navigator.userAgent

  if (tauri) {
    if (/Android/i.test(userAgent)) return 'tauri-android'
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'tauri-ios'
    return 'tauri-desktop'
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const isInstalled = (navigator as any).standalone === true

  if (isStandalone || isInstalled) return 'pwa'

  return 'web'
}

// ============================================
// Main Hook
// ============================================

export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)
  const [platform, setPlatform] = useState<NotificationPlatform>('web')
  const channelsInitialized = useRef(false)
  const actionsRegistered = useRef(false)
  const listenersRef = useRef<Array<() => void>>([])

  // ============================================
  // Initialization
  // ============================================

  useEffect(() => {
    const checkSupport = async () => {
      if (typeof window === 'undefined') return

      const detectedPlatform = detectPlatform()
      setPlatform(detectedPlatform)

      if (detectedPlatform.startsWith('tauri')) {
        try {
          const { isPermissionGranted } = await import('@tauri-apps/plugin-notification')
          const granted = await isPermissionGranted()
          setPermission(granted ? 'granted' : 'default')
          setIsSupported(true)

          console.log('[useNotification] Tauri detected:', { platform: detectedPlatform, granted })

          // Initialize Android channels
          if (detectedPlatform === 'tauri-android' && granted && !channelsInitialized.current) {
            channelsInitialized.current = true
            initializeAndroidChannels()
          }

          // Register action types on mobile
          if ((detectedPlatform === 'tauri-android' || detectedPlatform === 'tauri-ios') && !actionsRegistered.current) {
            actionsRegistered.current = true
            registerDefaultActionTypes()
          }

          return
        } catch (error) {
          console.warn('[useNotification] Tauri API error, falling back to web:', error)
        }
      }

      // Web/PWA environment
      const hasNotificationAPI = 'Notification' in window
      if (!hasNotificationAPI) {
        console.warn('[useNotification] Notifications API not available')
        return
      }

      setIsSupported(true)
      setPermission(Notification.permission)
    }

    checkSupport()

    // Cleanup listeners on unmount
    return () => {
      listenersRef.current.forEach((unlisten) => unlisten())
      listenersRef.current = []
    }
  }, [])

  // ============================================
  // Channel Management (Android)
  // ============================================

  const initializeAndroidChannels = async () => {
    if (platform !== 'tauri-android') return

    try {
      const { createChannel } = await import('@tauri-apps/plugin-notification')

      for (const [type, channel] of Object.entries(NOTIFICATION_CHANNELS)) {
        try {
          await createChannel(channel as any)
          console.log(`[useNotification] Channel created: ${type}`)
        } catch (err) {
          console.log(`[useNotification] Channel ${type} may already exist`)
        }
      }
    } catch (error) {
      console.error('[useNotification] Failed to initialize channels:', error)
    }
  }

  const createChannel = useCallback(
    async (channel: NotificationChannel): Promise<void> => {
      if (platform !== 'tauri-android') {
        console.warn('[createChannel] Only available on Android')
        return
      }

      try {
        const { createChannel: tauriCreateChannel } = await import('@tauri-apps/plugin-notification')
        await tauriCreateChannel(channel as any)
        console.log('[createChannel] Created:', channel.id)
      } catch (error) {
        console.error('[createChannel] Error:', error)
      }
    },
    [platform]
  )

  const deleteChannel = useCallback(
    async (channelId: string): Promise<void> => {
      if (platform !== 'tauri-android') return

      try {
        const { removeChannel } = await import('@tauri-apps/plugin-notification')
        await removeChannel(channelId)
        console.log('[deleteChannel] Removed:', channelId)
      } catch (error) {
        console.error('[deleteChannel] Error:', error)
      }
    },
    [platform]
  )

  const listChannels = useCallback(async (): Promise<NotificationChannel[]> => {
    if (platform !== 'tauri-android') return []

    try {
      const { channels } = await import('@tauri-apps/plugin-notification')
      const channelList = await channels()
      return channelList as unknown as NotificationChannel[]
    } catch (error) {
      console.error('[listChannels] Error:', error)
      return []
    }
  }, [platform])

  // ============================================
  // Action Types (Mobile)
  // ============================================

  const registerDefaultActionTypes = async () => {
    if (!platform.startsWith('tauri-android') && !platform.startsWith('tauri-ios')) return

    try {
      const { registerActionTypes } = await import('@tauri-apps/plugin-notification')
      await registerActionTypes(DEFAULT_ACTION_TYPES as any)
      console.log('[useNotification] Default action types registered')
    } catch (error) {
      console.error('[useNotification] Failed to register action types:', error)
    }
  }

  const registerActionTypes = useCallback(
    async (actionTypes: ActionType[]): Promise<void> => {
      if (!platform.startsWith('tauri')) {
        console.warn('[registerActionTypes] Only available on Tauri mobile')
        return
      }

      try {
        const { registerActionTypes: tauriRegisterActionTypes } = await import('@tauri-apps/plugin-notification')
        await tauriRegisterActionTypes(actionTypes as any)
        console.log('[registerActionTypes] Registered:', actionTypes.map((a) => a.id))
      } catch (error) {
        console.error('[registerActionTypes] Error:', error)
      }
    },
    [platform]
  )

  // ============================================
  // Event Listeners
  // ============================================

  const onNotificationReceived = useCallback(
    async (callback: (notification: NotificationReceivedEvent) => void): Promise<() => void> => {
      if (!platform.startsWith('tauri')) {
        console.warn('[onNotificationReceived] Only available on Tauri')
        return () => {}
      }

      try {
        const { onNotificationReceived: tauriOnNotificationReceived } = await import('@tauri-apps/plugin-notification')
        const unlisten = await tauriOnNotificationReceived((notification) => {
          callback(notification as NotificationReceivedEvent)
        })
        listenersRef.current.push(unlisten as unknown as () => void)
        return unlisten as unknown as () => void
      } catch (error) {
        console.error('[onNotificationReceived] Error:', error)
        return () => {}
      }
    },
    [platform]
  )

  const onAction = useCallback(
    async (callback: (event: ActionPerformedEvent) => void): Promise<() => void> => {
      if (!platform.startsWith('tauri')) {
        console.warn('[onAction] Only available on Tauri mobile')
        return () => {}
      }

      try {
        const { onAction: tauriOnAction } = await import('@tauri-apps/plugin-notification')
        const unlisten = await tauriOnAction((event) => {
          callback(event as unknown as ActionPerformedEvent)
        })
        listenersRef.current.push(unlisten as unknown as () => void)
        return unlisten as unknown as () => void
      } catch (error) {
        console.error('[onAction] Error:', error)
        return () => {}
      }
    },
    [platform]
  )

  // ============================================
  // Permission Management
  // ============================================

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false

    if (platform.startsWith('tauri')) {
      try {
        const { isPermissionGranted, requestPermission } = await import('@tauri-apps/plugin-notification')

        let granted = await isPermissionGranted()
        if (granted) {
          setPermission('granted')
          return true
        }

        await requestPermission()
        granted = await isPermissionGranted()
        setPermission(granted ? 'granted' : 'denied')

        // Initialize after permission granted
        if (granted && platform === 'tauri-android' && !channelsInitialized.current) {
          channelsInitialized.current = true
          initializeAndroidChannels()
        }

        return granted
      } catch (error) {
        console.error('[requestPermission] Tauri error:', error)
        return false
      }
    }

    // Web fallback
    if (!('Notification' in window)) return false

    if (Notification.permission === 'granted') {
      setPermission('granted')
      return true
    }

    if (Notification.permission === 'denied') {
      setPermission('denied')
      return false
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }, [platform])

  // ============================================
  // Core Notification Methods
  // ============================================

  const sendNotification = useCallback(
    async (options: NotificationOptions | EnhancedNotificationOptions | string): Promise<void> => {
      if (typeof window === 'undefined') return

      // Handle string shorthand
      const opts: EnhancedNotificationOptions =
        typeof options === 'string' ? { title: options } : (options as EnhancedNotificationOptions)

      const type = opts.type || 'default'
      const channelId = opts.channelId || NOTIFICATION_CHANNELS[type]?.id || 'default'

      // Tauri environment
      if (platform.startsWith('tauri')) {
        try {
          const { isPermissionGranted, sendNotification: tauriSendNotification } = await import(
            '@tauri-apps/plugin-notification'
          )

          const granted = await isPermissionGranted()
          if (!granted) {
            const hasPermission = await requestPermission()
            if (!hasPermission) {
              console.warn('[sendNotification] Permission denied')
              return
            }
          }

          const payload: any = {
            title: opts.title,
            body: opts.body,
          }

          // Android-specific options
          if (platform === 'tauri-android') {
            payload.channelId = channelId
          }

          // Optional fields
          if (opts.id) payload.id = opts.id
          if (opts.largeBody) payload.largeBody = opts.largeBody
          if (opts.summary) payload.summary = opts.summary
          if (opts.actionTypeId) payload.actionTypeId = opts.actionTypeId
          if (opts.group) payload.group = opts.group
          if (opts.groupSummary) payload.groupSummary = opts.groupSummary
          if (opts.sound) payload.sound = opts.sound
          if (opts.inboxLines) payload.inboxLines = opts.inboxLines
          if (opts.icon && platform !== 'tauri-android') payload.icon = opts.icon
          if (opts.largeIcon) payload.largeIcon = opts.largeIcon
          if (opts.iconColor) payload.iconColor = opts.iconColor
          if (opts.attachments) payload.attachments = opts.attachments
          if (opts.extra) payload.extra = opts.extra
          if (opts.ongoing) payload.ongoing = opts.ongoing
          if (opts.autoCancel !== undefined) payload.autoCancel = opts.autoCancel
          if (opts.silent) payload.silent = opts.silent
          if (opts.visibility !== undefined) payload.visibility = opts.visibility
          if (opts.number) payload.number = opts.number

          // Scheduling
          if (opts.schedule) {
            const { Schedule, ScheduleEvery } = await import('@tauri-apps/plugin-notification')

            if (opts.schedule.at) {
              payload.schedule = Schedule.at(opts.schedule.at, false, opts.schedule.allowWhileIdle ?? true)
            } else if (opts.schedule.every) {
              const everyMap: Record<string, any> = {
                year: ScheduleEvery.Year,
                month: ScheduleEvery.Month,
                twoWeeks: ScheduleEvery.TwoWeeks,
                week: ScheduleEvery.Week,
                day: ScheduleEvery.Day,
                hour: ScheduleEvery.Hour,
                minute: ScheduleEvery.Minute,
                second: ScheduleEvery.Second,
              }
              payload.schedule = Schedule.every(
                everyMap[opts.schedule.every] || ScheduleEvery.Day,
                opts.schedule.count || 1,
                opts.schedule.allowWhileIdle ?? true
              )
            } else if (opts.schedule.interval) {
              payload.schedule = Schedule.interval(opts.schedule.interval, opts.schedule.allowWhileIdle ?? true)
            }
          }

          tauriSendNotification(payload)
          console.log('[sendNotification] Tauri notification sent')
          return
        } catch (error) {
          console.error('[sendNotification] Tauri error:', error)
        }
      }

      // Web/PWA fallback
      if (!('Notification' in window)) return

      if (Notification.permission !== 'granted') {
        const hasPermission = await requestPermission()
        if (!hasPermission) return
      }

      const icon = opts.icon || NOTIFICATION_ICONS[type]

      // Try Service Worker first
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration()
          if (registration) {
            const readyRegistration = await navigator.serviceWorker.ready

            const swOptions: any = {
              body: opts.body,
              icon,
              badge: opts.badge || '/icons/icon-96x96.png',
              tag: opts.tag,
              requireInteraction: opts.requireInteraction ?? false,
              silent: opts.silent ?? false,
              vibrate: [200, 100, 200],
              data: { url: window.location.href, extra: opts.extra },
            }

            await readyRegistration.showNotification(opts.title, swOptions)
            console.log('[sendNotification] Service Worker notification sent')
            return
          }
        } catch (error) {
          console.error('[sendNotification] Service Worker error:', error)
        }
      }

      // Direct Notification API
      try {
        new Notification(opts.title, {
          body: opts.body,
          icon,
          tag: opts.tag,
          requireInteraction: opts.requireInteraction,
          silent: opts.silent,
        })
        console.log('[sendNotification] Direct notification sent')
      } catch (error) {
        console.error('[sendNotification] Direct notification error:', error)
        throw error
      }
    },
    [platform, requestPermission]
  )

  // Alias for sendNotification
  const show = sendNotification

  // ============================================
  // Typed Convenience Methods
  // ============================================

  const showSuccess = useCallback(
    async (title: string, body?: string, options?: Partial<EnhancedNotificationOptions>) => {
      return sendNotification({ ...options, title, body, type: 'success' })
    },
    [sendNotification]
  )

  const showError = useCallback(
    async (title: string, body?: string, options?: Partial<EnhancedNotificationOptions>) => {
      return sendNotification({ ...options, title, body, type: 'error' })
    },
    [sendNotification]
  )

  const showWarning = useCallback(
    async (title: string, body?: string, options?: Partial<EnhancedNotificationOptions>) => {
      return sendNotification({ ...options, title, body, type: 'warning' })
    },
    [sendNotification]
  )

  const showInfo = useCallback(
    async (title: string, body?: string, options?: Partial<EnhancedNotificationOptions>) => {
      return sendNotification({ ...options, title, body, type: 'info' })
    },
    [sendNotification]
  )

  // ============================================
  // Scheduled Notifications
  // ============================================

  const scheduleNotification = useCallback(
    async (options: EnhancedNotificationOptions): Promise<void> => {
      if (!options.schedule) {
        console.warn('[scheduleNotification] No schedule provided, sending immediately')
      }
      return sendNotification(options)
    },
    [sendNotification]
  )

  // ============================================
  // Notification Management
  // ============================================

  const cancel = useCallback(
    async (ids: number[]): Promise<void> => {
      if (!platform.startsWith('tauri')) return

      try {
        const { cancel: tauriCancel } = await import('@tauri-apps/plugin-notification')
        await tauriCancel(ids)
        console.log('[cancel] Cancelled:', ids)
      } catch (error) {
        console.error('[cancel] Error:', error)
      }
    },
    [platform]
  )

  const cancelAll = useCallback(async (): Promise<void> => {
    if (!platform.startsWith('tauri')) return

    try {
      const { cancelAll: tauriCancelAll } = await import('@tauri-apps/plugin-notification')
      await tauriCancelAll()
      console.log('[cancelAll] All scheduled notifications cancelled')
    } catch (error) {
      console.error('[cancelAll] Error:', error)
    }
  }, [platform])

  const getPending = useCallback(async (): Promise<PendingNotification[]> => {
    if (!platform.startsWith('tauri')) return []

    try {
      const { pending } = await import('@tauri-apps/plugin-notification')
      const notifications = await pending()
      return notifications as PendingNotification[]
    } catch (error) {
      console.error('[getPending] Error:', error)
      return []
    }
  }, [platform])

  const getActive = useCallback(async (): Promise<ActiveNotification[]> => {
    if (!platform.startsWith('tauri')) return []

    try {
      const { active } = await import('@tauri-apps/plugin-notification')
      const notifications = await active()
      return notifications as ActiveNotification[]
    } catch (error) {
      console.error('[getActive] Error:', error)
      return []
    }
  }, [platform])

  const removeActive = useCallback(
    async (notifications: Array<{ id: number; tag?: string }>): Promise<void> => {
      if (!platform.startsWith('tauri')) return

      try {
        const { removeActive: tauriRemoveActive } = await import('@tauri-apps/plugin-notification')
        await tauriRemoveActive(notifications)
        console.log('[removeActive] Removed:', notifications)
      } catch (error) {
        console.error('[removeActive] Error:', error)
      }
    },
    [platform]
  )

  const removeAllActive = useCallback(async (): Promise<void> => {
    if (!platform.startsWith('tauri')) return

    try {
      const { removeAllActive: tauriRemoveAllActive } = await import('@tauri-apps/plugin-notification')
      await tauriRemoveAllActive()
      console.log('[removeAllActive] All active notifications removed')
    } catch (error) {
      console.error('[removeAllActive] Error:', error)
    }
  }, [platform])

  // ============================================
  // Batch Operations
  // ============================================

  const batch = useCallback(
    async (operations: Array<{ type: 'send' | 'cancel' | 'cancelAll'; options?: NotificationOptions; ids?: number[] }>): Promise<void> => {
      for (const op of operations) {
        switch (op.type) {
          case 'send':
            if (op.options) await sendNotification(op.options)
            break
          case 'cancel':
            if (op.ids) await cancel(op.ids)
            break
          case 'cancelAll':
            await cancelAll()
            break
        }
      }
    },
    [sendNotification, cancel, cancelAll]
  )

  // ============================================
  // Return API
  // ============================================

  return {
    // State
    permission,
    isSupported,
    platform,
    isTauriEnv: platform.startsWith('tauri'),
    isMobile: platform === 'tauri-android' || platform === 'tauri-ios',

    // Permission
    requestPermission,

    // Core methods
    sendNotification,
    show, // Alias

    // Typed convenience methods
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Scheduling
    scheduleNotification,

    // Notification management
    cancel,
    cancelAll,
    getPending,
    getActive,
    removeActive,
    removeAllActive,
    batch,

    // Channel management (Android)
    createChannel,
    deleteChannel,
    listChannels,
    initializeAndroidChannels,

    // Action types (Mobile)
    registerActionTypes,

    // Event listeners
    onNotificationReceived,
    onAction,

    // Re-export enums for convenience
    Importance,
    Visibility,
  }
}

// Re-export types
export type {
  NotificationType,
  NotificationPlatform,
  NotificationChannel,
  NotificationOptions,
  EnhancedNotificationOptions,
  PendingNotification,
  ActiveNotification,
  ActionType,
  NotificationReceivedEvent,
  ActionPerformedEvent,
}
