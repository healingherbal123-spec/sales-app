"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
ArrowDownToLine,
ArrowRight,
Calendar,
CheckCircle2,
ChevronDown,
Clock3,
DollarSign,
Eye,
FileImage,
Filter,
Package,
Plus,
RefreshCw,
Search,
ShoppingCart,
TrendingUp,
Upload,
UserRound,
Users,
WalletCards,
X,
AlertCircle,
Trash2,
Edit,
Minus,
Plus as PlusIcon,
Save,
List,
Grid,
Image,
Tag,
Box,
Truck,
Clock,
Check,
AlertTriangle,
Printer,
Mail,
Phone,
MapPin,
Building2,
Store,
Layers,
ShoppingBag as ShoppingBagIcon,
CreditCard,
Receipt,
FileText,
Download,
Copy,
Share2,
MoreVertical,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ──────────────────────────────────────────────────────
type OrderStatus =
| "pending"
| "processing"
| "out_for_delivery"
| "delivered"
| "cancelled";

type PaymentStatus = "pending" | "partial" | "paid" | "failed";

type Order = {
id: string;
order_number: string | null;
customer_id: string | null;
customer_name: string | null;
customer_phone: string | null;
customer_email: string | null;
customer_address: string | null;
status: OrderStatus;
payment_status: PaymentStatus;
payment_method: string | null;
total: number;
amount_paid: number;
amount_due: number;
payment_evidence_url: string | null;
delivery_status: string | null;
created_at: string;
items?: OrderItem[];
};

type OrderItem = {
id: string;
order_id: string;
product_id: string;
product_name: string;
product_sku: string | null;
quantity: number;
unit_price: number;
total_price: number;
notes: string | null;
product?: Product;
};

type Product = {
id: string;
name: string;
description: string | null;
sku: string | null;
price: number;
cost: number | null;
stock: number;
category: string | null;
image_url: string | null;
status: 'active' | 'inactive' | 'out_of_stock';
created_at: string;
updated_at: string;
};

type Customer = {
id: string;
name: string;
phone: string | null;
email: string | null;
address: string | null;
created_at: string;
};

type Profile = {
id: string;
company_id: string | null;
full_name: string | null;
email: string | null;
role: string | null;
};

type CartItem = {
product_id: string;
product_name: string;
product_sku: string | null;
quantity: number;
unit_price: number;
total_price: number;
stock: number;
};

// ─── Constants ──────────────────────────────────────────────────
const TARGET = 30;

const formatCurrency = (value: number) =>
new Intl.NumberFormat("en-NG", {
style: "currency",
currency: "NGN",
maximumFractionDigits: 0,
}).format(value);

const formatDate = (date: string) =>
new Intl.DateTimeFormat("en-NG", {
day: "numeric",
month: "short",
year: "numeric",
}).format(new Date(date));

const formatDateTime = (date: string) =>
new Intl.DateTimeFormat("en-NG", {
day: "numeric",
month: "short",
year: "numeric",
hour: "2-digit",
minute: "2-digit",
}).format(new Date(date));

const statusLabel = (status: string) =>
status
.replaceAll("_", " ")
.replace(/\b\w/g, (letter) => letter.toUpperCase());

function statusClass(status: string) {
switch (status) {
case "delivered":
case "paid":
return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400";
case "processing":
case "partial":
return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
case "out_for_delivery":
return "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400";
case "cancelled":
case "failed":
return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400";
default:
return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";
}
}

