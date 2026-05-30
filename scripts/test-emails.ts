/**
 * Email Test Script
 * 
 * Sends all 4 email templates to verify they're working correctly:
 *   1. Admin contact notification  (sendContactEmail)
 *   2. Customer contact confirmation (sendContactConfirmation)
 *   3. Admin booking notification   (sendBookingEmail)
 *   4. Customer booking confirmation (sendBookingConfirmation)
 * 
 * Usage:
 *   cd asronixtech && node --env-file=.env.local --import tsx scripts/test-emails.ts
 *   cd asronixtech && node --env-file=.env.local --import tsx scripts/test-emails.ts custom@email.com
 */

import {
  sendContactEmail,
  sendContactConfirmation,
  sendBookingEmail,
  sendBookingConfirmation,
} from "../src/lib/email";

async function main() {
  const testEmail = process.argv[2] || process.env.SMTP_USER;

  if (!testEmail) {
    console.error("\n❌ No test email address found.");
    console.error("   Pass one as an argument or set SMTP_USER in .env.local");
    console.error("   Usage: node --env-file=.env.local --import tsx scripts/test-emails.ts your@email.com\n");
    process.exit(1);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   📧 ASRONIXTECH Email Template Test");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`   Sending test emails to: ${testEmail}\n`);

  let passed = 0;
  let failed = 0;

  // ── Test 1: Admin Contact Notification ──────────────────────────
  console.log("──────────────────────────────────────────────────────");
  console.log("   Test 1: Admin Contact Notification");
  console.log("   (sendContactEmail → admin inbox)");
  console.log("──────────────────────────────────────────────────────");
  try {
    await sendContactEmail({
      name: "Test User",
      email: testEmail,
      message:
        "This is a test message from the email verification script.\n\n" +
        "I'm interested in your web development services for my business website. " +
        "I need a modern, responsive site with an e-commerce integration. " +
        "Looking forward to your response!",
    });
    console.log("   ✅ Sent successfully\n");
    passed++;
  } catch (err) {
    console.error(`   ❌ Failed: ${err instanceof Error ? err.message : err}\n`);
    failed++;
  }

  // ── Test 2: Customer Contact Confirmation ───────────────────────
  console.log("──────────────────────────────────────────────────────");
  console.log("   Test 2: Customer Contact Confirmation");
  console.log("   (sendContactConfirmation → test inbox)");
  console.log("──────────────────────────────────────────────────────");
  try {
    await sendContactConfirmation({
      name: "Test User",
      email: testEmail,
      message:
        "Hi, I'd like to inquire about your SEO optimization packages. " +
        "We're a small e-commerce business looking to improve our search rankings. " +
        "Please share your pricing and approach.",
    });
    console.log("   ✅ Sent successfully\n");
    passed++;
  } catch (err) {
    console.error(`   ❌ Failed: ${err instanceof Error ? err.message : err}\n`);
    failed++;
  }

  // ── Test 3: Admin Booking Notification ──────────────────────────
  console.log("──────────────────────────────────────────────────────");
  console.log("   Test 3: Admin Booking Notification");
  console.log("   (sendBookingEmail → admin inbox)");
  console.log("──────────────────────────────────────────────────────");
  try {
    await sendBookingEmail({
      service: "Web Development",
      budget: "$5,000 - $8,000",
      deadline: "4 weeks",
      name: "Test User",
      email: testEmail,
      phone: "+1-555-0123",
      description:
        "I need a complete e-commerce website for my clothing brand. " +
        "The site should include:\n" +
        "- Product catalog with categories\n" +
        "- Shopping cart and checkout\n" +
        "- Payment gateway integration\n" +
        "- Admin dashboard for inventory management\n" +
        "- Mobile responsive design\n\n" +
        "I have design mockups ready and can share them upon request.",
    });
    console.log("   ✅ Sent successfully\n");
    passed++;
  } catch (err) {
    console.error(`   ❌ Failed: ${err instanceof Error ? err.message : err}\n`);
    failed++;
  }

  // ── Test 4: Customer Booking Confirmation ───────────────────────
  console.log("──────────────────────────────────────────────────────");
  console.log("   Test 4: Customer Booking Confirmation");
  console.log("   (sendBookingConfirmation → test inbox)");
  console.log("──────────────────────────────────────────────────────");
  try {
    await sendBookingConfirmation({
      service: "Mobile App Development",
      budget: "$10,000 - $15,000",
      deadline: "8 weeks",
      name: "Test User",
      email: testEmail,
      phone: "+1-555-0123",
      description:
        "We're looking to build a cross-platform mobile app for our restaurant chain. " +
        "Features include:\n" +
        "- Menu browsing with images\n" +
        "- Online ordering and table reservations\n" +
        "- Loyalty rewards program\n" +
        "- Push notifications for promotions\n" +
        "- Integration with our existing POS system",
    });
    console.log("   ✅ Sent successfully\n");
    passed++;
  } catch (err) {
    console.error(`   ❌ Failed: ${err instanceof Error ? err.message : err}\n`);
    failed++;
  }

  // ── Summary ─────────────────────────────────────────────────────
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("   Results:");
  console.log(`   ✅ Passed: ${passed}/4`);
  if (failed > 0) {
    console.log(`   ❌ Failed: ${failed}/4`);
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  process.exit(failed > 0 ? 1 : 0);
}

main();
