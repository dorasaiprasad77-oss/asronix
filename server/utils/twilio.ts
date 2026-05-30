import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
const adminPhone = process.env.ADMIN_PHONE;

interface BookingDetails {
  customerName: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  projectDescription: string;
}

export async function sendAdminSMS(booking: BookingDetails) {
  if (!accountSid || !authToken || !twilioPhone || !adminPhone) {
    console.log('Twilio not configured, skipping admin SMS');
    return;
  }

  try {
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: `🔔 New Booking!\nName: ${booking.customerName}\nEmail: ${booking.email}\nPhone: ${booking.phone}\nService: ${booking.service}\nBudget: ${booking.budget}\nProject: ${booking.projectDescription.substring(0, 100)}`,
      from: twilioPhone,
      to: adminPhone,
    });
    console.log('Admin SMS sent successfully');
  } catch (error) {
    console.error('Failed to send admin SMS:', error);
  }
}

export async function sendCustomerSMS(phone: string, customerName: string) {
  if (!accountSid || !authToken || !twilioPhone) {
    console.log('Twilio not configured, skipping customer SMS');
    return;
  }

  try {
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: `Thank you for booking with ASRONIX TECH AGENCY, ${customerName}! We have received your request and our team will contact you soon.`,
      from: twilioPhone,
      to: phone,
    });
    console.log('Customer SMS sent successfully');
  } catch (error) {
    console.error('Failed to send customer SMS:', error);
  }
}