// ─── Main Component ────────────────────────────────────────────
export default function SalesPage() {
const supabase = createClient();

// State
const [profile, setProfile] = useState<Profile | null>(null);
const [orders, setOrders] = useState<Order[]>([]);
const [customers, setCustomers] = useState<Customer[]>([]);
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [paymentFilter, setPaymentFilter] = useState("all");

// Order Creation
const [showOrderModal, setShowOrderModal] = useState(false);
const [selectedCustomer, setSelectedCustomer] = useState<string>("");
const [cartItems, setCartItems] = useState<CartItem[]>([]);
const [selectedProduct, setSelectedProduct] = useState<string>("");
const [productQuantity, setProductQuantity] = useState<number>(1);
const [orderNotes, setOrderNotes] = useState("");
const [savingOrder, setSavingOrder] = useState(false);

// Payment Modal
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
const [paymentAmount, setPaymentAmount] = useState("");
const [paymentMethod, setPaymentMethod] = useState("Transfer");
const [paymentReference, setPaymentReference] = useState("");
const [paymentEvidence, setPaymentEvidence] = useState<File | null>(null);
const [savingPayment, setSavingPayment] = useState(false);

// Product Management
const [showProductModal, setShowProductModal] = useState(false);
const [editingProduct, setEditingProduct] = useState<Product | null>(null);
const [productForm, setProductForm] = useState({
name: "",
description: "",
sku: "",
price: "",
cost: "",
stock: "",
category: "",
status: "active",
});
const [savingProduct, setSavingProduct] = useState(false);

// UI State
const [message, setMessage] = useState("");
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
const [showProductCatalog, setShowProductCatalog] = useState(false);

// ─── Load Data ────────────────────────────────────────────────
useEffect(() => {
loadSalesData();
}, []);

async function loadSalesData() {
setLoading(true);
try {
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
setLoading(false);
return;
}

const { data: profileData, error: profileError } = await supabase
.from("profiles")
.select("id, company_id, full_name, email, role")
.eq("id", user.id)
.single();

if (profileError) {
console.error(profileError);
setMessage("Unable to load your staff profile.");
setLoading(false);
return;
}

setProfile(profileData);

if (!profileData.company_id) {
setMessage("Your account is not connected to a company yet.");
setLoading(false);
return;
}

const [ordersResult, customersResult, productsResult] = await Promise.all([
supabase
.from("orders")
.select(`
id,
order_number,
customer_id,
customer_name,
customer_phone,
customer_email,
customer_address,
status,
payment_status,
payment_method,
total,
amount_paid,
amount_due,
payment_evidence_url,
delivery_status,
created_at
`)
.eq("company_id", profileData.company_id)
.eq("seller_id", user.id)
.order("created_at", { ascending: false }),
supabase
.from("customers")
.select("id, name, phone, email, address, created_at")
.eq("company_id", profileData.company_id)
.order("created_at", { ascending: false }),
supabase
.from("products")
.select("*")
.eq("company_id", profileData.company_id)
.in("status", ["active", "out_of_stock"])
.order("name", { ascending: true }),
]);

if (ordersResult.error) {
console.error(ordersResult.error);
setMessage("Unable to load your sales.");
} else {
setOrders((ordersResult.data || []) as Order[]);
}

if (!customersResult.error) {
setCustomers((customersResult.data || []) as Customer[]);
}

if (!productsResult.error) {
setProducts((productsResult.data || []) as Product[]);
}
} catch (error) {
console.error(error);
setMessage("Something went wrong while loading sales.");
} finally {
setLoading(false);
}
}

async function refreshSales() {
setRefreshing(true);
await loadSalesData();
setRefreshing(false);
}

// ─── Statistics ──────────────────────────────────────────────
const statistics = useMemo(() => {
const now = new Date();
const monthlyOrders = orders.filter((order) => {
const date = new Date(order.created_at);
return (
date.getMonth() === now.getMonth() &&
date.getFullYear() === now.getFullYear()
);
});

const validOrders = monthlyOrders.filter(
(order) => order.status !== "cancelled"
);

const sales = validOrders.reduce(
(sum, order) => sum + Number(order.total || 0),
0
);
const paid = validOrders.reduce(
(sum, order) => sum + Number(order.amount_paid || 0),
0
);
const outstanding = validOrders.reduce(
(sum, order) => sum + Number(order.amount_due || 0),
0
);
const completed = validOrders.filter(
(order) => order.status === "delivered"
).length;

return {
sales,
paid,
outstanding,
orders: monthlyOrders.length,
completed,
targetProgress: Math.min(
Math.round((monthlyOrders.length / TARGET) * 100),
100
),
};
}, [orders]);

// ─── Order Management ────────────────────────────────────────
const filteredOrders = useMemo(() => {
const query = search.trim().toLowerCase();
return orders.filter((order) => {
const matchesSearch =
!query ||
order.customer_name?.toLowerCase().includes(query) ||
order.customer_phone?.toLowerCase().includes(query) ||
order.order_number?.toLowerCase().includes(query);

const matchesStatus =
statusFilter === "all" || order.status === statusFilter;
const matchesPayment =
paymentFilter === "all" || order.payment_status === paymentFilter;

return matchesSearch && matchesStatus && matchesPayment;
});
}, [orders, search, statusFilter, paymentFilter]);

const recentOrders = filteredOrders.slice(0, 10);

// ─── Cart Management ──────────────────────────────────────────
function addToCart(productId: string) {
const product = products.find(p => p.id === productId);
if (!product) return;

const existingItem = cartItems.find(item => item.product_id === productId);
if (existingItem) {
const newQuantity = existingItem.quantity + productQuantity;
if (newQuantity > product.stock) {
setMessage(`Only ${product.stock} units available in stock.`);
return;
}
setCartItems(cartItems.map(item =>
item.product_id === productId
? {
...item,
quantity: newQuantity,
total_price: newQuantity * item.unit_price,
}
: item
));
} else {
if (productQuantity > product.stock) {
setMessage(`Only ${product.stock} units available in stock.`);
return;
}
setCartItems([...cartItems, {
product_id: product.id,
product_name: product.name,
product_sku: product.sku,
quantity: productQuantity,
unit_price: product.price,
total_price: product.price * productQuantity,
stock: product.stock,
}]);
}
setSelectedProduct("");
setProductQuantity(1);
setMessage(`Added ${product.name} to cart.`);
}

