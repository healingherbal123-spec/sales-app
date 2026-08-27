"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
  User,
  Tag,
  Star,
  Users,
  Truck,
  Package,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Eye,
  MoreVertical,
  PlusCircle,
  PenSquare,
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────
interface AIContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  company: string;
  category: string;
  notes: string;
  task: string;
  created_at: string;
  last_contact?: string;
  next_contact?: string;
  messages?: number;
}

// ─── Default Categories ────────────────────────────────────────
const DEFAULT_CATEGORIES = [
  { id: 'vip', label: 'VIP', icon: '⭐', color: 'amber' },
  { id: 'client', label: 'Client', icon: '🤝', color: 'blue' },
  { id: 'supplier', label: 'Supplier', icon: '📦', color: 'emerald' },
  { id: 'driver', label: 'Driver', icon: '🚚', color: 'purple' },
  { id: 'staff', label: 'Staff', icon: '👤', color: 'pink' },
];

// ─── Mock Data ──────────────────────────────────────────────────
const mockContacts: AIContact[] = [
  {
    id: '1',
    name: 'Mrs. Kyempia',
    phone: '+234 703 876 8905',
    email: 'kyempia@market.com',
    role: 'Market Woman',
    company: 'Kaduna Market',
    category: 'vip',
    notes: 'VIP customer, bulk orders',
    task: 'Inform when stocks run low',
    created_at: '2026-01-15',
    last_contact: '2026-08-10',
    next_contact: '2026-08-20',
    messages: 12,
  },
  {
    id: '2',
    name: 'Mr. Emeka',
    phone: '+234 805 432 1098',
    email: 'emeka@logistics.com',
    role: 'Driver',
    company: 'Logistics Plus',
    category: 'driver',
    notes: 'Reliable driver, night shifts available',
    task: 'Notify when order is ready for pickup',
    created_at: '2026-02-10',
    last_contact: '2026-08-12',
    next_contact: '2026-08-18',
    messages: 8,
  },
  {
    id: '3',
    name: 'Dr. Adeyemi',
    phone: '+234 802 345 6789',
    email: 'adeyemi@lagosgeneral.com',
    role: 'Procurement Lead',
    company: 'Lagos General Hospital',
    category: 'client',
    notes: 'Institutional buyer, bulk discounts',
    task: 'Monthly supply check-in',
    created_at: '2026-03-05',
    last_contact: '2026-08-08',
    next_contact: '2026-08-25',
    messages: 6,
  },
  {
    id: '4',
    name: 'Mr. Adebayo',
    phone: '+234 800 123 4567',
    email: 'adebayo@techhub.com',
    role: 'Procurement Manager',
    company: 'Lagos Tech Hub',
    category: 'client',
    notes: 'Tech procurement, high-value orders',
    task: 'Follow up on pending quotes',
    created_at: '2026-04-20',
    last_contact: '2026-08-05',
    next_contact: '2026-08-22',
    messages: 4,
  },
  {
    id: '5',
    name: 'Ms. Funke',
    phone: '+234 806 789 0123',
    email: 'funke@supplies.com',
    role: 'Supplier Manager',
    company: 'Fresh Supplies Ltd',
    category: 'supplier',
    notes: 'Daily supply of fresh produce',
    task: 'Confirm delivery schedule weekly',
    created_at: '2026-05-12',
    last_contact: '2026-08-11',
    next_contact: '2026-08-19',
    messages: 15,
  },
  {
    id: '6',
    name: 'Mr. Chidi',
    phone: '+234 803 456 7890',
    email: 'chidi@transport.com',
    role: 'Fleet Manager',
    company: 'Transport Plus',
    category: 'driver',
    notes: 'Fleet of 5 trucks available',
    task: 'Schedule weekly deliveries',
    created_at: '2026-06-01',
    last_contact: '2026-08-09',
    next_contact: '2026-08-21',
    messages: 9,
  },
  {
    id: '7',
    name: 'Mrs. Ngozi',
    phone: '+234 807 890 1234',
    email: 'ngozi@pharma.com',
    role: 'Procurement Director',
    company: 'Pharma Plus Ltd',
    category: 'vip',
    notes: 'VIP client, high-value orders',
    task: 'Send monthly catalog updates',
    created_at: '2026-07-15',
    last_contact: '2026-08-07',
    next_contact: '2026-08-28',
    messages: 18,
  },
  {
    id: '8',
    name: 'Mr. Kunle',
    phone: '+234 809 012 3456',
    email: 'kunle@retail.com',
    role: 'Store Manager',
    company: 'Retail Hub',
    category: 'client',
    notes: 'Regular orders, good relationship',
    task: 'Notify of new arrivals',
    created_at: '2026-08-01',
    last_contact: '2026-08-13',
    next_contact: '2026-08-26',
    messages: 3,
  },
];

