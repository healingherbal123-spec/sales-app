// app/dashboard/help/page.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HelpCircle,
  ArrowLeft,
  Search,
  MessageSquare,
  Mail,
  Phone,
  BookOpen,
  Video,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  X,
  Plus,
  Minus,
  LifeBuoy,
  Headphones,
  Globe,
  Shield,
  Lock,
  User,
  Settings,
  DollarSign,
  Package,
  ShoppingBag,
  Briefcase,
  CreditCard,
  Truck,
  Calendar,
  Bot,
  Layers,
  MessageCircle,
  FileQuestion,
  Lightbulb,
  BookMarked,
  GraduationCap,
  Award,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

// FAQ Data
const faqs = [
  {
    id: 1,
    category: "Getting Started",
    question: "How do I create my first sale?",
    answer: "To create your first sale, navigate to the Sales section from the sidebar, click on 'New Sale', fill in the customer details, product/service information, and amount, then click 'Save Sale'. Your sale will be recorded and appear in your sales history."
  },
  {
    id: 2,
    category: "Getting Started",
    question: "How do I add a new product?",
    answer: "Go to Products from the sidebar, click 'Add Product', fill in the product name, description, price, and quantity, then click 'Save Product'. Your product will be added to your catalog."
  },
  {
    id: 3,
    category: "Orders",
    question: "How do I track an order?",
    answer: "You can track any order by going to Orders section and clicking on the order number. You'll see the full order details including status, payment information, and delivery progress."
  },
  {
    id: 4,
    category: "Orders",
    question: "What do the different order statuses mean?",
    answer: "Pending: Order placed, awaiting processing. Processing: Order is being prepared. Completed: Order is fulfilled. Delivered: Order has been delivered. Cancelled: Order was cancelled."
  },
  {
    id: 5,
    category: "Payments",
    question: "What payment methods are accepted?",
    answer: "We accept all major payment methods including Credit/Debit Cards, Bank Transfers, and Mobile Money. All transactions are securely processed."
  },
  {
    id: 6,
    category: "Payments",
    question: "How do I issue a refund?",
    answer: "To issue a refund, go to Payments, find the transaction, click on it, and select 'Refund'. The refund will be processed and the customer will be notified."
  },
  {
    id: 7,
    category: "Account",
    question: "How do I change my password?",
    answer: "Go to Settings from the sidebar, click on Security, then select 'Change Password'. Enter your current password and your new password, then click 'Save'."
  },
  {
    id: 8,
    category: "Account",
    question: "How do I update my profile information?",
    answer: "Go to Profile from the sidebar, click on the 'Edit Profile' button, update your information, and click 'Save Changes'. Your profile will be updated immediately."
  },
  {
    id: 9,
    category: "Products",
    question: "How do I update product prices?",
    answer: "Go to Products, find the product you want to update, click on the Edit button, update the price field, and click 'Save'. The new price will be applied."
  },
  {
    id: 10,
    category: "Services",
    question: "How do I add a new service?",
    answer: "Go to Services, click 'Add Service', fill in the service name, category, price, and description, then click 'Save Service'. Your service will be available for booking."
  },
];

// Support Topics
const supportTopics = [
  { icon: ShoppingBag, label: "Orders", description: "Track, manage, and cancel orders", color: "blue" },
  { icon: Package, label: "Products", description: "Add, update, and manage products", color: "emerald" },
  { icon: Briefcase, label: "Services", description: "Add, update, and manage services", color: "purple" },
  { icon: Users, label: "Customers", description: "Manage customer relationships", color: "pink" },
  { icon: CreditCard, label: "Payments", description: "Process payments and refunds", color: "green" },
  { icon: Settings, label: "Settings", description: "Configure your dashboard", color: "slate" },
];

// Video Tutorials
const videoTutorials = [
  { title: "Getting Started with BizHub", duration: "5:23", views: "1.2K" },
  { title: "How to Create a Sale", duration: "3:45", views: "856" },
  { title: "Managing Your Inventory", duration: "4:12", views: "634" },
  { title: "Understanding Analytics", duration: "6:30", views: "421" },
];