function removeFromCart(productId: string) {
setCartItems(cartItems.filter(item => item.product_id !== productId));
}

function updateCartQuantity(productId: string, newQuantity: number) {
const item = cartItems.find(item => item.product_id === productId);
if (!item) return;
if (newQuantity > item.stock) {
setMessage(`Only ${item.stock} units available in stock.`);
return;
}
if (newQuantity <= 0) {
removeFromCart(productId);
return;
}
setCartItems(cartItems.map(item =>
item.product_id === productId
? {
...item,
quantity: newQuantity,
total_price: newQuantity * item.unit_price,
}
: item
));
}

const cartTotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);

function clearCart() {
setCartItems([]);
}

// ─── Create Order ─────────────────────────────────────────────
async function createOrder() {
if (!selectedCustomer) {
setMessage("Please select a customer.");
return;
}
if (cartItems.length === 0) {
setMessage("Please add at least one product to the order.");
return;
}

setSavingOrder(true);
setMessage("");

try {
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
setMessage("Your session has expired.");
setSavingOrder(false);
return;
}

const customer = customers.find(c => c.id === selectedCustomer);
if (!customer) {
setMessage("Selected customer not found.");
setSavingOrder(false);
return;
}

const totalAmount = cartTotal;
const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

// Create the order
const { data: orderData, error: orderError } = await supabase
.from("orders")
.insert({
company_id: profile?.company_id,
seller_id: user.id,
customer_id: customer.id,
customer_name: customer.name,
customer_phone: customer.phone,
customer_email: customer.email,
customer_address: customer.address,
order_number: orderNumber,
total: totalAmount,
amount_paid: 0,
amount_due: totalAmount,
status: "pending",
payment_status: "pending",
notes: orderNotes || null,
})
.select()
.single();

if (orderError) {
console.error(orderError);
setMessage("Failed to create order.");
setSavingOrder(false);
return;
}

// Create order items
const orderItems = cartItems.map(item => ({
order_id: orderData.id,
product_id: item.product_id,
product_name: item.product_name,
product_sku: item.product_sku,
quantity: item.quantity,
unit_price: item.unit_price,
total_price: item.total_price,
}));

const { error: itemsError } = await supabase
.from("order_items")
.insert(orderItems);

if (itemsError) {
console.error(itemsError);
setMessage("Order created but items could not be saved.");
setSavingOrder(false);
return;
}

// Update product stock
for (const item of cartItems) {
const product = products.find(p => p.id === item.product_id);
if (product) {
const newStock = product.stock - item.quantity;
await supabase
.from("products")
.update({
stock: newStock,
status: newStock <= 0 ? 'out_of_stock' : 'active'
})
.eq("id", item.product_id);
}
}

// Reset form
setShowOrderModal(false);
setSelectedCustomer("");
setCartItems([]);
setOrderNotes("");

await loadSalesData();
setMessage(`✅ Order ${orderNumber} created successfully!`);
} catch (error) {
console.error(error);
setMessage("An unexpected error occurred.");
} finally {
setSavingOrder(false);
}
}

// ─── Payment Functions ────────────────────────────────────────
function openPaymentModal(order: Order) {
setSelectedOrder(order);
setPaymentAmount(String(Math.max(Number(order.amount_due || 0), 0)));
setPaymentMethod(order.payment_method || "Transfer");
setPaymentReference("");
setPaymentEvidence(null);
setMessage("");
setShowPaymentModal(true);
}

async function submitPayment() {
if (!selectedOrder || !profile?.company_id) return;

const amount = Number(paymentAmount);
if (!amount || amount <= 0) {
setMessage("Enter a valid payment amount.");
return;
}

setSavingPayment(true);
setMessage("");

try {
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
setMessage("Your session has expired.");
setSavingPayment(false);
return;
}

let evidenceUrl: string | null = null;
if (paymentEvidence) {
const fileExtension = paymentEvidence.name.split(".").pop() || "jpg";
const filePath = `payment-evidence/${profile.company_id}/${selectedOrder.id}-${Date.now()}.${fileExtension}`;
const { error: uploadError } = await supabase.storage
.from("payment-evidence")
.upload(filePath, paymentEvidence, { upsert: false });

if (uploadError) {
console.error(uploadError);
setMessage("Payment was not saved because the evidence upload failed.");
setSavingPayment(false);
return;
}

const { data: publicUrlData } = supabase.storage
.from("payment-evidence")
.getPublicUrl(filePath);
evidenceUrl = publicUrlData.publicUrl;
}

const { error: paymentError } = await supabase.from("payments").insert({
company_id: profile.company_id,
order_id: selectedOrder.id,
customer_id: selectedOrder.customer_id,
recorded_by: user.id,
amount,
method: paymentMethod,
status: "pending",
reference: paymentReference || null,
evidence_url: evidenceUrl,
paid_at: new Date().toISOString(),
});

if (paymentError) {
console.error(paymentError);
setMessage("Unable to record the payment.");
setSavingPayment(false);
return;
}

const newAmountPaid = Number(selectedOrder.amount_paid || 0) + amount;
const newAmountDue = Math.max(Number(selectedOrder.total || 0) - newAmountPaid, 0);
const newPaymentStatus = newAmountDue <= 0 ? "paid" : newAmountPaid > 0 ? "partial" : "pending";

const { error: orderError } = await supabase
.from("orders")
.update({
amount_paid: newAmountPaid,
amount_due: newAmountDue,
payment_status: newPaymentStatus,
payment_method: paymentMethod,
payment_evidence_url: evidenceUrl || selectedOrder.payment_evidence_url,
})
.eq("id", selectedOrder.id)
.eq("company_id", profile.company_id);

if (orderError) {
console.error(orderError);
setMessage("Payment was recorded, but the order could not be updated.");
setSavingPayment(false);
return;
}

setShowPaymentModal(false);
setSelectedOrder(null);
await loadSalesData();
setMessage("Payment recorded successfully. It is pending verification.");
} catch (error) {
console.error(error);
setMessage("An unexpected error occurred.");
} finally {
setSavingPayment(false);
}
}

