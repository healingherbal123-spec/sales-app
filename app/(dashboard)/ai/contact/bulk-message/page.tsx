"use client";

import { useState } from "react";
import { BulkMessageModal } from "@/components/messaging/BulkMessageModal";
import { messageTemplates } from "@/lib/services/message-templates";
import { sendBulkMessages } from "@/lib/services/messaging.service";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
}

export default function BulkMessagePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  // Mock contacts - replace with your actual contacts
  const contacts: Contact[] = [
    { id: "1", name: "Mary Johnson", email: "mary@example.com", phone: "+234 800 111 2222", category: "vip" },
    { id: "2", name: "John Adeyemi", email: "john@example.com", phone: "+234 800 333 4444", category: "client" },
    { id: "3", name: "Chioma Nwosu", email: "chioma@example.com", phone: "+234 800 555 6666", category: "supplier" },
    // ... more contacts
  ];

  const handleSend = async (data: any) => {
    const results = await sendBulkMessages(
      data.recipients,
      data.template,
      {
        sendSMS: data.messageType === 'sms' || data.messageType === 'both',
        sendEmail: data.messageType === 'email' || data.messageType === 'both',
        schedule: data.schedule,
      }
    );
    console.log('Results:', results);
    return results;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#171A24] dark:text-white">Bulk Messaging</h1>
          <p className="text-sm text-[#737987] dark:text-gray-400">
            Send SMS and Email messages to multiple contacts
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#635BFF] text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#5549e8] transition"
        >
          <Send className="w-4 h-4" />
          New Bulk Message
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">Total Contacts</p>
          <p className="text-2xl font-bold text-[#171A24] dark:text-white">{contacts.length}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">VIP Contacts</p>
          <p className="text-2xl font-bold text-amber-600">{contacts.filter(c => c.category === 'vip').length}</p>
        </div>
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">Messages Sent</p>
          <p className="text-2xl font-bold text-emerald-600">1,247</p>
        </div>
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-4 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <p className="text-sm text-[#737987] dark:text-gray-400">Templates</p>
          <p className="text-2xl font-bold text-[#635BFF]">{messageTemplates.length}</p>
        </div>
      </div>

      {/* Bulk Message Modal */}
      <BulkMessageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        recipients={contacts}
        templates={messageTemplates}
        onSend={handleSend}
      />
    </div>
  );
}