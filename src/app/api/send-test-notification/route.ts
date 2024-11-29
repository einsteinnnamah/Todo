import { NextResponse } from 'next/server';

// Type for the expected request body
interface NotificationRequest {
  userId: string;
  title: string;
  message: string;
  sendAfter: string;
}

export async function POST(request: Request) {
  try {
    // Validate request method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Parse and validate request body
    const body = await request.json() as NotificationRequest;
    const { userId, title, message, sendAfter } = body;

    if (!userId || !title || !message || !sendAfter) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate environment variables
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    const apiKey = process.env.ONESIGNAL_REST_API_KEY;

    if (!appId || !apiKey) {
      console.error('Missing OneSignal configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Send notification to OneSignal
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: appId,
        include_player_ids: [userId],
        headings: { en: title },
        contents: { en: message },
        send_after: sendAfter,
        delayed_option: "timezone",
        delivery_time_of_day: new Date(sendAfter).toTimeString().split(' ')[0],
        // Additional options for better delivery
        isAnyWeb: true,
        priority: 10,
        ttl: 86400, // 24 hours in seconds
      })
    });

    const data = await response.json();
    
    // Handle OneSignal API errors
    if (!response.ok) {
      console.error('OneSignal API error:', data);
      return NextResponse.json(
        { 
          error: 'Failed to schedule notification',
          details: data.errors?.[0] || 'Unknown error'
        },
        { status: response.status }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        notification_id: data.id,
        recipients: data.recipients,
        scheduled_at: sendAfter
      }
    });

  } catch (error) {
    // Log the full error for debugging
    console.error('Error scheduling notification:', error);

    // Return a safe error response
    return NextResponse.json(
      { 
        error: 'Error scheduling notification',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 