// ─── Product Management ──────────────────────────────────────
async function saveProduct() {
if (!productForm.name) {
setMessage("Product name is required.");
return;
}

setSavingProduct(true);
setMessage("");

try {
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
setMessage("Your session has expired.");
setSavingProduct(false);
return;
}

const productData = {
company_id: profile?.company_id,
name: productForm.name,
description: productForm.description || null,
sku: productForm.sku || null,
price: parseFloat(productForm.price) || 0,
cost: parseFloat(productForm.cost) || null,
stock: parseInt(productForm.stock) || 0,
category: productForm.category || null,
status: productForm.status as 'active' | 'inactive' | 'out_of_stock',
updated_at: new Date().toISOString(),
};

if (editingProduct) {
const { error } = await supabase
.from("products")
.update(productData)
.eq("id", editingProduct.id)
.eq("company_id", profile?.company_id);

if (error) {
console.error(error);
setMessage("Failed to update product.");
setSavingProduct(false);
return;
}
setMessage("✅ Product updated successfully!");
} else {
productData.created_at = new Date().toISOString();
const { error } = await supabase
.from("products")
.insert(productData);

if (error) {
console.error(error);
setMessage("Failed to create product.");
setSavingProduct(false);
return;
}
setMessage("✅ Product created successfully!");
}

setShowProductModal(false);
setEditingProduct(null);
setProductForm({
name: "",
description: "",
sku: "",
price: "",
cost: "",
stock: "",
category: "",
status: "active",
});
await loadSalesData();
} catch (error) {
console.error(error);
setMessage("An unexpected error occurred.");
} finally {
setSavingProduct(false);
}
}

function openEditProduct(product: Product) {
setEditingProduct(product);
setProductForm({
name: product.name,
description: product.description || "",
sku: product.sku || "",
price: String(product.price),
cost: String(product.cost || ""),
stock: String(product.stock),
category: product.category || "",
status: product.status,
});
setShowProductModal(true);
}

// ─── Render ──────────────────────────────────────────────────
const greeting = profile?.full_name
? `Good morning, ${profile.full_name.split(" ")[0]}`
: "Good morning";

if (loading) {
return (
<div className="flex items-center justify-center min-h-screen">
<div className="text-center">
<RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
<p className="mt-4 text-slate-500">Loading your sales dashboard...</p>
</div>
</div>
);
}

