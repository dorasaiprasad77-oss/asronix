import nodemailer from "nodemailer";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface BookingFormData {
  service: string;
  budget: string;
  deadline: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  fileData?: string;
  fileName?: string;
}

export interface ReplyFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ── Shared HTML Template Helpers ────────────────────────────────────

function emailWrapper(content: string): string {
  return `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">${content}</div>`;
}

function emailHeader(title: string, subtitle?: string, centered?: boolean): string {
  const align = centered ? "text-align: center;" : "";
  const subtitleHtml = subtitle
    ? `<p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">${subtitle}</p>`
    : "";
  return `<div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px; border-radius: 12px 12px 0 0;${align}">
    <h1 style="color: white; margin: 0 0 8px 0; font-size: 24px;">${title}</h1>
    ${subtitleHtml}
  </div>`;
}

function emailBody(content: string): string {
  return `<div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 32px;">
    ${content}
  </div>`;
}

function emailFooter(): string {
  return `<div style="text-align: center; padding: 24px 32px;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 4px 0;">ASRONIXTECH — Turning Ideas Into Reality</p>
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">Berhampur, Odisha | asronixtechagency.com</p>
  </div>`;
}

interface TableRow {
  label: string;
  value: string;
}

function emailTable(rows: TableRow[], labelWidth: string = "120px"): string {
  const rowHtmls = rows.map((row, i) => {
    const isLast = i === rows.length - 1;
    const borderStyle = isLast ? "" : "border-bottom: 1px solid #e5e7eb;";
    return `<tr>
      <td style="padding: 12px 16px; font-weight: 600; color: #374151; width: ${labelWidth}; ${borderStyle}">${row.label}</td>
      <td style="padding: 12px 16px; color: #111827; ${borderStyle}">${row.value}</td>
    </tr>`;
  });
  return `<table style="width: 100%; border-collapse: collapse; background: #f9fafb; border-radius: 8px; overflow: hidden;">
    ${rowHtmls.join("\n")}
  </table>`;
}

function emailSection(title: string, content: string): string {
  return `<div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
    <h3 style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">${title}</h3>
    ${content}
  </div>`;
}

function emailActionBox(title: string, opts: { items?: string[]; paragraph?: string }): string {
  return `<div style="margin-top: 24px; padding: 20px; background: #eff6ff; border-radius: 8px; border: 1px solid #dbeafe;">
    <h3 style="color: #2563eb; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">${title}</h3>
    ${opts.items
      ? `<ul style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px; font-size: 14px;">
          ${opts.items.map((item) => `<li>${item}</li>`).join("\n")}
        </ul>`
      : opts.paragraph
        ? `<p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">${opts.paragraph}</p>`
        : ""
    }
  </div>`;
}

function emailTemplate(headerContent: string, bodyContent: string): string {
  return emailWrapper(
    headerContent + emailBody(bodyContent) + emailFooter()
  );
}

// ── Transporter ────────────────────────────────────────────────────

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

// ── Email Functions ────────────────────────────────────────────────

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER || "";
  if (!to) throw new Error("CONTACT_EMAIL not configured");

  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${data.name}" <${process.env.SMTP_USER}>`,
    replyTo: data.email,
    to,
    subject: `📬 New Contact from ${data.name}`,
    html: emailTemplate(
      emailHeader("📬 New Contact Message", `From ${data.name}`),
      emailTable(
        [
          { label: "Name:", value: data.name },
          { label: "Email:", value: `<a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a>` },
        ],
        "100px"
      ) +
      emailSection("Message",
        `<p style="color: #111827; line-height: 1.6; margin: 0; white-space: pre-wrap; font-size: 14px;">${data.message}</p>`
      ) +
      emailActionBox("⚡ Action Required", {
        items: [
          `Reply to <strong>${data.email}</strong> within 24 hours`,
          "Review their inquiry and prepare a response",
        ],
      })
    ),
  });
}

