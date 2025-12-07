import { NextRequest, NextResponse } from "next/server";
import { Notification } from "@/types";
import { MOCK_NOTIFICATION_MESSAGES } from "@/constants";

let notificationIdCounter = 1;

export async function GET() {
  // Return current notifications (in a real app, this would fetch from a database)
  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "generate") {
      // Generate a random notification
      const randomMessage =
        MOCK_NOTIFICATION_MESSAGES[Math.floor(Math.random() * MOCK_NOTIFICATION_MESSAGES.length)];
      const notification: Notification = {
        id: `notif-${Date.now()}-${notificationIdCounter++}`,
        message: randomMessage,
        timestamp: new Date().toISOString(),
        read: false,
      };

      return NextResponse.json({ success: true, notification });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
