import type { NextApiRequest, NextApiResponse } from 'next';
type ErrorResponse = {
  message: string;
  error?: string;
};

type SuccessResponse = {
  id?: string;
  recipients?: number;
  errors?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, title, message, sendAfter } = req.body;

    // Validate required fields
    if (!userId || !title || !message || !sendAfter) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        include_player_ids: [userId],
        headings: { en: title },
        contents: { en: message },
        send_after: sendAfter,
        delayed_option: "timezone",
        delivery_time_of_day: new Date(sendAfter).toTimeString().split(' ')[0],
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors?.[0] || 'Failed to schedule notification');
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error scheduling notification:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error scheduling notification', error: error.message });
    } else {
      res.status(500).json({ message: 'Error scheduling notification', error: String(error) });
    }
  }
}