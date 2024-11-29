"use client";

interface NotificationPayload {
  title: string;
  message: string;
  url?: string;
  sendAfter?: string;
}

export const scheduleNotification = async (payload: NotificationPayload) => {
  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        contents: { en: payload.message },
        headings: { en: payload.title },
        url: payload.url,
        send_after: payload.sendAfter,
        delayed_option: "timezone",
        delivery_time_of_day: payload.sendAfter ? new Date(payload.sendAfter).toTimeString().split(' ')[0] : undefined,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to schedule notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error scheduling notification:', error);
    throw error;
  }
}; 