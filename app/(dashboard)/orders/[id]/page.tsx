"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CreditCard, Clock, CheckCircle, AlertCircle, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample data - in real app, fetch from API
const ordersData = [
  {
    id: 1,
    orderNumber: "ORD-10482",
    customer: "Mary Johnson",
    phone: "08031234567",
    email: "mary.j@email.com",
    items: [
      { name: "Menopause Reverser", quantity: 2, price: 85000, total: 170000 }
    ],
    total: 170000,
    subtotal: 170000,
    deliveryFee: 3500,
    status: "Pending",
    paymentStatus: "Pending Verification",
    deliveryStatus: "Pending",
    date: "2024-08-13T10:30:00",
    seller: "Sarah J.",
    address: "12, Lagos Street, Ikeja, Lagos",
    notes: "Customer requested delivery by 5pm",
    timeline: [
      { time: "2024-08-13T10:30:00", status: "Order Created", description: "Order created by Sarah J." },
      { time: "2024-08-13T10:35:00", status: "Payment Uploaded", description: "Payment evidence uploaded" },
      { time: "2024-08-13T11:00:00", status: "Pending Verification", description: "Awaiting finance verification" }
    ]
  },
  {
    id: 2,
    orderNumber: "ORD-10481",
    customer: "James Brown",
    phone: "08029876543",
    email: "james.b@email.com",
    items: [
      { name: "Hormone Balance", quantity: 1, price: 85000, total: 85000 }
    ],
    total: 85000,
    subtotal: 85000,
    deliveryFee: 3000,
    status: "Completed",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    date: "2024-08-12T14:20:00",
    seller: "David O.",
    address: "5, Abuja Road, Garki, Abuja",
    notes: "Delivered to security post",
    timeline: [
      { time: "2024-08-12T14:20:00", status: "Order Created", description: "Order created by David O." },
      { time: "2024-08-12T14:25:00", status: "Payment Verified", description: "Payment verified by Finance" },
      { time: "2024-08-12T15:00:00", status: "Assigned to Delivery", description: "Waybill #WB-10481 created" },
      { time: "2024-08-12T16:30:00", status: "Picked Up", description: "Picked up by Dispatcher James" },
      { time: "2024-08-12T18:00:00", status: "Delivered", description: "Delivered to customer" }
    ]
  }
];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id;
  
  // Find order - in real app, fetch from API
  const order = ordersData.find(o => o.id === Number(orderId));
  
  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🔍</div>
          <h2 className="text-xl font-bold">Order not found</h2>
          <p className="text-slate-500">The order you're looking for doesn't exist</p>
          <Link href="/orders">
            <Button className="mt-4">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Completed": "bg-emerald-100 text-emerald-800",
      "Pending": "bg-amber-100 text-amber-800",
      "Processing": "bg-blue-100 text-blue-800",
      "Delayed": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/orders" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700">
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Order {order.orderNumber}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </h1>
          <p className="text-sm text-slate-500">Created on {formatDate(order.date)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Order</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Status</Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-blue-500" />
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">{order.customer}</p>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {order.phone}
                </p>
                <p className="text-sm text-slate-500">{order.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Delivery Address</p>
                <p className="text-sm text-slate-500 flex items-start gap-1">
                  <MapPin className="w-3 h-3 mt-0.5" /> {order.address}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-blue-500" />
              Order Items
            </h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(item.total)}</p>
                    <p className="text-xs text-slate-400">{formatCurrency(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Delivery Fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-blue-500" />
              Order Timeline
            </h2>
            <div className="space-y-4">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    {idx < order.timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-slate-200 my-1"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.status}</p>
                    <p className="text-sm text-slate-500">{event.description}</p>
                    <p className="text-xs text-slate-400">{formatDate(event.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Status Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-sm mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                <span className="text-sm">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                <span className="text-sm">Payment</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                <span className="text-sm">Delivery</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.deliveryStatus)}`}>
                  {order.deliveryStatus}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                <span className="text-sm">Seller</span>
                <span className="text-sm font-medium">{order.seller}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-sm mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Mark as Processing
              </Button>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Assign Delivery
              </Button>
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Review Payment
              </Button>
              <Button variant="outline" className="w-full">
                Print Order
              </Button>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-sm mb-2">Notes</h2>
              <p className="text-sm text-slate-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}