// ─── Helper Functions ──────────────────────────────────────────
function getCategoryBadge(category: string, categories: any[]) {
  const found = categories.find(c => c.id === category);
  if (found) {
    const colorMap: Record<string, string> = {
      'amber': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      'blue': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'emerald': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      'purple': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'pink': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      'red': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'green': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'indigo': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'gray': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${colorMap[found.color] || colorMap.gray}`}>
        <span>{found.icon}</span>
        {found.label}
      </span>
    );
  }
  // Custom category fallback
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
      <Tag className="w-3 h-3" />
      {category}
    </span>
  );
}

function getCategoryEmoji(category: string, categories: any[]) {
  const found = categories.find(c => c.id === category);
  return found?.icon || '📌';
}

// ─── Stats Component ───────────────────────────────────────────
function StatsCards({ contacts, categories }: { contacts: AIContact[]; categories: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-5 shadow-sm border border-gray-100/50 dark:border-gray-800">
        <div className="text-sm text-[#737987] dark:text-gray-400">Total Contacts</div>
        <div className="text-2xl font-bold text-[#171A24] dark:text-white">{contacts.length}</div>
      </div>
      {categories.slice(0, 4).map((cat) => (
        <div key={cat.id} className="bg-white dark:bg-[#1a1d27] rounded-2xl p-5 shadow-sm border border-gray-100/50 dark:border-gray-800">
          <div className="text-sm text-[#737987] dark:text-gray-400">{cat.icon} {cat.label}</div>
          <div className="text-2xl font-bold text-[#171A24] dark:text-white">
            {contacts.filter(c => c.category === cat.id).length}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Contact Card Component ────────────────────────────────────
function ContactCard({
  contact,
  categories,
  onEdit,
  onDelete,
  onMessage,
  onView,
}: {
  contact: AIContact;
  categories: any[];
  onEdit: (contact: AIContact) => void;
  onDelete: (id: string) => void;
  onMessage: (contact: AIContact) => void;
  onView: (contact: AIContact) => void;
}) {
  const category = categories.find(c => c.id === contact.category);

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-2xl shadow-sm border border-gray-100/50 dark:border-gray-800 hover:shadow-md transition p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-${category?.color || 'gray'}-50 dark:bg-${category?.color || 'gray'}-900/20`}>
            {getCategoryEmoji(contact.category, categories)}
          </div>
          <div>
            <h3 className="font-semibold text-[#171A24] dark:text-white">{contact.name}</h3>
            <p className="text-sm text-[#737987] dark:text-gray-400">{contact.role}</p>
            <p className="text-xs text-[#737987] dark:text-gray-400">{contact.company}</p>
          </div>
        </div>
        {getCategoryBadge(contact.category, categories)}
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-[#737987] dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 shrink-0" />
          <span className="truncate">{contact.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 shrink-0" />
          <span className="truncate">{contact.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 shrink-0" />
          <span className="truncate">{contact.company}</span>
        </div>
      </div>

      {contact.task && (
        <div className="mt-3 p-2 bg-[#fefce8] dark:bg-[#2a241a] rounded-lg text-sm">
          <span className="text-[#F59E0B]">📌 Task:</span>
          <span className="text-[#171A24] dark:text-white ml-1">{contact.task}</span>
        </div>
      )}

      {contact.notes && (
        <div className="mt-2 text-sm text-[#737987] dark:text-gray-400 italic">
          &quot;{contact.notes}&quot;
        </div>
      )}

      <div className="mt-3 flex items-center gap-3 text-xs text-[#737987] dark:text-gray-400">
        {contact.messages && (
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {contact.messages} msgs
          </span>
        )}
        {contact.last_contact && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {contact.last_contact}
          </span>
        )}
        {contact.next_contact && (
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <Calendar className="w-3 h-3" />
            Next: {contact.next_contact}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => onMessage(contact)}
          className="flex-1 bg-[#635BFF] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#5549e8] transition flex items-center justify-center gap-1"
        >
          <Send className="w-3 h-3" /> Message
        </button>
        <button
          onClick={() => onView(contact)}
          className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          title="View Details"
        >
          <Eye className="w-4 h-4 text-[#737987] dark:text-gray-400" />
        </button>
        <button
          onClick={() => onEdit(contact)}
          className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          title="Edit"
        >
          <Edit className="w-4 h-4 text-[#635BFF]" />
        </button>
        <button
          onClick={() => onDelete(contact.id)}
          className="p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-[#EF4444]" />
        </button>
      </div>
    </div>
  );
}

// ─── Details Modal ─────────────────────────────────────────────
function DetailsModal({
  contact,
  categories,
  onClose,
}: {
  contact: AIContact;
  categories: any[];
  onClose: () => void;
}) {
  const category = categories.find(c => c.id === contact.category);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#171A24] dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#635BFF]" />
            Contact Details
          </h3>
          <button onClick={onClose} className="text-[#737987] hover:text-[#171A24] dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-4xl bg-${category?.color || 'gray'}-50 dark:bg-${category?.color || 'gray'}-900/20`}>
              {getCategoryEmoji(contact.category, categories)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#171A24] dark:text-white">{contact.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {getCategoryBadge(contact.category, categories)}
                <span className="text-sm text-[#737987] dark:text-gray-400">{contact.role}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#737987] dark:text-gray-400">Phone</p>
              <p className="text-sm font-medium text-[#171A24] dark:text-white">{contact.phone}</p>
            </div>
            <div>
              <p className="text-xs text-[#737987] dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-[#171A24] dark:text-white">{contact.email}</p>
            </div>
            <div>
              <p className="text-xs text-[#737987] dark:text-gray-400">Company</p>
              <p className="text-sm font-medium text-[#171A24] dark:text-white">{contact.company}</p>
            </div>
            <div>
              <p className="text-xs text-[#737987] dark:text-gray-400">Role</p>
              <p className="text-sm font-medium text-[#171A24] dark:text-white">{contact.role}</p>
            </div>
            <div>
              <p className="text-xs text-[#737987] dark:text-gray-400">Category</p>
              <p className="text-sm font-medium text-[#171A24] dark:text-white">
                {category?.label || contact.category}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#737987] dark:text-gray-400">Messages</p>
              <p className="text-sm font-medium text-[#171A24] dark:text-white">{contact.messages || 0}</p>
            </div>
            {contact.last_contact && (
              <div>
                <p className="text-xs text-[#737987] dark:text-gray-400">Last Contact</p>
                <p className="text-sm text-[#171A24] dark:text-white">{contact.last_contact}</p>
              </div>
            )}
            {contact.next_contact && (
              <div>
                <p className="text-xs text-[#737987] dark:text-gray-400">Next Contact</p>
                <p className="text-sm text-amber-600 dark:text-amber-400">{contact.next_contact}</p>
              </div>
            )}
          </div>

          {contact.task && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-xs text-[#737987] dark:text-gray-400">Task</p>
              <p className="text-sm font-medium text-[#171A24] dark:text-white">{contact.task}</p>
            </div>
          )}

          {contact.notes && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-xs text-[#737987] dark:text-gray-400">Notes</p>
              <p className="text-sm text-[#171A24] dark:text-white italic">&quot;{contact.notes}&quot;</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-[#737987] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Close
          </button>
          <button className="flex-1 bg-[#635BFF] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#5549e8] transition flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Message Modal ─────────────────────────────────────────────
function MessageModal({
  contact,
  onClose,
  onSend,
  sending,
}: {
  contact: AIContact;
  onClose: () => void;
  onSend: (message: string) => void;
  sending: boolean;
}) {
  const [message, setMessage] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#171A24] dark:text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-[#635BFF]" />
            Send Message
          </h3>
          <button onClick={onClose} className="text-[#737987] hover:text-[#171A24] dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#f8fafc] dark:bg-[#14171f] rounded-xl">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-${categories.find(c => c.id === contact.category)?.color || 'gray'}-50 dark:bg-${categories.find(c => c.id === contact.category)?.color || 'gray'}-900/20`}>
              {getCategoryEmoji(contact.category, categories)}
            </div>
            <div>
              <p className="font-medium text-[#171A24] dark:text-white">{contact.name}</p>
              <p className="text-xs text-[#737987] dark:text-gray-400">{contact.email}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#171A24] dark:text-white mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition resize-none"
              placeholder="Type your message here..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-[#737987] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (message.trim()) {
                  onSend(message);
                  setMessage("");
                }
              }}
              disabled={sending || !message.trim()}
              className="flex-1 bg-[#635BFF] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#5549e8] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contact Form Modal ────────────────────────────────────────
function ContactFormModal({
  editingContact,
  formData,
  setFormData,
  categories,
  onSubmit,
  onClose,
  onAddCategory,
}: {
  editingContact: AIContact | null;
  formData: Partial<AIContact>;
  setFormData: (data: Partial<AIContact>) => void;
  categories: any[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onAddCategory: (label: string) => void;
}) {
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
      setShowNewCategory(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#171A24] dark:text-white">
            {editingContact ? 'Edit Contact' : 'Add Contact'}
          </h3>
          <button onClick={onClose} className="text-[#737987] hover:text-[#171A24] dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#171A24] dark:text-white mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#171A24] dark:text-white mb-1">
                Phone *
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#171A24] dark:text-white mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#171A24] dark:text-white mb-1">
                Role
              </label>
              <input
                type="text"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#171A24] dark:text-white mb-1">
                Company
              </label>
              <input
                type="text"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
              />
            </div>
          </div>

          {/* Category with Custom Option */}
          <div>
            <label className="block text-sm font-medium text-[#171A24] dark:text-white mb-1">
              Category
            </label>
            <div className="flex gap-2">
              <select
                value={formData.category || 'client'}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setShowNewCategory(true);
                  } else {
                    setFormData({ ...formData, category: e.target.value });
                    setShowNewCategory(false);
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
                <option value="__custom__">➕ Add Custom Category</option>
              </select>
            </div>

            {/* Custom Category Input */}
            {showNewCategory && (
              <div className="mt-2 flex gap-2 items-center">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()}
                  className="px-4 py-2 bg-[#635BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5549e8] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategory("");
                  }}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#171A24] dark:text-white mb-1">
              Task / Instruction for AI
            </label>
            <input
              type="text"
              value={formData.task || ''}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              placeholder="e.g. Notify when stocks run low"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#171A24] dark:text-white mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-[#0d0f15] dark:text-white focus:border-[#635BFF] outline-none transition resize-none"
              placeholder="Additional notes"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#635BFF] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#5549e8] transition"
            >
              {editingContact ? 'Update Contact' : 'Add Contact'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-[#737987] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────
export default function AIContactsPage() {
  const [contacts, setContacts] = useState<AIContact[]>(mockContacts);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [editingContact, setEditingContact] = useState<AIContact | null>(null);
  const [selectedContact, setSelectedContact] = useState<AIContact | null>(null);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState<Partial<AIContact>>({
    name: '',
    phone: '',
    email: '',
    role: '',
    company: '',
    category: 'client',
    notes: '',
    task: '',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openNewModal = () => {
    setEditingContact(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      role: '',
      company: '',
      category: 'client',
      notes: '',
      task: '',
    });
    setShowModal(true);
  };

  const openEditModal = (contact: AIContact) => {
    setEditingContact(contact);
    setFormData(contact);
    setShowModal(true);
  };

  const openDetailsModal = (contact: AIContact) => {
    setSelectedContact(contact);
    setShowDetails(true);
  };

  const openMessageModal = (contact: AIContact) => {
    setSelectedContact(contact);
    setShowMessage(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDetails(false);
    setShowMessage(false);
    setEditingContact(null);
    setSelectedContact(null);
  };

  const handleAddCategory = (label: string) => {
    const id = label.toLowerCase().replace(/\s+/g, '_');
    const newCategory = {
      id,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      icon: '📌',
      color: 'gray',
    };
    setCategories([...categories, newCategory]);
    setFormData({ ...formData, category: id });
    showToast(`✅ Added new category: ${label}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Name and phone are required.', 'error');
      return;
    }

    const contact: AIContact = {
      id: editingContact?.id || Date.now().toString(),
      name: formData.name!,
      phone: formData.phone!,
      email: formData.email || '',
      role: formData.role || '',
      company: formData.company || '',
      category: formData.category || 'client',
      notes: formData.notes || '',
      task: formData.task || '',
      created_at: editingContact?.created_at || new Date().toISOString().split('T')[0],
      last_contact: editingContact?.last_contact || new Date().toISOString().split('T')[0],
      next_contact: editingContact?.next_contact || '',
      messages: editingContact?.messages || 0,
    };

    if (editingContact) {
      setContacts(contacts.map(c => c.id === editingContact.id ? contact : c));
      showToast(`✅ ${contact.name} updated successfully!`);
    } else {
      setContacts([...contacts, contact]);
      showToast(`✅ ${contact.name} added successfully!`);
    }
    closeModal();
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedContact) return;
    setSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContacts(prev => prev.map(c => 
        c.id === selectedContact.id 
          ? { ...c, messages: (c.messages || 0) + 1, last_contact: new Date().toISOString().split('T')[0] }
          : c
      ));
      showToast(`✅ Message sent to ${selectedContact.name}`);
      closeModal();
    } catch (err) {
      showToast('Failed to send message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const deleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (confirm(`Delete "${contact?.name}"?`)) {
      setContacts(contacts.filter(c => c.id !== id));
      showToast(`🗑️ ${contact?.name} deleted`);
    }
  };

  const filteredContacts = contacts.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || c.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm ${
          toast.type === 'success' ? 'bg-[#16A36D]' : 'bg-[#EF4444]'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#171A24] dark:text-white">AI Contacts</h1>
          <p className="text-sm text-[#737987] dark:text-gray-400">
            Manage AI-ready contacts for your knowledge hub
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-[#635BFF] text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#5549e8] transition"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      <StatsCards contacts={contacts} categories={categories} />

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white dark:bg-[#1a1d27] rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#737987]" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm text-[#171A24] dark:text-white outline-none w-full"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white dark:bg-[#1a1d27] rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm text-[#171A24] dark:text-white outline-none focus:border-[#635BFF]"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>

        <span className="text-sm text-[#737987] dark:text-gray-400">
          {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="bg-white dark:bg-[#1a1d27] rounded-2xl p-12 text-center border border-gray-100/50 dark:border-gray-800">
          <div className="text-4xl mb-3">👤</div>
          <h3 className="text-lg font-semibold text-[#171A24] dark:text-white">No contacts found</h3>
          <p className="text-sm text-[#737987] dark:text-gray-400">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              categories={categories}
              onEdit={openEditModal}
              onDelete={deleteContact}
              onMessage={openMessageModal}
              onView={openDetailsModal}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <ContactFormModal
          editingContact={editingContact}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          onSubmit={handleSubmit}
          onClose={closeModal}
          onAddCategory={handleAddCategory}
        />
      )}

      {/* Details Modal */}
      {showDetails && selectedContact && (
        <DetailsModal
          contact={selectedContact}
          categories={categories}
          onClose={closeModal}
        />
      )}

      {/* Message Modal */}
      {showMessage && selectedContact && (
        <MessageModal
          contact={selectedContact}
          onClose={closeModal}
          onSend={handleSendMessage}
          sending={sending}
        />
      )}
    </div>
  );
}