return (
<div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
{/* ─── HEADER ─── */}
<div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
<div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
<div>
<p className="text-sm text-slate-500 dark:text-slate-400">
Sales Workspace
</p>
<h1 className="mt-1 text-2xl font-bold tracking-tight">
{greeting} 👋
</h1>
<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
Manage your sales, customers, payments, products and orders.
</p>
</div>
<div className="flex flex-wrap gap-2">
<button
onClick={refreshSales}
disabled={refreshing}
className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
>
<RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
Refresh
</button>
<button
onClick={() => {
setEditingProduct(null);
setProductForm({
name: "",
description: "",
sku: "",
price: "",
cost: "",
stock: "",
category: "",
status: "active",
});
setShowProductModal(true);
}}
className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
>
<Package className="h-4 w-4" />
Add Product
</button>
<button
onClick={() => {
setSelectedCustomer("");
setCartItems([]);
setOrderNotes("");
setShowOrderModal(true);
}}
className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
>
<Plus className="h-4 w-4" />
New Sale
</button>
</div>
</div>
</div>
</div>

<main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
{/* ─── MESSAGE ─── */}
{message && (
<div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
<span className="flex-1">{message}</span>
<button
onClick={() => setMessage("")}
className="opacity-70 hover:opacity-100"
>
<X className="h-4 w-4" />
</button>
</div>
)}

{/* ─── QUICK ACTIONS ─── */}
<section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
<button
onClick={() => {
setSelectedCustomer("");
setCartItems([]);
setOrderNotes("");
setShowOrderModal(true);
}}
className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900"
>
<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
<ShoppingCart className="h-5 w-5" />
</div>
<p className="font-semibold">New Sale</p>
<p className="mt-1 text-xs text-slate-500">Create an order</p>
</button>

<Link
href="/dashboard/customers"
className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900"
>
<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
<UserRound className="h-5 w-5" />
</div>
<p className="font-semibold">Customers</p>
<p className="mt-1 text-xs text-slate-500">Manage customers</p>
</Link>

<button
onClick={() => {
setEditingProduct(null);
setProductForm({
name: "",
description: "",
sku: "",
price: "",
cost: "",
stock: "",
category: "",
status: "active",
});
setShowProductModal(true);
}}
className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900"
>
<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
<Package className="h-5 w-5" />
</div>
<p className="font-semibold">Products</p>
<p className="mt-1 text-xs text-slate-500">Manage inventory</p>
</button>

<button
onClick={() => {
const order = orders.find((item) => Number(item.amount_due || 0) > 0);
if (order) {
openPaymentModal(order);
} else {
setMessage("You currently have no outstanding payments.");
}
}}
className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900"
>
<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
<WalletCards className="h-5 w-5" />
</div>
<p className="font-semibold">Record Payment</p>
<p className="mt-1 text-xs text-slate-500">Record customer payment</p>
</button>

<Link
href="/dashboard/ai/contact"
className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900"
>
<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400">
<TrendingUp className="h-5 w-5" />
</div>
<p className="font-semibold">AI Follow-ups</p>
<p className="mt-1 text-xs text-slate-500">Get AI recommendations</p>
</Link>

<Link
href="/dashboard/inventory"
className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900"
>
<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/30 dark:text-cyan-400">
<Box className="h-5 w-5" />
</div>
<p className="font-semibold">Inventory</p>
<p className="mt-1 text-xs text-slate-500">Stock management</p>
</Link>
</section>

{/* ─── STATS ─── */}
<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
<StatCard
title="My Sales"
value={formatCurrency(statistics.sales)}
icon={<DollarSign className="h-5 w-5" />}
color="blue"
/>
<StatCard
title="My Orders"
value={String(statistics.orders)}
icon={<ShoppingCart className="h-5 w-5" />}
color="violet"
/>
<StatCard
title="Customers"
value={String(customers.length)}
icon={<Users className="h-5 w-5" />}
color="emerald"
/>
<StatCard
title="Products"
value={String(products.length)}
icon={<Package className="h-5 w-5" />}
color="amber"
/>
<StatCard
title="Outstanding"
value={formatCurrency(statistics.outstanding)}
icon={<Clock3 className="h-5 w-5" />}
color="red"
/>
</section>

{/* ─── TARGET ─── */}
<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
<div>
<p className="text-sm font-medium text-slate-500">
Monthly Sales Target
</p>
<div className="mt-1 flex items-baseline gap-2">
<span className="text-3xl font-bold">{statistics.orders}</span>
<span className="text-slate-400">/ {TARGET} sales</span>
</div>
</div>
<div className="text-left sm:text-right">
<p className="text-2xl font-bold text-blue-600">
{statistics.targetProgress}%
</p>
<p className="text-xs text-slate-500">Target progress</p>
</div>
</div>
<div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
<div
className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all"
style={{ width: `${statistics.targetProgress}%` }}
/>
</div>
<div className="mt-3 flex justify-between text-xs text-slate-500">
<span>{Math.max(TARGET - statistics.orders, 0)} sales remaining</span>
<span>{statistics.completed} delivered</span>
</div>
</section>

{/* ─── ORDERS ─── */}
<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
<div className="border-b border-slate-200 p-5 dark:border-slate-800">
<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
<div>
<h2 className="text-lg font-bold">My Sales</h2>
<p className="text-sm text-slate-500">Orders created by you.</p>
</div>
<div className="flex flex-col gap-2 sm:flex-row">
<div className="relative">
<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
<input
value={search}
onChange={(e) => setSearch(e.target.value)}
placeholder="Search customer or order..."
className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64 dark:border-slate-700 dark:bg-slate-950"
/>
</div>
<div className="relative">
<Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
<select
value={statusFilter}
onChange={(e) => setStatusFilter(e.target.value)}
className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
>
<option value="all">All Status</option>
<option value="pending">Pending</option>
<option value="processing">Processing</option>
<option value="out_for_delivery">Out for Delivery</option>
<option value="delivered">Delivered</option>
<option value="cancelled">Cancelled</option>
</select>
<ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
</div>
<select
value={paymentFilter}
onChange={(e) => setPaymentFilter(e.target.value)}
className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
>
<option value="all">All Payments</option>
<option value="pending">Pending</option>
<option value="partial">Partial</option>
<option value="paid">Paid</option>
<option value="failed">Failed</option>
</select>
</div>
</div>
</div>

{recentOrders.length === 0 ? (
<div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
<div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
<Package className="h-6 w-6 text-slate-400" />
</div>
<h3 className="mt-4 font-semibold">No sales found</h3>
<p className="mt-1 max-w-sm text-sm text-slate-500">
Create your first sale or change your search filters.
</p>
<button
onClick={() => {
setSelectedCustomer("");
setCartItems([]);
setOrderNotes("");
setShowOrderModal(true);
}}
className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
>
<Plus className="h-4 w-4" />
Create Sale
</button>
</div>
) : (
<div className="overflow-x-auto">
<table className="w-full min-w-[900px]">
<thead className="bg-slate-50 dark:bg-slate-950/50">
<tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
<th className="px-5 py-3">Order</th>
<th className="px-5 py-3">Customer</th>
<th className="px-5 py-3">Items</th>
<th className="px-5 py-3">Amount</th>
<th className="px-5 py-3">Payment</th>
<th className="px-5 py-3">Status</th>
<th className="px-5 py-3">Date</th>
<th className="px-5 py-3 text-right">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
{recentOrders.map((order) => (
<tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
<td className="px-5 py-4">
<span className="font-semibold">
{order.order_number || `#${order.id.slice(0, 8)}`}
</span>
</td>
<td className="px-5 py-4">
<div className="font-medium">
{order.customer_name || "Unknown customer"}
</div>
{order.customer_phone && (
<div className="text-xs text-slate-500">{order.customer_phone}</div>
)}
</td>
<td className="px-5 py-4 text-sm text-slate-500">
{order.items?.length || 0} items
</td>
<td className="px-5 py-4">
<div className="font-semibold">
{formatCurrency(Number(order.total || 0))}
</div>
{Number(order.amount_due || 0) > 0 && (
<div className="text-xs text-red-500">
Due {formatCurrency(Number(order.amount_due))}
</div>
)}
</td>
<td className="px-5 py-4">
<span
className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
order.payment_status
)}`}
>
{statusLabel(order.payment_status)}
</span>
</td>
<td className="px-5 py-4">
<span
className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
order.status
)}`}
>
{statusLabel(order.status)}
</span>
</td>
<td className="px-5 py-4 text-sm text-slate-500">
{formatDate(order.created_at)}
</td>
<td className="px-5 py-4">
<div className="flex justify-end gap-2">
<Link
href={`/dashboard/sales/${order.id}`}
className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
>
<Eye className="h-3.5 w-3.5" />
View
</Link>
{Number(order.amount_due || 0) > 0 && (
<button
onClick={() => openPaymentModal(order)}
className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
>
<WalletCards className="h-3.5 w-3.5" />
Payment
</button>
)}
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
)}

{filteredOrders.length > 10 && (
<div className="border-t border-slate-200 p-4 text-center dark:border-slate-800">
<button
onClick={() =>
setMessage(
`Showing the 10 most recent sales. ${filteredOrders.length - 10} additional sales match your filters.`
)
}
className="text-sm font-semibold text-blue-600 hover:text-blue-700"
>
View more sales
<ArrowRight className="ml-1 inline h-4 w-4" />
</button>
</div>
)}
</section>

{/* ─── AI SALES ASSISTANT ─── */}
<section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/20">
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
<div className="flex gap-3">
<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
<TrendingUp className="h-5 w-5" />
</div>
<div>
<h2 className="font-bold">AI Sales Assistant</h2>
<p className="mt-1 max-w-xl text-sm text-slate-600 dark:text-slate-300">
Let AI help prioritize customers, identify follow-ups and suggest your next sales action.
</p>
</div>
</div>
<Link
href="/dashboard/ai/contact"
className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
>
Open AI Assistant
<ArrowRight className="h-4 w-4" />
</Link>
</div>
</section>
</main>

{/* ─── ORDER MODAL ─── */}
{showOrderModal && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 overflow-y-auto">
<div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 my-8">
<div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 rounded-t-2xl z-10">
<div>
<h2 className="text-xl font-bold">Create New Order</h2>
<p className="text-sm text-slate-500">Add products and create an order for a customer</p>
</div>
<button
onClick={() => setShowOrderModal(false)}
className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
>
<X className="h-5 w-5" />
</button>
</div>

<div className="p-5 space-y-6">
{/* Customer Selection */}
<div>
<label className="mb-1.5 block text-sm font-medium">Select Customer *</label>
<select
value={selectedCustomer}
onChange={(e) => setSelectedCustomer(e.target.value)}
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
>
<option value="">Select a customer</option>
{customers.map((customer) => (
<option key={customer.id} value={customer.id}>
{customer.name} {customer.phone ? `- ${customer.phone}` : ''}
</option>
))}
</select>
<Link href="/dashboard/customers/new" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
+ Add new customer
</Link>
</div>

{/* Product Selection */}
<div>
<label className="mb-1.5 block text-sm font-medium">Add Products</label>
<div className="flex gap-3">
<select
value={selectedProduct}
onChange={(e) => setSelectedProduct(e.target.value)}
className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
>
<option value="">Search products...</option>
{products.map((product) => (
<option key={product.id} value={product.id}>
{product.name} - {formatCurrency(product.price)} ({product.stock} in stock)
</option>
))}
</select>
<input
type="number"
min="1"
value={productQuantity}
onChange={(e) => setProductQuantity(Math.max(1, parseInt(e.target.value) || 1))}
className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-center outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
/>
<button
onClick={() => selectedProduct && addToCart(selectedProduct)}
disabled={!selectedProduct}
className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
>
<PlusIcon className="h-4 w-4" />
</button>
</div>
{selectedProduct && products.find(p => p.id === selectedProduct)?.stock === 0 && (
<p className="text-xs text-red-500 mt-1">This product is out of stock.</p>
)}
</div>

{/* Cart */}
{cartItems.length > 0 && (
<div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
<div className="bg-slate-50 dark:bg-slate-950/50 px-4 py-2 flex items-center justify-between">
<span className="font-medium text-sm">Cart ({cartItems.length} items)</span>
<button
onClick={clearCart}
className="text-xs text-red-600 hover:text-red-700"
>
Clear all
</button>
</div>
<div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
{cartItems.map((item) => (
<div key={item.product_id} className="px-4 py-3 flex items-center justify-between">
<div className="flex-1">
<p className="font-medium text-sm">{item.product_name}</p>
<p className="text-xs text-slate-500">{formatCurrency(item.unit_price)} each</p>
</div>
<div className="flex items-center gap-3">
<button
onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
>
<Minus className="h-4 w-4" />
</button>
<span className="w-8 text-center text-sm">{item.quantity}</span>
<button
onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
>
<PlusIcon className="h-4 w-4" />
</button>
<button
onClick={() => removeFromCart(item.product_id)}
className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500"
>
<Trash2 className="h-4 w-4" />
</button>
</div>
</div>
))}
</div>
<div className="bg-slate-50 dark:bg-slate-950/50 px-4 py-3 flex justify-between items-center">
<span className="font-bold">Total: {formatCurrency(cartTotal)}</span>
<span className="text-sm text-slate-500">{cartItems.reduce((sum, i) => sum + i.quantity, 0)} items</span>
</div>
</div>
)}

{/* Order Notes */}
<div>
<label className="mb-1.5 block text-sm font-medium">Order Notes</label>
<textarea
value={orderNotes}
onChange={(e) => setOrderNotes(e.target.value)}
placeholder="Add notes about this order..."
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 resize-none"
rows={2}
/>
</div>

{/* Actions */}
<div className="flex gap-3 pt-2">
<button
onClick={() => setShowOrderModal(false)}
className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
>
Cancel
</button>
<button
onClick={createOrder}
disabled={savingOrder || cartItems.length === 0 || !selectedCustomer}
className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
>
{savingOrder ? (
<>
<RefreshCw className="h-4 w-4 animate-spin" />
Creating...
</>
) : (
<>
<CheckCircle2 className="h-4 w-4" />
Create Order
</>
)}
</button>
</div>
</div>
</div>
</div>
)}

