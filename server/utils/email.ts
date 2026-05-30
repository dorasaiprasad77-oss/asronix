import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface BookingDetails {
  customerName: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  preferredDate: string;
  projectDescription: string;
}

export async function sendAdminNotification(booking: BookingDetails) {
  const adminEmail = process.env.ADMIN_EMAIL || 'asronixtechagency@gmail.com';

  await transporter.sendMail({
    from: `"ASRONIX TECH AGENCY" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: '🔔 New Booking Received – ASRONIX TECH AGENCY',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f7f9fc;">
        <div style="background: linear-gradient(135deg, #00aaff, #6a00ff); padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">📋 New Booking Request</h1>
          <p style="color: rgba(255,255,255,0.85); font-size: 16px; margin-top: 8px;">ASRONIX TECH AGENCY</p>
        </div>

        <div style="background: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #8899aa; font-size: 14px;">Customer Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a2e; font-size: 14px; font-weight: 600; text-align: right;">${booking.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #8899aa; font-size: 14px;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #00aaff; font-size: 14px; text-align: right;"><a href="mailto:${booking.email}" style="color: #00aaff; text-decoration: none;">${booking.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #8899aa; font-size: 14px;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a2e; font-size: 14px; font-weight: 600; text-align: right;">${booking.phone}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #8899aa; font-size: 14px;">Service</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a2e; font-size: 14px; font-weight: 600; text-align: right;">${booking.service}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #8899aa; font-size: 14px;">Budget</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a2e; font-size: 14px; font-weight: 600; text-align: right;">${booking.budget}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #8899aa; font-size: 14px;">Preferred Date</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; color: #1a1a2e; font-size: 14px; font-weight: 600; text-align: right;">${booking.preferredDate}</td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding: 16px; background: #f7f9fc; border-radius: 12px;">
            <p style="color: #8899aa; font-size: 13px; margin: 0 0 8px 0;">Project Description</p>
            <p style="color: #1a1a2e; font-size: 14px; margin: 0; line-height: 1.6;">${booking.projectDescription}</p>
          </div>

          <div style="margin-top: 24px; padding: 16px; background: #fff3e0; border-radius: 12px; text-align: center;">
            <p style="color: #e65100; font-size: 13px; margin: 0;">Booking Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000/admin/dashboard'}" style="display: inline-block; background: linear-gradient(135deg, #00aaff, #6a00ff); color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">View in Dashboard</a>
        </div>

        <p style="color: #8899aa; font-size: 12px; text-align: center; margin-top: 30px;">ASRONIX TECH AGENCY – Ideas. Innovation. Impact.</p>
      </div>
    `,
  });
}

export async function sendCustomerConfirmation(booking: BookingDetails) {
  await transporter.sendMail({
    from: `"ASRONIX TECH AGENCY" <${process.env.SMTP_USER}>`,
    to: booking.email,
    subject: 'Booking Confirmation – ASRONIX TECH AGENCY',
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f7f9fc;">
        <div style="background: linear-gradient(135deg, #00aaff, #6a00ff); padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Thank You!</h1>
          <p style="color: rgba(255,255,255,0.85); font-size: 16px; margin-top: 8px;">Your booking has been received</p>
        </div>

        <div style="background: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          <p style="color: #1a1a2e; font-size: 16px; line-height: 1.6;">Dear ${booking.customerName},</p>
          <p style="color: #444; font-size: 15px; line-height: 1.6;">Thank you for choosing <strong>ASRONIX TECH AGENCY</strong>.</p>
          <p style="color: #444; font-size: 15px; line-height: 1.6;">Your booking request has been successfully received. Our team will review your requirements and contact you shortly.</p>

          <div style="margin: 24px 0; padding: 20px; background: #f7f9fc; border-radius: 12px;">
            <h3 style="color: #1a1a2e; font-size: 16px; margin: 0 0 16px 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #8899aa; font-size: 14px;">Service</td>
                <td style="padding: 8px 0; color: #1a1a2e; font-size: 14px; font-weight: 600; text-align: right;">${booking.service}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-top: 1px solid #f0f0f0; color: #8899aa; font-size: 14px;">Budget</td>
                <td style="padding: 8px 0; border-top: 1px solid #f0f0f0; color: #1a1a2e; font-size: 14px; font-weight: 600; text-align: right;">${booking.budget}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-top: 1px solid #f0f0f0; color: #8899aa; font-size: 14px;">Preferred Date</td>
                <td style="padding: 8px 0; border-top: 1px solid #f0f0f0; color: #1a1a2e; font-size: 14px; font-weight: 600; text-align: right;">${booking.preferredDate}</td>
              </tr>
            </table>
          </div>

          <p style="color: #444; font-size: 15px; line-height: 1.6;">We will get back to you within 24 hours.</p>

          <p style="color: #444; font-size: 15px; line-height: 1.6;">
            Warm regards,<br/>
            <strong style="color: #1a1a2e;">ASRONIX TECH AGENCY</strong><br/>
            <span style="color: #00aaff;">asronixtechagency@gmail.com</span>
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="https://wa.me/917377532141" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 500;">Chat on WhatsApp</a>
        </div>

        <p style="color: #8899aa; font-size: 12px; text-align: center; margin-top: 20px;">ASRONIX TECH AGENCY – Ideas. Innovation. Impact.</p>
      </div>
    `,
  });
}
