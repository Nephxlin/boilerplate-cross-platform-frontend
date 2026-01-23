/**
 * Notification Types and Interfaces
 * Based on Tauri v2 Notification Plugin API
 * @see https://v2.tauri.app/plugin/notification/
 */

// ============================================
// Core Types
// ============================================

/** Notification type for visual styling and behavior */
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'default'

/** Platform detection types */
export type NotificationPlatform = 'tauri-android' | 'tauri-ios' | 'tauri-desktop' | 'web' | 'pwa'

/** Permission state */
export type PermissionState = 'granted' | 'denied' | 'prompt' | 'prompt-with-rationale'

// ============================================
// Channel Types (Android)
// ============================================

/** Channel importance levels (Android) */
export enum Importance {
  None = 0,
  Min = 1,
  Low = 2,
  Default = 3,
  High = 4,
}

/** Channel visibility levels (Android) */
export enum Visibility {
  Secret = -1,
  Private = 0,
  Public = 1,
}

/** Android notification channel configuration */
export interface NotificationChannel {
  /** Unique channel identifier */
  id: string
  /** Display name for the channel */
  name: string
  /** Channel description */
  description?: string
  /** Sound resource name or file path */
  sound?: string
  /** Enable notification light */
  lights?: boolean
  /** Light color (hex string) */
  lightColor?: string
  /** Enable vibration */
  vibration?: boolean
  /** Channel importance level */
  importance?: Importance
  /** Channel visibility level */
  visibility?: Visibility
}

// ============================================
// Action Types (Mobile Only)
// ============================================

/** Notification action button */
export interface NotificationAction {
  /** Unique action identifier */
  id: string
  /** Button display text */
  title: string
  /** Require device authentication before action */
  requiresAuthentication?: boolean
  /** Bring app to foreground on action */
  foreground?: boolean
  /** Mark as destructive action (red styling on iOS) */
  destructive?: boolean
  /** Enable text input */
  input?: boolean
  /** Text for input submit button */
  inputButtonTitle?: string
  /** Placeholder text for input field */
  inputPlaceholder?: string
}

/** Action type group for registering multiple actions */
export interface ActionType {
  /** Unique identifier for this action type */
  id: string
  /** List of associated actions */
  actions: NotificationAction[]
  /** Placeholder for hidden preview body (iOS) */
  hiddenPreviewsBodyPlaceholder?: string
  /** Allow custom dismiss action (iOS) */
  customDismissAction?: boolean
  /** Allow in CarPlay (iOS) */
  allowInCarPlay?: boolean
  /** Show title in hidden previews (iOS) */
  hiddenPreviewsShowTitle?: boolean
  /** Show subtitle in hidden previews (iOS) */
  hiddenPreviewsShowSubtitle?: boolean
}

// ============================================
// Attachment Types
// ============================================

/** Notification attachment (images, media) */
export interface NotificationAttachment {
  /** Unique attachment identifier */
  id: string
  /** Media URL using asset:// or file:// protocol */
  url: string
}

// ============================================
// Schedule Types
// ============================================

/** Schedule interval configuration */
export interface ScheduleInterval {
  year?: number
  month?: number
  day?: number
  /** 1=Sunday, 2=Monday, ..., 7=Saturday */
  weekday?: number
  hour?: number
  minute?: number
  second?: number
}

/** Schedule repeat interval */
export enum ScheduleEvery {
  Year = 'year',
  Month = 'month',
  TwoWeeks = 'twoWeeks',
  Week = 'week',
  Day = 'day',
  Hour = 'hour',
  Minute = 'minute',
  /** Not supported on iOS */
  Second = 'second',
}

/** Notification schedule configuration */
export interface NotificationSchedule {
  /** Schedule at specific date/time */
  at?: Date
  /** Repeat at intervals */
  interval?: ScheduleInterval
  /** Repeat every period */
  every?: ScheduleEvery
  /** Number of times to repeat */
  count?: number
  /** Allow notification when device is idle (Android) */
  allowWhileIdle?: boolean
}

// ============================================
// Notification Options
// ============================================