{/* ─── PRODUCT MODAL ─── */}
{showProductModal && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 overflow-y-auto">
<div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 my-8">
<div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 rounded-t-2xl z-10">
<div>
<h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
<p className="text-sm text-slate-500">{editingProduct ? 'Update product details' : 'Add a new product to your inventory'}</p>
</div>
<button
onClick={() => {
setShowProductModal(false);
setEditingProduct(null);
}}
className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
>
<X className="h-5 w-5" />
</button>
</div>

<div className="p-5 space-y-4">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className="mb-1.5 block text-sm font-medium">Product Name *</label>
<input
type="text"
value={productForm.name}
onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
placeholder="Enter product name"
/>
</div>
<div>
<label className="mb-1.5 block text-sm font-medium">SKU</label>
<input
type="text"
value={productForm.sku}
onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
placeholder="SKU-001"
/>
</div>
</div>

<div>
<label className="mb-1.5 block text-sm font-medium">Description</label>
<textarea
value={productForm.description}
onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 resize-none"
rows={2}
placeholder="Product description..."
/>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div>
<label className="mb-1.5 block text-sm font-medium">Price (₦) *</label>
<input
type="number"
step="0.01"
value={productForm.price}
onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
placeholder="0.00"
/>
</div>
<div>
<label className="mb-1.5 block text-sm font-medium">Cost (₦)</label>
<input
type="number"
step="0.01"
value={productForm.cost}
onChange={(e) => setProductForm({ ...productForm, cost: e.target.value })}
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
placeholder="0.00"
/>
</div>
<div>
<label className="mb-1.5 block text-sm font-medium">Stock *</label>
<input
type="number"
value={productForm.stock}
onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
placeholder="0"
/>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label className="mb-1.5 block text-sm font-medium">Category</label>
<input
type="text"
value={productForm.category}
onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
placeholder="Electronics"
/>
</div>
<div>
<label className="mb-1.5 block text-sm font-medium">Status</label>
<select
value={productForm.status}
onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
>
<option value="active">Active</option>
<option value="inactive">Inactive</option>
<option value="out_of_stock">Out of Stock</option>
</select>
</div>
</div>

<div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
<button
onClick={() => {
setShowProductModal(false);
setEditingProduct(null);
}}
className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
>
Cancel
</button>
<button
onClick={saveProduct}
disabled={savingProduct}
className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
>
{savingProduct ? (
<>
<RefreshCw className="h-4 w-4 animate-spin" />
Saving...
</>
) : (
<>
<Save className="h-4 w-4" />
{editingProduct ? 'Update Product' : 'Save Product'}
</>
)}
</button>
</div>
</div>
</div>
</div>
)}

