"use client";

import { useState } from "react";
import {
  X,
  Send,
  Mail,
  MessageSquare,
  Users,
  Clock,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface MessageRecipient {
  id: string;
  name: string;
  email: string;
  phone: string;
  category?: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'sms' | 'both';
}

interface BulkMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: MessageRecipient[];
  templates: MessageTemplate[];
  onSend: (data: any) => Promise<void>;
}

export function BulkMessageModal({
  isOpen,
  onClose,
  recipients,
  templates,
  onSend,
}: BulkMessageModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [messageType, setMessageType] = useState<'email' | 'sms' | 'both'>('both');
  const [schedule, setSchedule] = useState<Date | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [results, setResults] = useState<{
    sent: number;
    failed: number;
    total: number;
  } | null>(null);

  const handleSend = async () => {
    setSending(true);
    try {
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) return;

      await onSend({
        recipients,
        template,
        messageType,
        schedule,
      });

      setSent(true);
      setResults({
        total: recipients.length,
        sent: recipients.length - 0,
        failed: 0,
      });
    } catch (error) {
      console.error("Failed to send messages:", error);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#171A24] dark:text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-[#635BFF]" />
            Send Bulk Message
          </h3>
          <button
            onClick={onClose}
            className="text-[#737987] hover:text-[#171A24] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          // Success State
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-[#171A24] dark:text-white">Messages Sent!</h4>
              <p className="text-sm text-[#737987] dark:text-gray-400">
                Your messages have been sent successfully.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-[#14171f] p-3 rounded-xl text-center">
                <p className="text-xs text-[#737987] dark:text-gray-400">Total</p>
                <p className="text-xl font-bold text-[#171A24] dark:text-white">{results?.total}</p>
              </div>
              <div className="bg-slate-50 dark:bg-[#14171f] p-3 rounded-xl text-center">
                <p className="text-xs text-[#737987] dark:text-gray-400">Sent</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{results?.sent}</p>
              </div>
              <div className="bg-slate-50 dark:bg-[#14171f] p-3 rounded-xl text-center">
                <p className="text-xs text-[#737987] dark:text-gray-400">Failed</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">{results?.failed}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSent(false);
                  setResults(null);
                }}
                className="flex-1 bg-[#635BFF] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#5549e8] transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Another
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-[#737987] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          // Form State
          <div className="space-y-4">
            {/* Recipients Summary */}
            <div className="bg-slate-50 dark:bg-[#14171f] p-3 rounded-xl">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-[#737987]" />
                <span className="text-[#737987] dark:text-gray-400">
                  Sending to <strong className="text-[#171A24] dark:text-white">{recipients.length}</strong> contacts
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {recipients.slice(0, 5).map((r) => (
                  <span key={r.id} className="text-xs bg-white dark:bg-[#1a1d27] px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                    {r.name}
                  </span>
                ))}
                {recipients.length > 5 && (
                  <span className="text-xs text-[#737987]">+{recipients.length - 5} more</span>
                )}
              </div>
            </div>

            {/* Message Type */}
            <div>
              <label className="block text-sm font-medium text-[#171A24] dark:text-white mb-2">
                Message Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMessageType('email')}
                  className={`px-4 py-2 rounded-xl border transition flex items-center justify-center gap-2 ${
                    messageType === 'email'
                      ? 'border-[#635BFF] bg-[#f0efff] dark:bg-[#1e1b30] text-[#635BFF]'
                      : 'border-gray-200 dark:border-gray-700 text-[#737987] hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setMessageType('sms')}
                  className={`px-4 py-2 rounded-xl border transition flex items-center justify-center gap-2 ${
                    messageType === 'sms'
                      ? 'border-[#635BFF] bg-[#f0efff] dark:bg-[#1e1b30] text-[#635BFF]'
                      : 'border-gray-200 dark:border-gray-700 text-[#737987] hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  SMS
                </button>
                <button
                  type="button"
                  onClick={() => setMessageType('both')}
                  className={`px-4 py-2 rounded-xl border transition flex items-center justify-center gap-2 ${
                    messageType === 'both'
                      ? 'border-[#635BFF] bg-[#f0efff] dark:bg-[#1e1b30] text-[#635BFF]'
                      : 'border-gray-200 dark:border-gray-700 text-[#737987] hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <MessageSquare className="w-4 h-4" />
                  Both
                </button>
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-[#171A24] dark:text-white mb-1">
                Message Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
              >
                <option value="">Select a template...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
              <div className="bg-slate-50 dark:bg-[#14171f] p-3 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-[#171A24] dark:text-white">Preview</h4>
                  <span className="text-xs text-[#737987]">
                    {templates.find(t => t.id === selectedTemplate)?.type}
                  </span>
                </div>
                <div className="text-sm text-[#737987] dark:text-gray-400 whitespace-pre-wrap">
                  {templates.find(t => t.id === selectedTemplate)?.body}
                </div>
              </div>
            )}

            {/* Schedule */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#171A24] dark:text-white">
                <Clock className="w-4 h-4" />
                Schedule
              </label>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="datetime-local"
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                  onChange={(e) => setSchedule(e.target.value ? new Date(e.target.value) : null)}
                />
                <span className="text-xs text-[#737987]">Leave empty to send now</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-[#737987] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !selectedTemplate}
                className="flex-1 bg-[#635BFF] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#5549e8] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send {schedule ? 'Later' : 'Now'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}