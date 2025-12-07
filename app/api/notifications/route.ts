import { NextRequest, NextResponse } from "next/server";
import { Notification } from "@/types";

// Mock notification messages - realistic examples
const mockMessages = [
  "Your order #ORD-2024-1245 has been shipped",
  "Payment of $299.99 for subscription renewal was successful",
  "New comment from @alex_martin on your post 'Project Update'",
  "Security alert: Login detected from new device in San Francisco",
  "Your document 'Q4_Report.pdf' has been approved",
  "Meeting reminder: Team standup in 15 minutes",
  "Your withdrawal request of $500.00 has been processed",
  "New follower: @sarah_johnson started following you",
  "Your support ticket #TKT-7892 has been resolved",
  "Invoice #INV-4567 is due in 3 days",
  "Your account verification is complete",
  "New message in #general channel from @team_lead",
  "Your backup completed successfully - 2.5 GB stored",
  "System maintenance scheduled for tonight at 2:00 AM",
  "Your subscription will renew on March 15, 2024",
  "New review received: 5 stars for 'Product Launch'",
  "Your password was changed successfully",
  "New assignment: Review PR #234 in repository",
  "Your file 'presentation.pptx' was shared with 3 people",
  "Weekly report is ready for download",
];

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
        mockMessages[Math.floor(Math.random() * mockMessages.length)];
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
