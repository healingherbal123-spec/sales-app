"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Plus,
  X,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
  ShoppingBag,
  CreditCard,
  Truck,
  Calendar,
  Users,
  Minus,
  Eye,
  Edit,
  MoreVertical,
  Filter,
  Search,
  Download,
  RefreshCw,
} from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const [orderData, setOrderData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    order_type: "product",
    delivery_method: "delivery",
    payment_method: "bank_transfer",
    notes: "",
  });

  const [items, setItems] = useState<OrderItem[]>([
    { id: "1", product_name: "", quantity: 1, unit_price: 0, total: 0 },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'quantity' || field === 'unit_price') {
      const qty = field === 'quantity' ? Number(value) : updated[index].quantity;
      const price = field === 'unit_price' ? Number(value) : updated[index].unit_price;
      updated[index].total = qty * price;
    }
    
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), product_name: "", quantity: 1, unit_price: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const clearItems = () => {
    setItems([{ id: "1", product_name: "", quantity: 1, unit_price: 0, total: 0 }]);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.075;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleNextStep = () => {
    // Validate step 1
    if (step === 1) {
      if (!orderData.customer_name || !orderData.customer_email || !orderData.customer_phone || !orderData.customer_address) {
        setError("Please fill in all customer fields");
        setTimeout(() => setError(""), 3000);
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      // Validate items
      const hasEmptyItem = items.some(item => !item.product_name || item.unit_price <= 0 || item.quantity <= 0);
      if (hasEmptyItem) {
        setError("Please fill in all item details correctly");
        setTimeout(() => setError(""), 3000);
        return;
      }
      setError("");
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        router.push("/orders");
      }, 2000);
    } catch (err) {
      setError("Failed to create order. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All progress will be lost.")) {
      router.push("/orders");
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Order Created Successfully!</h2>
          <p className="mt-2 text-slate-500">Order has been created and is being processed.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/orders">
              <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                View All Orders
              </button>
            </Link>
            <Link href="/orders/new">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create Another
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* ============================================
      HEADER
      ============================================ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              Create New Order
            </h1>
            <p className="text-sm text-slate-500">Create a new customer order.</p>
          </div>
        </div>
        <button
          onClick={handleCancel}
          className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* ============================================
      STEPS
      ============================================ */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            1
          </div>
          <span className="text-sm font-medium">Customer</span>
        </div>
        <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            2
          </div>
          <span className="text-sm font-medium">Items</span>
        </div>
        <div className={`flex-1 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`} />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            3
          </div>
          <span className="text-sm font-medium">Review</span>
        </div>
      </div>

      {/* ============================================
      ERROR
      ============================================ */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ============================================
        STEP 1: CUSTOMER INFORMATION
        ============================================ */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={orderData.customer_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={orderData.customer_email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={orderData.customer_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="+234 800 123 4567"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  name="customer_address"
                  value={orderData.customer_address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="123 Business Street, Lagos, Nigeria"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Order Type
                </label>
                <select
                  name="order_type"
                  value={orderData.order_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Delivery Method
                </label>
                <select
                  name="delivery_method"
                  value={orderData.delivery_method}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="delivery">Delivery</option>
                  <option value="pickup">Pickup</option>
                  <option value="shipping">Shipping</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* ============================================
        STEP 2: ORDER ITEMS
        ============================================ */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Order Items
            </h2>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={item.product_name}
                      onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Product name"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Qty *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Price (₦) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(index, 'unit_price', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Total
                    </label>
                    <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-emerald-600">
                      ₦{(item.total || 0).toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="self-end mb-0.5 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 border border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
              <button
                type="button"
                onClick={clearItems}
                className="px-4 py-2 border border-dashed border-red-300 rounded-lg text-sm text-red-500 hover:border-red-400 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Review Order →
              </button>
            </div>
          </div>
        )}

        {/* ============================================
        STEP 3: REVIEW & SUBMIT
        ============================================ */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Review Order
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-sm text-slate-700 mb-2">Customer Details</h3>
                <div className="space-y-1 text-sm bg-slate-50 p-3 rounded-lg">
                  <p><span className="text-slate-500">Name:</span> {orderData.customer_name}</p>
                  <p><span className="text-slate-500">Email:</span> {orderData.customer_email}</p>
                  <p><span className="text-slate-500">Phone:</span> {orderData.customer_phone}</p>
                  <p><span className="text-slate-500">Address:</span> {orderData.customer_address}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-slate-700 mb-2">Order Details</h3>
                <div className="space-y-1 text-sm bg-slate-50 p-3 rounded-lg">
                  <p><span className="text-slate-500">Type:</span> {orderData.order_type.charAt(0).toUpperCase() + orderData.order_type.slice(1)}</p>
                  <p><span className="text-slate-500">Delivery:</span> {orderData.delivery_method.charAt(0).toUpperCase() + orderData.delivery_method.slice(1)}</p>
                  <p><span className="text-slate-500">Items:</span> {items.length}</p>
                  <p><span className="text-slate-500">Payment:</span> {orderData.payment_method.replace('_', ' ').charAt(0).toUpperCase() + orderData.payment_method.replace('_', ' ').slice(1)}</p>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="font-semibold text-sm text-slate-700 mb-2">Order Items</h3>
                <div className="bg-slate-50 rounded-lg p-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-slate-200 last:border-0">
                      <span>{item.product_name} × {item.quantity}</span>
                      <span className="font-medium">₦{(item.total || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span>₦{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax (7.5%)</span>
                    <span>₦{calculateTax().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span className="text-emerald-600">₦{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Order Notes
                </label>
                <textarea
                  name="notes"
                  value={orderData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  placeholder="Any special instructions or notes..."
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Order
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}