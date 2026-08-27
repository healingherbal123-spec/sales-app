import { MessageRecipient, MessageTemplate } from '@/types/messaging';

// SMS Provider Configuration (Example: Africa's Talking)
const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_USERNAME = process.env.SMS_USERNAME;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID;

// Email Provider Configuration (Example: Resend)
const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

// ============================================
// SEND SMS
// ============================================
export async function sendBulkSMS(
  recipients: MessageRecipient[],
  message: string,
  senderId: string = SMS_SENDER_ID
) {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      // Using Africa's Talking API (replace with your provider)
      const response = await fetch('https://api.africastalking.com/version1/messaging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'apiKey': SMS_API_KEY!,
        },
        body: new URLSearchParams({
          username: SMS_USERNAME!,
          to: recipient.phone,
          message: message,
          from: senderId,
        }),
      });
      
      const data = await response.json();
      
      results.push({
        recipient: recipient,
        success: data.SMSMessageData?.Recipients?.[0]?.status === 'Success',
        response: data,
      });
      
      // Rate limiting - avoid sending too fast
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      results.push({
        recipient: recipient,
        success: false,
        error: error,
      });
    }
  }
  
  return results;
}

// ============================================
// SEND EMAILS
// ============================================
export async function sendBulkEmails(
  recipients: MessageRecipient[],
  subject: string,
  body: string,
  from: string = EMAIL_FROM!
) {
  const results = [];
  
  // Split recipients into batches of 50 (to avoid rate limits)
  const batches = chunkArray(recipients, 50);
  
  for (const batch of batches) {
    try {
      // Using Resend API (replace with your provider)
      const response = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EMAIL_API_KEY}`,
        },
        body: JSON.stringify({
          from: from,
          subject: subject,
          html: body,
          to: batch.map(r => r.email),
        }),
      });
      
      const data = await response.json();
      
      batch.forEach(recipient => {
        results.push({
          recipient: recipient,
          success: data?.data?.id ? true : false,
          response: data,
        });
      });
      
    } catch (error) {
      batch.forEach(recipient => {
        results.push({
          recipient: recipient,
          success: false,
          error: error,
        });
      });
    }
    
    // Rate limiting - avoid sending too fast
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

// ============================================
// SEND BOTH SMS AND EMAIL
// ============================================
export async function sendBulkMessages(
  recipients: MessageRecipient[],
  template: MessageTemplate,
  options: {
    sendSMS?: boolean;
    sendEmail?: boolean;
    schedule?: Date;
  } = {}
) {
  const results = {
    sms: [],
    email: [],
    total: recipients.length,
    sent: 0,
    failed: 0,
  };
  
  // Send SMS
  if (options.sendSMS !== false) {
    const smsBody = template.body.replace(/\n/g, ' ');
    const smsResults = await sendBulkSMS(recipients, smsBody);
    results.sms = smsResults;
    results.sent += smsResults.filter(r => r.success).length;
    results.failed += smsResults.filter(r => !r.success).length;
  }
  
  // Send Email
  if (options.sendEmail !== false) {
    const emailBody = `<html><body>${template.body.replace(/\n/g, '<br/>')}</body></html>`;
    const emailResults = await sendBulkEmails(recipients, template.subject, emailBody);
    results.email = emailResults;
    results.sent += emailResults.filter(r => r.success).length;
    results.failed += emailResults.filter(r => !r.success).length;
  }
  
  return results;
}

// ============================================
// HELPER: CHUNK ARRAY
// ============================================
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}