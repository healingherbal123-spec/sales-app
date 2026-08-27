"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save,
  UserPlus,
  Search
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

export default function NewInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchCustomers, setSearchCustomers] = useState("");
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const supabase = createClient();

  const [invoice, setInvoice] = useState({
    customer_id: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    issue_date: new Date().toISOString().split('T')[0],
    due_date: "",
    status: "draft",
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

  useEffect(() => {
    fetchCustomers();
  }, []);

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
    setInvoice({
      ...invoice,
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
    const taxAmount = (subtotal * invoice.tax_rate) / 100;
    let discountAmount = 0;
    if (invoice.discount_type === "percentage") {
      discountAmount = (subtotal * invoice.discount_value) / 100;
    } else if (invoice.discount_type === "fixed") {
      discountAmount = invoice.discount_value;
    }
    const total = subtotal + taxAmount - discountAmount;
    return { subtotal, taxAmount, discountAmount, total };
  };

  const { subtotal, taxAmount, discountAmount, total } = calculateTotals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!invoice.customer_name) {
        setError("Customer name is required");
        setLoading(false);
        return;
      }

      if (!invoice.due_date) {
        setError("Due date is required");
        setLoading(false);
        return;
      }

      if (items.some(item => !item.description || item.quantity <= 0 || item.unit_price <= 0)) {
        setError("Please fill in all item details");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...invoice,
          items: items.map(({ id, ...rest }) => rest),
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        router.push(`/dashboard/invoices/${result.data.id}`);
      } else {
        setError(result.error || "Failed to create invoice");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/invoices" className="p-2 hover:bg-white/10 rounded-lg transition">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">New Invoice</h1>
            <p className="text-slate-400">Create a new invoice for your customer</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg mb-4">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Section */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Customer Information</h2>
              <button
                type="button"
                onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-2"
              >
                <UserPlus size={16} />
                {showCustomerSearch ? "Hide customers" : "Select existing customer"}
              </button>
            </div>

            {showCustomerSearch && (
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    value={searchCustomers}
                    onChange={(e) => setSearchCustomers(e.target.value)}
                    placeholder="Search customers..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                  {customers
                    .filter(c => c.name.toLowerCase().includes(searchCustomers.toLowerCase()) || 
                                c.email?.toLowerCase().includes(searchCustomers.toLowerCase()))
                    .map(customer => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => selectCustomer(customer)}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition"
                      >
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-slate-400">{customer.email}</div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Customer Name *</label>
                <input
                  type="text"
                  value={invoice.customer_name}
                  onChange={(e) => setInvoice({ ...invoice, customer_name: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email</label>
                <input
                  type="email"
                  value={invoice.customer_email}
                  onChange={(e) => setInvoice({ ...invoice, customer_email: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Phone</label>
                <input
                  type="text"
                  value={invoice.customer_phone}
                  onChange={(e) => setInvoice({ ...invoice, customer_phone: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Address</label>
                <input
                  type="text"
                  value={invoice.customer_address}
                  onChange={(e) => setInvoice({ ...invoice, customer_address: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Issue Date</label>
                <input
                  type="date"
                  value={invoice.issue_date}
                  onChange={(e) => setInvoice({ ...invoice, issue_date: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Due Date *</label>
                <input
                  type="date"
                  value={invoice.due_date}
                  onChange={(e) => setInvoice({ ...invoice, due_date: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Currency</label>
                <select
                  value={invoice.currency}
                  onChange={(e) => setInvoice({ ...invoice, currency: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value="₦">₦ Naira</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ Euro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Invoice Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      min="1"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-1 text-right py-2 text-blue-400">
                    ₦{item.total.toFixed(2)}
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={18} className={items.length === 1 ? "text-slate-600" : "text-slate-400 hover:text-red-400"} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tax and Discount */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  value={invoice.tax_rate}
                  onChange={(e) => setInvoice({ ...invoice, tax_rate: parseFloat(e.target.value) || 0 })}
                  min="0"
                  step="0.01"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Discount</label>
                <div className="flex gap-2">
                  <select
                    value={invoice.discount_type}
                    onChange={(e) => setInvoice({ ...invoice, discount_type: e.target.value as "percentage" | "fixed" })}
                    className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">₦</option>
                  </select>
                  <input
                    type="number"
                    value={invoice.discount_value}
                    onChange={(e) => setInvoice({ ...invoice, discount_value: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="max-w-xs ml-auto space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span>₦{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tax ({invoice.tax_rate}%)</span>
                  <span>₦{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Discount</span>
                  <span>-₦{discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-blue-400">₦{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Notes</label>
                <textarea
                  value={invoice.notes}
                  onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                  placeholder="Additional notes..."
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Terms & Conditions</label>
                <textarea
                  value={invoice.terms}
                  onChange={(e) => setInvoice({ ...invoice, terms: e.target.value })}
                  rows={3}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
                  placeholder="Payment terms..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/dashboard/invoices"
              className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl transition flex items-center gap-2 font-semibold disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}