/** Full notification options based on Tauri API */
export interface NotificationOptions {
  /** Notification identifier (32-bit integer) */
  id?: number
  /** Channel ID for delivery (Android) */
  channelId?: string
  /** Notification title */
  title: string
  /** Notification body text */
  body?: string
  /** Schedule for later delivery */
  schedule?: NotificationSchedule
  /** Large body text (changes to big text style) */
  largeBody?: string
  /** Summary text for largeBody, inboxLines, or groupSummary */
  summary?: string
  /** Action type ID for this notification */
  actionTypeId?: string
  /** Group identifier for threading */
  group?: string
  /** Mark as group summary (Android) */
  groupSummary?: boolean
  /** Sound resource name or file path */
  sound?: string
  /** Inbox style lines (max 5, cannot use with largeBody) */
  inboxLines?: string[]
  /** Icon resource name (Android: must be in res/drawable) */
  icon?: string
  /** Large icon resource name (Android) */
  largeIcon?: string
  /** Icon color (Android) */
  iconColor?: string
  /** Media attachments */
  attachments?: NotificationAttachment[]
  /** Extra data payload */
  extra?: Record<string, unknown>
  /** Cannot be dismissed by user (Android) */
  ongoing?: boolean
  /** Auto-cancel on click */
  autoCancel?: boolean
  /** Silent notification (iOS: no badge, sound, or listing) */
  silent?: boolean
  /** Notification visibility */
  visibility?: Visibility
  /** Badge number (Android) */
  number?: number
}

/** Enhanced notification options with type support */
export interface EnhancedNotificationOptions extends NotificationOptions {
  /** Notification type for styling */
  type?: NotificationType
  /** Web-specific: require user interaction to dismiss */
  requireInteraction?: boolean
  /** Web-specific: notification tag for replacing */
  tag?: string
  /** Web-specific: badge icon URL */
  badge?: string
}

// ============================================
// Active/Pending Notification Types
// ============================================

/** Pending (scheduled) notification */
export interface PendingNotification {
  id: number
  title?: string
  body?: string
  schedule: NotificationSchedule
}

/** Active (displayed) notification */
export interface ActiveNotification {
  id: number
  tag?: string
  title?: string
  body?: string
  group?: string
  groupSummary: boolean
  data: Record<string, string>
  extra: Record<string, unknown>
  attachments: NotificationAttachment[]
  actionTypeId?: string
  schedule?: NotificationSchedule
  sound?: string
}

// ============================================
// Event Types
// ============================================

/** Notification received event payload */
export interface NotificationReceivedEvent {
  id?: number
  title: string
  body?: string
  extra?: Record<string, unknown>
}

/** Action performed event payload */
export interface ActionPerformedEvent {
  id: number
  actionId: string
  inputValue?: string
  notification: NotificationReceivedEvent
}

// ============================================
// Pre-defined Channels
// ============================================

/** Pre-defined notification channels for Android */
export const NOTIFICATION_CHANNELS: Record<NotificationType, NotificationChannel> = {
  default: {
    id: 'default',
    name: 'General',
    description: 'General notifications',
    importance: Importance.Default,
    visibility: Visibility.Public,
    vibration: true,
    lights: true,
  },
  success: {
    id: 'success',
    name: 'Success',
    description: 'Success notifications',
    importance: Importance.Default,
    visibility: Visibility.Public,
    vibration: true,
    lights: true,
    lightColor: '#22c55e',
  },
  error: {
    id: 'error',
    name: 'Errors',
    description: 'Error notifications',
    importance: Importance.High,
    visibility: Visibility.Public,
    vibration: true,
    lights: true,
    lightColor: '#ef4444',
  },
  warning: {
    id: 'warning',
    name: 'Warnings',
    description: 'Warning notifications',
    importance: Importance.High,
    visibility: Visibility.Public,
    vibration: true,
    lights: true,
    lightColor: '#f59e0b',
  },
  info: {
    id: 'info',
    name: 'Information',
    description: 'Informational notifications',
    importance: Importance.Low,
    visibility: Visibility.Public,
    vibration: false,
    lights: true,
    lightColor: '#3b82f6',
  },
}

/** Pre-defined action types */
export const DEFAULT_ACTION_TYPES: ActionType[] = [
  {
    id: 'default-actions',
    actions: [
      { id: 'view', title: 'View', foreground: true },
      { id: 'dismiss', title: 'Dismiss', destructive: true },
    ],
  },
  {
    id: 'reply-actions',
    actions: [
      { id: 'reply', title: 'Reply', input: true, inputPlaceholder: 'Type your reply...' },
      { id: 'dismiss', title: 'Dismiss', destructive: true },
    ],
  },
  {
    id: 'confirm-actions',
    actions: [
      { id: 'confirm', title: 'Confirm', foreground: true },
      { id: 'cancel', title: 'Cancel', destructive: true },
    ],
  },
]

/** Icons for notification types (used on web/desktop) */
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  default: '/icons/icon-192x192.png',
  success: '/icons/icon-192x192.png',
  error: '/icons/icon-192x192.png',
  warning: '/icons/icon-192x192.png',
  info: '/icons/icon-192x192.png',
}