{/* ─── PAYMENT MODAL ─── */}
{showPaymentModal && selectedOrder && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
<div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
<div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
<div>
<h2 className="font-bold">Record Payment</h2>
<p className="mt-1 text-xs text-slate-500">
Order {selectedOrder.order_number || `#${selectedOrder.id.slice(0, 8)}`}
</p>
</div>
<button
onClick={() => setShowPaymentModal(false)}
className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
>
<X className="h-5 w-5" />
</button>
</div>
<div className="space-y-4 p-5">
<div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
<div className="flex justify-between text-sm">
<span className="text-slate-500">Customer</span>
<span className="font-medium">{selectedOrder.customer_name || "Unknown"}</span>
</div>
<div className="mt-2 flex justify-between text-sm">
<span className="text-slate-500">Amount due</span>
<span className="font-bold text-red-600">
{formatCurrency(Number(selectedOrder.amount_due || 0))}
</span>
</div>
</div>

<div>
<label className="mb-1.5 block text-sm font-medium">Payment Amount</label>
<input
type="number"
min="1"
value={paymentAmount}
onChange={(e) => setPaymentAmount(e.target.value)}
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
/>
</div>

<div>
<label className="mb-1.5 block text-sm font-medium">Payment Method</label>
<select
value={paymentMethod}
onChange={(e) => setPaymentMethod(e.target.value)}
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
>
<option>Transfer</option>
<option>Cash</option>
<option>Card</option>
<option>POS</option>
</select>
</div>

<div>
<label className="mb-1.5 block text-sm font-medium">Payment Reference</label>
<input
type="text"
value={paymentReference}
onChange={(e) => setPaymentReference(e.target.value)}
placeholder="Optional transaction reference"
className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
/>
</div>

<div>
<label className="mb-1.5 block text-sm font-medium">Payment Evidence</label>
<label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 p-4 hover:border-blue-400 dark:border-slate-700">
<Upload className="h-5 w-5 text-slate-400" />
<div className="min-w-0 flex-1">
<p className="text-sm font-medium">
{paymentEvidence ? paymentEvidence.name : "Upload payment screenshot"}
</p>
<p className="text-xs text-slate-500">PNG, JPG or WEBP</p>
</div>
<input
type="file"
accept="image/png,image/jpeg,image/webp"
className="hidden"
onChange={(e) => setPaymentEvidence(e.target.files?.[0] || null)}
/>
<FileImage className="h-5 w-5 text-blue-600" />
</label>
</div>

<div className="flex gap-3 pt-2">
<button
onClick={() => setShowPaymentModal(false)}
disabled={savingPayment}
className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
>
Cancel
</button>
<button
onClick={submitPayment}
disabled={savingPayment}
className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
>
{savingPayment ? (
<>
<RefreshCw className="h-4 w-4 animate-spin" />
Saving...
</>
) : (
<>
<CheckCircle2 className="h-4 w-4" />
Submit Payment
</>
)}
</button>
</div>
</div>
</div>
</div>
)}
</div>
);
}

// ─── Stat Card Component ──────────────────────────────────────
function StatCard({
title,
value,
icon,
color,
}: {
title: string;
value: string;
icon: React.ReactNode;
color: string;
}) {
const colorClasses = {
blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400',
emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
red: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
};

return (
<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
<div className="flex items-center justify-between">
<div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
{icon}
</div>
</div>
<p className="mt-4 text-xs font-medium text-slate-500">{title}</p>
<p className="mt-1 text-xl font-bold">{value}</p>
</div>
);
}