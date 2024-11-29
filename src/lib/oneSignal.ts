interface NotificationOptions {
  title: string;
  message: string;
  sendAfter?: string;
  url?: string;
}

// Check if OneSignal is available and initialized
const isOneSignalAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.OneSignal;
};

// Initialize OneSignal features
export const initializeOneSignal = async () => {
  if (!isOneSignalAvailable()) {
    console.error('OneSignal is not available');
    return false;
  }

  try {
    const isPushSupported = await window.OneSignal.Notifications.isPushSupported();
    if (!isPushSupported) {
      console.log('Push notifications are not supported');
      return false;
    }

    // Check current permission status
    const permission = await window.OneSignal.Notifications.permission;
    return permission;
  } catch (error) {
    console.error('OneSignal initialization error:', error);
    return false;
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!isOneSignalAvailable()) {
    return false;
  }

  try {
    // First check if push
    const isPushSupported = await window.OneSignal.Notifications.isPushSupported();
    if (!isPushSupported) {
      console.log('Push notifications are not supported');
      return false;
    }

    // Check current permission status
    const permission = await window.OneSignal.Notifications.permission;
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const scheduleNotification = async (options: NotificationOptions) => {
  if (typeof window === 'undefined' || !window.OneSignal) {
    return false;
  }

  try {
    const userId = await window.OneSignal.User.pushSubscription.id;
    if (!userId) {
      throw new Error('User not subscribed to notifications');
    }

    const response = await fetch('/api/schedule-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title: options.title,
        message: options.message,
        sendAfter: options.sendAfter,
        url: options.url,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to schedule notification');
    }

    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
};