import { BookingFormData } from "./email";

/**
 * Send a WhatsApp notification about a new booking to the admin.
 * Requires Twilio Account SID, Auth Token, and WhatsApp Sandbox number in .env.local:
 *   TWILIO_ACCOUNT_SID=your_account_sid
 *   TWILIO_AUTH_TOKEN=your_auth_token
 *   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
 *   ADMIN_WHATSAPP=whatsapp:+917377532141
 */
export async function sendBookingWhatsApp(data: BookingFormData): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_NUMBER;
  const to = process.env.ADMIN_WHATSAPP;

  if (!accountSid || !authToken || !from || !to) {
    console.warn(
      "WhatsApp notification skipped — missing Twilio credentials. " +
      "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER, and ADMIN_WHATSAPP in .env.local"
    );
    return;
  }

  const { default: twilio } = await import("twilio");
  const client = twilio(accountSid, authToken);

  const details = [
    `📋 *New Booking Alert*`,
    ``,
    `*Service:* ${data.service}`,
    `*Budget:* ${data.budget || "Not specified"}`,
    `*Deadline:* ${data.deadline || "Flexible"}`,
    `*Name:* ${data.name}`,
    `*Email:* ${data.email}`,
    `*Phone:* ${data.phone || "Not provided"}`,
  ];

  if (data.description) {
    details.push(``, `*Description:*`);
    // Truncate long descriptions for WhatsApp
    const desc = data.description.length > 200
      ? data.description.substring(0, 200) + "..."
      : data.description;
    details.push(desc);
  }

  details.push(
    ``,
    `⚡ _Action required — respond within 24 hours_`
  );

  await client.messages.create({
    body: details.join("\n"),
    from,
    to,
  });
}
