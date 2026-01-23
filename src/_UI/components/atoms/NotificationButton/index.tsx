'use client'

import { useState, useLayoutEffect, useEffect } from 'react'
import { Button, ButtonProps } from '../Button'
import { useNotification } from '@/hooks/use-notification'
import { useTranslations } from 'next-intl'
import type { NotificationType, EnhancedNotificationOptions } from '@/types/notification'

export interface NotificationButtonProps extends Omit<ButtonProps, 'onClick'> {
  notificationTitle?: string
  notificationBody?: string
  notificationType?: NotificationType
  notificationOptions?: Partial<EnhancedNotificationOptions>
  onNotificationSent?: () => void
  onNotificationError?: (error: Error) => void
  /** @deprecated Use onNotificationSent instead */
  onNotificationClick?: () => void
}

export function NotificationButton({
  notificationTitle,
  notificationBody,
  notificationType = 'default',
  notificationOptions,
  onNotificationSent,
  onNotificationError,
  onNotificationClick,
  children,
  ...buttonProps
}: NotificationButtonProps) {
  const t = useTranslations('notifications')
  const {
    permission,
    requestPermission,
    sendNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    isSupported,
    platform,
  } = useNotification()
  const [isRequesting, setIsRequesting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = async () => {
    if (!mounted || !isSupported) {
      return
    }

    if (permission === 'default') {
      setIsRequesting(true)
      const granted = await requestPermission()
      setIsRequesting(false)

      if (!granted) {
        alert(t('permissionDenied'))
        return
      }
    }

    if (permission === 'denied') {
      alert(t('permissionDeniedMessage'))
      return
    }

    try {
      const title = notificationTitle || t(`types.${notificationType}.defaultTitle`)
      const body = notificationBody || t(`types.${notificationType}.defaultBody`)

      // Use typed methods based on notification type
      switch (notificationType) {
        case 'success':
          await showSuccess(title, body, notificationOptions)
          break
        case 'error':
          await showError(title, body, notificationOptions)
          break
        case 'warning':
          await showWarning(title, body, notificationOptions)
          break
        case 'info':
          await showInfo(title, body, notificationOptions)
          break
        default:
          await sendNotification({
            title,
            body,
            type: notificationType,
            // On Tauri Android, use app icon; on web use specified icon
            icon: platform.startsWith('tauri') ? undefined : '/icons/icon-192x192.png',
            tag: 'app-notification',
            requireInteraction: false,
            ...notificationOptions,
          })
      }

      // Call success callbacks
      onNotificationSent?.()
      onNotificationClick?.() // Legacy support
    } catch (error) {
      console.error('[NotificationButton] Error sending notification:', error)
      onNotificationError?.(error as Error)
    }
  }

  // Get button text based on notification type
  const getButtonText = () => {
    if (children) return children

    // Try to get type-specific text, fallback to generic
    try {
      return t(`buttons.${notificationType}`)
    } catch {
      return t('showNotification')
    }
  }

  const defaultText = getButtonText()

  // Ensure disabled is always an explicit boolean
  const isDisabled = Boolean(!mounted || !isSupported || isRequesting || permission === 'denied')

  // Debug logging
  useEffect(() => {
    if (mounted) {
      console.log('[NotificationButton] State:', {
        mounted,
        isSupported,
        permission,
        platform,
        notificationType,
        isRequesting,
        isDisabled,
      })
    }
  }, [mounted, isSupported, permission, platform, notificationType, isRequesting, isDisabled])

  // Get appropriate button text based on state
  const buttonText = !mounted
    ? defaultText
    : !isSupported
      ? defaultText
      : isRequesting
        ? t('requesting')
        : permission === 'denied'
          ? t('permissionDenied')
          : defaultText

  // Ensure disabled is passed after buttonProps to take priority
  const { disabled: _, ...restButtonProps } = buttonProps

  return (
    <Button {...restButtonProps} onClick={handleClick} disabled={isDisabled}>
      {buttonText}
    </Button>
  )
}
