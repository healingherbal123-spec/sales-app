"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Image,
  FileText,
  Plus,
  Trash2,
  Eye,
  Save,
  ShoppingCart,
  Minus,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Available products with prices
const availableProducts = [
  { id: 1, name: "Menopause Reverser", price: 85000, sku: "MR-001" },
  { id: 2, name: "Hormone Balance", price: 45000, sku: "HB-002" },
  { id: 3, name: "Weight Management", price: 85000, sku: "WM-003" },
  { id: 4, name: "Skin Care Set", price: 45000, sku: "SC-004" },
  { id: 5, name: "Wellness Package", price: 120000, sku: "WP-005" },
  { id: 6, name: "Detox Kit", price: 65000, sku: "DK-006" },
  { id: 7, name: "Energy Booster", price: 38000, sku: "EB-007" },
  { id: 8, name: "Sleep Aid", price: 42000, sku: "SA-008" },
];

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
  sku: string;
}

export default function NewSalePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    paymentStatus: "Pending",
    deliveryAddress: "",
    notes: ""
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);

  // Show toast notification
  const showToast = (message: string, type: string = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ==================== CART FUNCTIONS ====================

  // Add product to cart
  const handleAddToCart = () => {
    if (!selectedProduct) {
      showToast("⚠️ Please select a product", "error");
      return;
    }

    const product = availableProducts.find(p => p.id === Number(selectedProduct));
    if (!product) return;

    // Check if product already in cart
    const existingItem = cartItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity
      const updatedItems = cartItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
          : item
      );
      setCartItems(updatedItems);
      showToast(`✅ Updated ${product.name} quantity`, "success");
    } else {
      // Add new item
      const newItem: CartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        total: product.price * quantity,
        sku: product.sku
      };
      setCartItems([...cartItems, newItem]);
      showToast(`✅ Added ${product.name} to cart`, "success");
    }

    // Reset selection
    setSelectedProduct("");
    setQuantity(1);
  };

  // Remove item from cart
  const handleRemoveItem = (id: number) => {
    const item = cartItems.find(i => i.id === id);
    setCartItems(cartItems.filter(item => item.id !== id));
    if (item) {
      showToast(`🗑️ Removed ${item.name} from cart`, "error");
    }
  };

  // Update quantity in cart
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item =>
      item.id === id
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    ));
  };

  // Clear cart
  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    if (confirm("Clear all items from cart?")) {
      setCartItems([]);
      showToast("🗑️ Cart cleared", "error");
    }
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  // ==================== UPLOAD FUNCTIONS ====================

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        showToast("⚠️ Please upload a valid image (JPEG, PNG) or PDF file", "error");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showToast("⚠️ File size must be less than 5MB", "error");
        return;
      }

      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      showToast(`📎 File selected: ${file.name}`, "info");
    }
  };

  // Handle upload submission
  const handleUpload = () => {
    if (!uploadFile) {
      showToast("⚠️ Please select a file to upload", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadSuccess(true);
          showToast("✅ Payment evidence uploaded successfully!", "success");
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Remove uploaded file
  const removeFile = () => {
    setUploadFile(null);
    setUploadPreview(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==================== FORM SUBMISSION ====================

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customerName || !formData.customerPhone) {
      showToast("⚠️ Please fill in customer name and phone", "error");
      return;
    }

    if (cartItems.length === 0) {
      showToast("⚠️ Please add at least one product to the cart", "error");
      return;
    }

    if ((formData.paymentStatus === "Pending Verification" || formData.paymentStatus === "Paid") && !uploadFile) {
      showToast("⚠️ Please upload payment evidence", "error");
      return;
    }

    showToast("📝 Creating sale and order...", "info");
    
    setTimeout(() => {
      showToast(`✅ Sale created successfully! Order #ORD-${String(Date.now()).slice(-6)}`, "success");
      setTimeout(() => {
        router.push("/sales");
      }, 1500);
    }, 1500);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-slide-in ${
          toast.type === "success" ? "bg-emerald-500 text-white" :
          toast.type === "error" ? "bg-red-500 text-white" :
          "bg-blue-500 text-white"
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
            {toast.type === "info" && <AlertCircle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Back Button */}
      <Link href="/sales" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Sales
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">New Sale</h1>
        <p className="text-sm text-slate-500">Record a new business sale with multiple products</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        {/* Customer Section */}
        <div>
          <h2 className="font-semibold text-sm mb-3 text-slate-700">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="08012345678"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.customerAddress}
              onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter customer address"
            />
          </div>
        </div>

        {/* ⭐ PRODUCT SECTION WITH MULTIPLE PRODUCTS */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-500" />
              Products <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-slate-400">({cartItems.length} items)</span>
            </h2>
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Add Product Row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Select a product...</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — {formatCurrency(product.price)}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-center"
              />
            </div>
            <Button
              type="button"
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add to Cart
            </Button>
          </div>

          {/* Cart Items */}
          {cartItems.length > 0 ? (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 grid grid-cols-12 gap-2 text-xs font-medium text-slate-500">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1 text-center">Action</div>
              </div>
              {cartItems.map((item) => (
                <div key={item.id} className="px-4 py-2 border-b border-slate-100 last:border-0 grid grid-cols-12 gap-2 items-center hover:bg-slate-50 transition-colors">
                  <div className="col-span-5">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.sku}</p>
                  </div>
                  <div className="col-span-2 text-center text-sm">{formatCurrency(item.price)}</div>
                  <div className="col-span-2 flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Minus className="w-3 h-3 text-slate-500" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Plus className="w-3 h-3 text-slate-500" />
                    </button>
                  </div>
                  <div className="col-span-2 text-right font-bold text-sm">{formatCurrency(item.total)}</div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
              {/* Cart Total */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-500">Total Items: {cartItems.reduce((sum, i) => sum + i.quantity, 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Subtotal</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(calculateTotal())}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No products added yet</p>
              <p className="text-xs text-slate-400">Select a product above and click "Add to Cart"</p>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="border-t border-slate-200 pt-4">
          <h2 className="font-semibold text-sm mb-3 text-slate-700">Payment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Payment Status <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Pending">⏳ Pending</option>
                <option value="Pending Verification">🔍 Pending Verification</option>
                <option value="Paid">✅ Paid</option>
                <option value="Part Paid">💰 Part Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Notes</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Payment notes"
              />
            </div>
          </div>
        </div>

        {/* Upload Payment Evidence */}
        <div className="border-t border-slate-200 pt-4">
          <h2 className="font-semibold text-sm mb-3 text-slate-700 flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-500" />
            Upload Payment Evidence
            {(formData.paymentStatus === "Pending Verification" || formData.paymentStatus === "Paid") && (
              <span className="text-xs text-red-500">* Required</span>
            )}
          </h2>

          <div className="space-y-3">
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                uploadFile ? "border-emerald-400 bg-emerald-50" : "border-slate-300 hover:border-emerald-400"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadPreview ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img 
                      src={uploadPreview} 
                      alt="Payment evidence preview" 
                      className="max-h-48 mx-auto rounded-lg border border-slate-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-600">{uploadFile?.name}</p>
                    <p className="text-xs text-slate-400">
                      {(uploadFile?.size || 0) / 1024 < 1024 
                        ? `${Math.round((uploadFile?.size || 0) / 1024)} KB` 
                        : `${Math.round((uploadFile?.size || 0) / (1024 * 1024))} MB`}
                    </p>
                    {uploadSuccess && (
                      <p className="text-xs text-emerald-600 flex items-center justify-center gap-1 mt-1">
                        <CheckCircle className="w-3 h-3" />
                        Uploaded successfully
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Click to upload payment evidence</p>
                  <p className="text-xs text-slate-400">PNG, JPG, PDF up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {isUploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Uploading...</span>
                  <span className="text-slate-500">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadFile && !uploadSuccess && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    isUploading 
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? "Uploading..." : "Upload Evidence"}
                </button>
                <button
                  type="button"
                  onClick={removeFile}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-700">Evidence uploaded successfully!</span>
              </div>
            )}

            <p className="text-xs text-slate-400">
              <span className="font-medium">Tip:</span> Upload a screenshot of bank transfer, POS receipt, or payment confirmation.
            </p>
          </div>
        </div>

        {/* Delivery Section */}
        <div className="border-t border-slate-200 pt-4">
          <h2 className="font-semibold text-sm mb-3 text-slate-700">Delivery Information</h2>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Delivery Address</label>
            <input
              type="text"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter delivery address"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row gap-3 justify-end">
          <Link href="/sales">
            <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
          </Link>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto flex items-center gap-2"
            disabled={cartItems.length === 0}
          >
            <Save className="w-4 h-4" />
            Create Sale & Order
          </Button>
        </div>

        {cartItems.length === 0 && (
          <p className="text-xs text-amber-600 text-center">Please add at least one product to create a sale</p>
        )}
      </form>
    </div>
  );
}