// Help Articles
const helpArticles = [
  { title: "Complete Guide to Sales", category: "Sales", readTime: "5 min" },
  { title: "Inventory Management Best Practices", category: "Inventory", readTime: "4 min" },
  { title: "Customer Service Tips", category: "Customers", readTime: "3 min" },
  { title: "Payment Processing Guide", category: "Payments", readTime: "6 min" },
];

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ helpful: boolean; faqId: number } | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactSending, setContactSending] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Categories
  const categories = ["All", ...new Set(faqs.map(faq => faq.category))];

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleFeedback = (faqId: number, helpful: boolean) => {
    setFeedback({ helpful, faqId });
    showToast(helpful ? '✅ Thanks for your feedback!' : '🙏 We\'ll improve this answer.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setContactSuccess(true);
      showToast('✅ Your message has been sent! We\'ll respond within 24 hours.', 'success');
      setTimeout(() => {
        setShowContactModal(false);
        setContactSuccess(false);
        setContactForm({ name: '', email: '', subject: '', message: '' });
      }, 2000);
    } catch (error) {
      showToast('❌ Failed to send message. Please try again.', 'error');
    } finally {
      setContactSending(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          toast.type === "success" ? "bg-emerald-500 text-white" :
          "bg-red-500 text-white"
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Contact Support
              </h2>
              <button 
                onClick={() => setShowContactModal(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {contactSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Message Sent!</h3>
                <p className="text-sm text-slate-500 mt-1">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your issue"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">
                    Message *
                  </label>
                  <textarea
                    className="w-full p-2 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={contactSending}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {contactSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-500">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LifeBuoy className="w-7 h-7 text-blue-600" />
            Help & Support
          </h1>
          <p className="text-sm text-slate-500">Find answers, tutorials, and get support</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => setShowContactModal(true)}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-800">Contact Support</h4>
              <p className="text-xs text-blue-600">Get help from our team</p>
            </div>
          </div>
        </button>

        <Link href="/dashboard/help/faq">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200 hover:shadow-md transition-shadow cursor-pointer text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-emerald-800">Knowledge Base</h4>
                <p className="text-xs text-emerald-600">Browse articles & guides</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/help/tutorials">
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-shadow cursor-pointer text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-purple-800">Video Tutorials</h4>
                <p className="text-xs text-purple-600">Watch step-by-step guides</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search for help articles, FAQs, topics..."
          className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded"
            onClick={() => setSearchQuery('')}
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Support Topics */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Browse by Topic</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {supportTopics.map((topic) => {
            const Icon = topic.icon;
            const colorMap: Record<string, string> = {
              blue: "bg-blue-50 border-blue-200 text-blue-600",
              emerald: "bg-emerald-50 border-emerald-200 text-emerald-600",
              purple: "bg-purple-50 border-purple-200 text-purple-600",
              pink: "bg-pink-50 border-pink-200 text-pink-600",
              green: "bg-green-50 border-green-200 text-green-600",
              slate: "bg-slate-50 border-slate-200 text-slate-600",
            };
            return (
              <div key={topic.label} className={`p-3 rounded-xl border ${colorMap[topic.color]} cursor-pointer hover:shadow-md transition-shadow`}>
                <div className="flex flex-col items-center text-center">
                  <Icon className="w-6 h-6 mb-1" />
                  <p className="text-xs font-semibold">{topic.label}</p>
                  <p className="text-[10px] opacity-75">{topic.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm text-slate-700">Frequently Asked Questions</h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {filteredFaqs.length} articles
            </span>
          </div>
          <select
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="hover:bg-slate-50/50 transition-colors">
              <button
                className="w-full px-4 py-3 flex items-center justify-between text-left"
                onClick={() => toggleFaq(faq.id)}
              >
                <span className="text-sm font-medium text-slate-700">{faq.question}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full hidden sm:inline">
                    {faq.category}
                  </span>
                  {expandedFaq === faq.id ? (
                    <Minus className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </div>
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-slate-400">Was this helpful?</span>
                    <button
                      onClick={() => handleFeedback(faq.id, true)}
                      className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                        feedback?.faqId === faq.id && feedback?.helpful ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(faq.id, false)}
                      className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                        feedback?.faqId === faq.id && !feedback?.helpful ? 'text-red-600' : 'text-slate-400'
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No FAQs found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full hidden sm:block">
              <Headphones className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800">Need more help?</h4>
              <p className="text-sm text-blue-700">Our support team is here to assist you 24/7</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setShowContactModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Contact Support
            </button>
            <button className="border border-blue-300 bg-white text-blue-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-50">
              <Mail className="w-4 h-4" />
              Email Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}