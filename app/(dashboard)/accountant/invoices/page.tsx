"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Printer,
  Download,
  Send,
  X,
  Save,
  UserPlus,
  ArrowLeft
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
};

type Invoice = {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  issue_date: string;
  due_date: string;
  status: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
  total: number;
  currency: string;
  notes: string;
  terms: string;
  created_at: string;
  items: InvoiceItem[];
};

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const supabase = createClient();

  // Form state
  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    issue_date: new Date().toISOString().split('T')[0],
    due_date: "",
    tax_rate: 0,
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 0,
    notes: "",
    terms: "",
    currency: "₦",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: Date.now().toString(), description: "", quantity: 1, unit_price: 0, total: 0 }
  ]);

  const [searchCustomers, setSearchCustomers] = useState("");
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/invoices");
      const result = await response.json();
      
      if (result.success) {
        setInvoices(result.data);
      } else {
        setError(result.error || "Failed to load invoices");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers");
      const result = await response.json();
      if (result.success) {
        setCustomers(result.data);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      
      if (result.success) {
        setInvoices(invoices.filter(inv => inv.id !== id));
      } else {
        alert(result.error || "Failed to delete invoice");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      
      if (result.success) {
        fetchInvoices();
      } else {
        alert(result.error || "Failed to update status");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      draft: { icon: <Clock size={14} />, className: "bg-slate-500/10 text-slate-400", label: "Draft" },
      sent: { icon: <Clock size={14} />, className: "bg-blue-500/10 text-blue-400", label: "Sent" },
      paid: { icon: <CheckCircle size={14} />, className: "bg-green-500/10 text-green-400", label: "Paid" },
      overdue: { icon: <AlertCircle size={14} />, className: "bg-red-500/10 text-red-400", label: "Overdue" },
      cancelled: { icon: <XCircle size={14} />, className: "bg-red-500/10 text-red-400", label: "Cancelled" },
    };
    return config[status as keyof typeof config] || config.draft;
  };

  // Invoice form functions
  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", quantity: 1, unit_price: 0, total: 0 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unit_price') {
          updated.total = updated.quantity * updated.unit_price;
        }
        return updated;
      }
      return item;
    }));
  };

  const selectCustomer = (customer: Customer) => {
    setFormData({
      ...formData,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_email: customer.email || "",
      customer_phone: customer.phone || "",
    });
    setShowCustomerSearch(false);
    setSearchCustomers("");
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * formData.tax_rate) / 100;
    let discountAmount = 0;
    if (formData.discount_type === "percentage") {
      discountAmount = (subtotal * formData.discount_value) / 100;
    } else if (formData.discount_type === "fixed") {
      discountAmount = formData.discount_value;
    }
    const total = subtotal + taxAmount - discountAmount;
    return { subtotal, taxAmount, discountAmount, total };
  };

  const { subtotal, taxAmount, discountAmount, total } = calculateTotals();

  const resetForm = () => {
    setFormData({
      customer_id: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      customer_address: "",
      issue_date: new Date().toISOString().split('T')[0],
      due_date: "",
      tax_rate: 0,
      discount_type: "percentage",
      discount_value: 0,
      notes: "",
      terms: "",
      currency: "₦",
    });
    setItems([{ id: Date.now().toString(), description: "", quantity: 1, unit_price: 0, total: 0 }]);
    setIsEditing(false);
    setSelectedInvoice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!formData.customer_name) {
        setError("Customer name is required");
        setIsSubmitting(false);
        return;
      }

      if (!formData.due_date) {
        setError("Due date is required");
        setIsSubmitting(false);
        return;
      }

      if (items.some(item => !item.description || item.quantity <= 0 || item.unit_price <= 0)) {
        setError("Please fill in all item details");
        setIsSubmitting(false);
        return;
      }

      const url = isEditing && selectedInvoice 
        ? `/api/invoices/${selectedInvoice.id}` 
        : "/api/invoices";
      
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items: items.map(({ id, ...rest }) => rest),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setShowModal(false);
        resetForm();
        fetchInvoices();
      } else {
        setError(result.error || "Failed to save invoice");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      customer_id: invoice.customer_id || "",
      customer_name: invoice.customer_name || "",
      customer_email: invoice.customer_email || "",
      customer_phone: invoice.customer_phone || "",
      customer_address: invoice.customer_address || "",
      issue_date: invoice.issue_date || new Date().toISOString().split('T')[0],
      due_date: invoice.due_date || "",
      tax_rate: invoice.tax_rate || 0,
      discount_type: invoice.discount_type as "percentage" | "fixed" || "percentage",
      discount_value: invoice.discount_value || 0,
      notes: invoice.notes || "",
      terms: invoice.terms || "",
      currency: invoice.currency || "₦",
    });
    setItems(invoice.items || [{ id: Date.now().toString(), description: "", quantity: 1, unit_price: 0, total: 0 }]);
    setIsEditing(true);
    setShowModal(true);
  };

  const openDetailModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
                          invoice.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === "draft").length,
    sent: invoices.filter(i => i.status === "sent").length,
    paid: invoices.filter(i => i.status === "paid").length,
    overdue: invoices.filter(i => i.status === "overdue").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-slate-400">Manage all your invoices</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl transition flex items-center gap-2 font-semibold"
          >
            <Plus size={20} />
            New Invoice
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard label="Total" value={stats.total} color="text-blue-400" />
          <StatCard label="Draft" value={stats.draft} color="text-slate-400" />
          <StatCard label="Sent" value={stats.sent} color="text-blue-400" />
          <StatCard label="Paid" value={stats.paid} color="text-green-400" />
          <StatCard label="Overdue" value={stats.overdue} color="text-red-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-left text-sm text-slate-400">
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => {
                  const status = getStatusBadge(invoice.status);
                  return (
                    <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4 font-medium">
                        <button onClick={() => openDetailModal(invoice)} className="hover:text-blue-400">
                          {invoice.invoice_number}
                        </button>
                      </td>
                      <td className="px-6 py-4">{invoice.customer_name}</td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(invoice.issue_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {invoice.currency}{Number(invoice.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetailModal(invoice)}
                            className="p-2 hover:bg-white/10 rounded-lg transition"
                          >
                            <Eye size={18} className="text-slate-400 hover:text-white" />
                          </button>
                          <button
                            onClick={() => openEditModal(invoice)}
                            className="p-2 hover:bg-white/10 rounded-lg transition"
                          >
                            <Edit size={18} className="text-slate-400 hover:text-white" />
                          </button>
                          <button
                            onClick={() => deleteInvoice(invoice.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 size={18} className="text-slate-400 hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No invoices found</p>
              <button onClick={() => { resetForm(); setShowModal(true); }} className="text-blue-400 hover:text-blue-300 mt-2 inline-block">
                Create your first invoice →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b1728] rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? "Edit Invoice" : "New Invoice"}
                </h2>
                <p className="text-sm text-slate-400">
                  {isEditing ? "Update invoice details" : "Create a new invoice"}
                </p>
              </div>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-white/10 rounded-lg">
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Section */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold">Customer Information</h3>
                  <button
                    type="button"
                    onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <UserPlus size={14} />
                    Select customer
                  </button>
                </div>

                {showCustomerSearch && (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={searchCustomers}
                      onChange={(e) => setSearchCustomers(e.target.value)}
                      placeholder="Search customers..."
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                    <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                      {customers
                        .filter(c => c.name.toLowerCase().includes(searchCustomers.toLowerCase()) || 
                                    c.email?.toLowerCase().includes(searchCustomers.toLowerCase()))
                        .map(customer => (
                          <button
                            key={customer.id}
                            type="button"
                            onClick={() => selectCustomer(customer)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded-lg transition"
                          >
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-xs text-slate-400">{customer.email}</div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Customer Name *</label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Phone</label>
                    <input
                      type="text"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.customer_address}
                      onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <h3 className="text-sm font-semibold mb-4">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Due Date *</label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    >
                      <option value="₦">₦ Naira</option>
                      <option value="$">$ USD</option>
                      <option value="€">€ Euro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold">Invoice Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-xs"
                  >
                    <Plus size={14} />
                    Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          min="1"
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-1 text-right text-sm text-blue-400">
                        {formData.currency}{item.total.toFixed(2)}
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1 hover:bg-red-500/10 rounded-lg transition"
                          disabled={items.length === 1}
                        >
                          <Trash2 size={16} className={items.length === 1 ? "text-slate-600" : "text-slate-400 hover:text-red-400"} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tax and Discount */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={formData.tax_rate}
                      onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Discount</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.discount_type}
                        onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as "percentage" | "fixed" })}
                        className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">{formData.currency}</option>
                      </select>
                      <input
                        type="number"
                        value={formData.discount_value}
                        onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                        min="0"
                        step="0.01"
                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Totals */}
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="max-w-xs ml-auto space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Subtotal</span>
                      <span>{formData.currency}{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tax ({formData.tax_rate}%)</span>
                      <span>{formData.currency}{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Discount</span>
                      <span>-{formData.currency}{discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-blue-400">{formData.currency}{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes & Terms */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={2}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                      placeholder="Additional notes..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Terms & Conditions</label>
                    <textarea
                      value={formData.terms}
                      onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                      rows={2}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                      placeholder="Payment terms..."
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
                >
                  <Save size={16} />
                  {isSubmitting ? "Saving..." : isEditing ? "Update Invoice" : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b1728] rounded-2xl border border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedInvoice.invoice_number}</h2>
                <p className="text-sm text-slate-400">
                  Created {new Date(selectedInvoice.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadge(selectedInvoice.status).className}`}>
                  {getStatusBadge(selectedInvoice.status).icon}
                  {getStatusBadge(selectedInvoice.status).label}
                </span>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedInvoice.status === "draft" && (
                <>
                  <button
                    onClick={() => { updateStatus(selectedInvoice.id, "sent"); setShowDetailModal(false); }}
                    className="bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-sm"
                  >
                    <Send size={14} />
                    Send
                  </button>
                  <button
                    onClick={() => { updateStatus(selectedInvoice.id, "paid"); setShowDetailModal(false); }}
                    className="bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-sm"
                  >
                    <CheckCircle size={14} />
                    Mark Paid
                  </button>
                </>
              )}
              {selectedInvoice.status === "sent" && (
                <button
                  onClick={() => { updateStatus(selectedInvoice.id, "paid"); setShowDetailModal(false); }}
                  className="bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-sm"
                >
                  <CheckCircle size={14} />
                  Mark Paid
                </button>
              )}
              <button
                onClick={() => { openEditModal(selectedInvoice); setShowDetailModal(false); }}
                className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-sm"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={() => { deleteInvoice(selectedInvoice.id); setShowDetailModal(false); }}
                className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-sm"
              >
                <Trash2 size={14} />
                Delete
              </button>
              <button className="ml-auto bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-sm">
                <Printer size={14} />
                Print
              </button>
            </div>

            {/* Invoice Content */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">AI SalesOS</h2>
                  <p className="text-sm text-slate-400">Your Business Address</p>
                  <p className="text-sm text-slate-400">Phone: +2348000000000</p>
                  <p className="text-sm text-slate-400">Email: info@aisalesos.com</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Invoice #</p>
                  <p className="text-xl font-bold text-blue-400">{selectedInvoice.invoice_number}</p>
                  <p className="text-sm text-slate-400 mt-2">Date: {new Date(selectedInvoice.issue_date).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-400">Due: {new Date(selectedInvoice.due_date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Customer */}
              <div className="border-t border-b border-white/10 py-4 mb-4">
                <p className="text-sm text-slate-400 mb-1">Bill To:</p>
                <p className="font-semibold">{selectedInvoice.customer_name}</p>
                {selectedInvoice.customer_email && <p className="text-sm text-slate-400">{selectedInvoice.customer_email}</p>}
                {selectedInvoice.customer_phone && <p className="text-sm text-slate-400">{selectedInvoice.customer_phone}</p>}
                {selectedInvoice.customer_address && <p className="text-sm text-slate-400">{selectedInvoice.customer_address}</p>}
              </div>

              {/* Items */}
              <table className="w-full mb-4">
                <thead className="border-b border-white/10">
                  <tr className="text-left text-sm text-slate-400">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Qty</th>
                    <th className="pb-2 text-right">Unit Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items?.map((item) => (
                    <tr key={item.id} className="border-b border-white/5">
                      <td className="py-2">{item.description}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{selectedInvoice.currency}{item.unit_price.toFixed(2)}</td>
                      <td className="py-2 text-right font-medium">{selectedInvoice.currency}{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal</span>
                    <span>{selectedInvoice.currency}{selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedInvoice.tax_rate > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tax ({selectedInvoice.tax_rate}%)</span>
                      <span>{selectedInvoice.currency}{selectedInvoice.tax_amount.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedInvoice.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Discount</span>
                      <span className="text-red-400">-{selectedInvoice.currency}{selectedInvoice.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-blue-400">{selectedInvoice.currency}{selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes & Terms */}
              {(selectedInvoice.notes || selectedInvoice.terms) && (
                <div className="mt-4 border-t border-white/10 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedInvoice.notes && (
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Notes:</p>
                      <p className="text-sm">{selectedInvoice.notes}</p>
                    </div>
                  )}
                  {selectedInvoice.terms && (
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Terms:</p>
                      <p className="text-sm">{selectedInvoice.terms}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}