export async function sendBookingConfirmation(data: BookingFormData): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"ASRONIXTECH Agency" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: `Booking Confirmation: ${data.service} | ASRONIXTECH`,
    html: emailTemplate(
      emailHeader("✅ Booking Confirmed!", "Thank you for choosing ASRONIXTECH", true),
      `<p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
        Hi <strong>${data.name}</strong>,
      </p>
      <p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
        Great news! We've received your project booking request. Here's a summary of what you submitted:
      </p>` +
      emailTable(
        [
          { label: "Service:", value: data.service },
          { label: "Budget:", value: data.budget || "Not specified" },
          { label: "Deadline:", value: data.deadline || "Flexible" },
          { label: "Email:", value: data.email },
          { label: "Phone:", value: data.phone || "Not provided" },
        ],
        "140px"
      ) +
      emailSection("Your Project Description",
        `<p style="color: #111827; line-height: 1.6; margin: 0; white-space: pre-wrap; font-size: 14px;">${data.description}</p>`
      ) +
      emailActionBox("⏰ What's Next?", {
        items: [
          "Our team will review your project within <strong>24 hours</strong>",
          `We'll reach out at <strong>${data.email}</strong> to discuss details`,
          "You'll receive a personalized proposal and timeline",
        ],
      }) +
      `<p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
        If you have any questions in the meantime, feel free to reply to this email or contact us directly at <strong>asronixtechagency@gmail.com</strong>.
      </p>`
    ),
  });
}

export async function sendAdminReply(data: ReplyFormData): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"ASRONIXTECH Agency" <${process.env.SMTP_USER}>`,
    replyTo: process.env.SMTP_USER || "",
    to: data.email,
    subject: `Re: ${data.subject} | ASRONIXTECH`,
    html: emailTemplate(
      emailHeader("💬 Reply from ASRONIXTECH", data.subject, true),
      `<p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
        Hi <strong>${data.name}</strong>,
      </p>
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <p style="color: #111827; line-height: 1.6; margin: 0; white-space: pre-wrap; font-size: 14px;">${data.message}</p>
      </div>` +
      emailActionBox("📞 Need a Quick Response?", {
        paragraph:
          'Feel free to reply directly to this email or call us at <strong>7377532141</strong>.',
      }) +
      `<p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
        Best regards,<br />
        <strong>Team ASRONIXTECH</strong>
      </p>`
    ),
  });
}

export async function sendContactConfirmation(data: ContactFormData): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"ASRONIXTECH Agency" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: "We've Received Your Message | ASRONIXTECH",
    html: emailTemplate(
      emailHeader("📬 Message Received!", "We'll get back to you soon", true),
      `<p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
        Hi <strong>${data.name}</strong>,
      </p>
      <p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
        Thank you for reaching out to ASRONIXTECH! We've received your message and our team will review it shortly.
      </p>
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Your Message</h3>
        <p style="color: #111827; line-height: 1.6; margin: 0; white-space: pre-wrap; font-style: italic; font-size: 14px;">
          &quot;${data.message.substring(0, 500)}${data.message.length > 500 ? "..." : ""}&quot;
        </p>
      </div>` +
      emailActionBox("⏰ What's Next?", {
        items: [
          "We aim to respond within <strong>24 hours</strong>",
          `We'll reply to you at <strong>${data.email}</strong>`,
          "One of our experts will connect with you personally",
        ],
      }) +
      `<p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
        If this is urgent, feel free to reach us directly at <strong>asronixtechagency@gmail.com</strong>.
      </p>`
    ),
  });
}

export async function sendBookingEmail(data: BookingFormData): Promise<void> {
  const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER || "";
  if (!to) throw new Error("CONTACT_EMAIL not configured");

  const transporter = getTransporter();

  const attachments: any[] = [];
  if (data.fileData && data.fileName) {
    attachments.push({
      filename: data.fileName,
      content: data.fileData,
      encoding: "base64",
    });
  }

  await transporter.sendMail({
    from: `"ASRONIXTECH Booking" <${process.env.SMTP_USER}>`,
    replyTo: data.email,
    to,
    subject: `📋 New Booking: ${data.service} from ${data.name}`,
    attachments: attachments.length > 0 ? attachments : undefined,
    html: emailTemplate(
      emailHeader("📋 New Project Booking", `${data.service} — ${data.name}`),
      emailTable(
        [
          { label: "Service:", value: data.service },
          { label: "Budget:", value: data.budget },
          { label: "Deadline:", value: data.deadline },
          { label: "Name:", value: data.name },
          { label: "Email:", value: `<a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a>` },
          { label: "Phone:", value: data.phone || "Not provided" },
        ],
        "120px"
      ) +
      emailSection("Project Description",
        `<p style="color: #111827; line-height: 1.6; margin: 0; white-space: pre-wrap; font-size: 14px;">${data.description}</p>`
      ) +
      emailActionBox("⚡ Action Required", {
        items: [
          `Contact <strong>${data.name}</strong> at <strong>${data.email}</strong> within 24 hours`,
          "Review the project requirements and budget",
          "Prepare a personalized proposal and timeline",
          `Follow up via phone at <strong>${data.phone || "N/A"}</strong> if needed`,
        ],
      })
    ),
  });
}
