export interface MessageRecipient {
  id: string;
  name: string;
  email: string;
  phone: string;
  category?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'sms' | 'both';
}

export interface BulkMessage {
  id: string;
  recipients: MessageRecipient[];
  template: MessageTemplate;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  sent_at?: string;
  sent_count: number;
  failed_count: number;
  scheduled_for?: string;
  created_at: string;
}