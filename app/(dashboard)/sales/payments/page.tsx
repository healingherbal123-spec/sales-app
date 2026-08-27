"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  X,
  Receipt,
  Wallet,
  TrendingUp,
  MoreVertical,
  Filter,
  Image as ImageIcon,
  FileCheck2,
  User,
  ShoppingBag,
  CalendarDays,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

type PaymentStatus =
  | "Paid"
  | "Pending"
  | "Partial"
  | "Awaiting Verification"
  | "Rejected";

type Payment = {
  id: string;
  orderId: string;
  customer: string;
  phone: string;
  product: string;
  orderAmount: number;
  paidAmount: number;
  paymentMethod: string;
  status: PaymentStatus;
  date: string;
  seller: string;
  evidence?: string;
  reference?: string;
};

const initialPayments: Payment[] = [
  {
    id: "PAY-1001",
    orderId: "ORD-1045",
    customer: "John Doe",
    phone: "+234 801 222 3344",
    product: "Premium Wellness Pack",
    orderAmount: 200000,
    paidAmount: 200000,
    paymentMethod: "Bank Transfer",
    status: "Paid",
    date: "Aug 21, 2026",
    seller: "You",
    reference: "TRX-883211",
    evidence: "payment-proof-1001.jpg",
  },
  {
    id: "PAY-1002",
    orderId: "ORD-1046",
    customer: "Mary Williams",
    phone: "+234 803 555 7890",
    product: "Fertilito",
    orderAmount: 200000,
    paidAmount: 100000,
    paymentMethod: "Bank Transfer",
    status: "Partial",
    date: "Aug 21, 2026",
    seller: "You",
    reference: "TRX-883212",
    evidence: "payment-proof-1002.jpg",
  },
  {
    id: "PAY-1003",
    orderId: "ORD-1047",
    customer: "David Mensah",
    phone: "+233 24 111 2222",
    product: "Ovulation Booster",
    orderAmount: 150000,
    paidAmount: 0,
    paymentMethod: "Pending",
    status: "Pending",
    date: "Aug 20, 2026",
    seller: "You",
  },
  {
    id: "PAY-1004",
    orderId: "ORD-1048",
    customer: "Grace Adams",
    phone: "+234 809 777 1111",
    product: "Egg Booster",
    orderAmount: 120000,
    paidAmount: 120000,
    paymentMethod: "Bank Transfer",
    status: "Awaiting Verification",
    date: "Aug 21, 2026",
    seller: "You",
    reference: "TRX-883215",
    evidence: "payment-proof-1004.jpg",
  },
  {
    id: "PAY-1005",
    orderId: "ORD-1049",
    customer: "Linda Brown",
    phone: "+234 812 333 4444",
    product: "Superwomb",
    orderAmount: 220000,
    paidAmount: 0,
    paymentMethod: "Cash",
    status: "Rejected",
    date: "Aug 19, 2026",
    seller: "You",
    reference: "TRX-883200",
    evidence: "payment-proof-1005.jpg",
  },
];

const currency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function SalesPaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "All" | PaymentStatus
  >("All");

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const [showAddPayment, setShowAddPayment] = useState(false);

  const [newCustomer, setNewCustomer] = useState("");
  const [newOrder, setNewOrder] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newPaid, setNewPaid] = useState("");
  const [newMethod, setNewMethod] = useState("Bank Transfer");
  const [evidenceName, setEvidenceName] = useState("");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.customer
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        payment.orderId
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        payment.product
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        payment.reference
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || payment.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [payments, search, filter]);

  const totalSales = payments.reduce(
    (sum, item) => sum + item.orderAmount,
    0
  );

  const totalPaid = payments.reduce(
    (sum, item) => sum + item.paidAmount,
    0
  );

  const outstanding = Math.max(totalSales - totalPaid, 0);

  const awaitingVerification = payments.filter(
    (item) => item.status === "Awaiting Verification"
  ).length;

  const pendingCount = payments.filter(
    (item) => item.status === "Pending"
  ).length;

  const verifyPayment = (id: string) => {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              status: "Paid",
            }
          : payment
      )
    );

    setSelectedPayment(null);
  };

  const rejectPayment = (id: string) => {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              status: "Rejected",
            }
          : payment
      )
    );

    setSelectedPayment(null);
  };

  const addPayment = () => {
    if (!newCustomer || !newOrder || !newProduct || !newAmount) {
      return;
    }

    const orderAmount = Number(newAmount) || 0;
    const paidAmount = Number(newPaid) || 0;

    let status: PaymentStatus = "Pending";

    if (paidAmount >= orderAmount && orderAmount > 0) {
      status = evidenceName
        ? "Awaiting Verification"
        : "Paid";
    } else if (paidAmount > 0) {
      status = "Partial";
    }

    const payment: Payment = {
      id: `PAY-${Date.now()}`,
      orderId: newOrder,
      customer: newCustomer,
      phone: "Not provided",
      product: newProduct,
      orderAmount,
      paidAmount,
      paymentMethod: newMethod,
      status,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      seller: "You",
      evidence: evidenceName || undefined,
      reference: `TRX-${Math.floor(
        100000 + Math.random() * 899999
      )}`,
    };

    setPayments((current) => [payment, ...current]);

    setNewCustomer("");
    setNewOrder("");
    setNewProduct("");
    setNewAmount("");
    setNewPaid("");
    setNewMethod("Bank Transfer");
    setEvidenceName("");
    setShowAddPayment(false);
  };

  const handleEvidence = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setEvidenceName(file.name);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                <span>Sales</span>
                <span>›</span>
                <span>Payments</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Sales Payments
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track customer payments, balances and payment evidence.
              </p>
            </div>

            <button
              onClick={() => setShowAddPayment(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus size={18} />
              Record Payment
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {/* KPI */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <PaymentStat
            title="Total Sales"
            value={currency(totalSales)}
            icon={<TrendingUp size={20} />}
          />

          <PaymentStat
            title="Total Paid"
            value={currency(totalPaid)}
            icon={<Wallet size={20} />}
          />

          <PaymentStat
            title="Outstanding"
            value={currency(outstanding)}
            icon={<AlertCircle size={20} />}
          />

          <PaymentStat
            title="Awaiting Review"
            value={String(awaitingVerification)}
            icon={<FileCheck2 size={20} />}
          />
        </div>

        {/* Alert */}
        {awaitingVerification > 0 && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Clock size={19} />
              </div>

              <div>
                <p className="font-semibold text-amber-900">
                  Payment verification required
                </p>

                <p className="mt-1 text-sm text-amber-800">
                  {awaitingVerification} payment
                  {awaitingVerification === 1 ? "" : "s"} waiting for
                  evidence review.
                </p>
              </div>
            </div>

            <button
              onClick={() => setFilter("Awaiting Verification")}
              className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-amber-800 shadow-sm"
            >
              Review
              <ArrowUpRight size={15} />
            </button>
          </div>
        )}

        {/* Search + filters */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, order, product or transaction..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="flex items-center gap-1 text-slate-400">
                <Filter size={15} />
              </div>

              {(
                [
                  "All",
                  "Paid",
                  "Pending",
                  "Partial",
                  "Awaiting Verification",
                  "Rejected",
                ] as const
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold ${
                    filter === status
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment list */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Payment Transactions</h2>
              <p className="text-sm text-slate-500">
                {filteredPayments.length} transaction
                {filteredPayments.length === 1 ? "" : "s"}
              </p>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setFilter("All");
              }}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
            >
              <RefreshCw size={15} />
              Reset
            </button>
          </div>

          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onOpen={() => setSelectedPayment(payment)}
              />
            ))}
          </div>

          {filteredPayments.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <Receipt
                className="mx-auto text-slate-300"
                size={40}
              />

              <p className="mt-3 font-semibold">
                No payments found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try another search or filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details */}
      {selectedPayment && (
        <Modal onClose={() => setSelectedPayment(null)}>
          <div className="flex items-start justify-between border-b border-slate-200 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Payment transaction
              </p>

              <h2 className="mt-1 text-xl font-bold">
                {selectedPayment.id}
              </h2>
            </div>

            <button
              onClick={() => setSelectedPayment(null)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5 p-5">
            <div className="grid grid-cols-2 gap-3">
              <Detail
                icon={<User size={16} />}
                label="Customer"
                value={selectedPayment.customer}
              />

              <Detail
                icon={<ShoppingBag size={16} />}
                label="Order"
                value={selectedPayment.orderId}
              />

              <Detail
                icon={<Receipt size={16} />}
                label="Product"
                value={selectedPayment.product}
              />

              <Detail
                icon={<CalendarDays size={16} />}
                label="Date"
                value={selectedPayment.date}
              />
            </div>

            <div className="rounded-2xl bg-slate-900 p-5 text-white">
              <p className="text-xs text-slate-400">
                PAYMENT SUMMARY
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Order amount
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    {currency(selectedPayment.orderAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Amount paid
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    {currency(selectedPayment.paidAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Balance
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {currency(
                      Math.max(
                        selectedPayment.orderAmount -
                          selectedPayment.paidAmount,
                        0
                      )
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Method
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {selectedPayment.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    Payment Evidence
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Screenshot or proof submitted by salesperson.
                  </p>
                </div>

                <ImageIcon
                  size={20}
                  className="text-slate-400"
                />
              </div>

              {selectedPayment.evidence ? (
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                      <ImageIcon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {selectedPayment.evidence}
                      </p>

                      <p className="text-xs text-slate-500">
                        Payment evidence uploaded
                      </p>
                    </div>

                    <button className="rounded-lg border border-slate-200 bg-white p-2 hover:bg-slate-100">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 py-8 text-center">
                  <Upload
                    className="mx-auto text-slate-300"
                    size={28}
                  />

                  <p className="mt-2 text-sm font-semibold">
                    No evidence uploaded
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedPayment.status ===
              "Awaiting Verification" && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    rejectPayment(selectedPayment.id)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  <XCircle size={17} />
                  Reject
                </button>

                <button
                  onClick={() =>
                    verifyPayment(selectedPayment.id)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 size={17} />
                  Verify Payment
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Add Payment */}
      {showAddPayment && (
        <Modal onClose={() => setShowAddPayment(false)}>
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h2 className="text-xl font-bold">
                Record Payment
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add a customer payment transaction.
              </p>
            </div>

            <button
              onClick={() => setShowAddPayment(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 p-5">
            <Input
              label="Customer"
              value={newCustomer}
              onChange={setNewCustomer}
              placeholder="John Doe"
            />

            <Input
              label="Order ID"
              value={newOrder}
              onChange={setNewOrder}
              placeholder="ORD-1050"
            />

            <Input
              label="Product"
              value={newProduct}
              onChange={setNewProduct}
              placeholder="Product name"
            />

            <Input
              label="Order amount"
              value={newAmount}
              onChange={setNewAmount}
              placeholder="200000"
              type="number"
            />

            <Input
              label="Amount paid"
              value={newPaid}
              onChange={setNewPaid}
              placeholder="200000"
              type="number"
            />

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">
                Payment method
              </span>

              <select
                value={newMethod}
                onChange={(e) =>
                  setNewMethod(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-400"
              >
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>Card</option>
                <option>Mobile Money</option>
                <option>Payment Gateway</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">
                Payment evidence
              </span>

              <div className="rounded-xl border border-dashed border-slate-300 p-4">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleEvidence}
                  className="w-full text-sm"
                />

                {evidenceName && (
                  <p className="mt-2 text-xs text-emerald-600">
                    ✓ {evidenceName}
                  </p>
                )}
              </div>
            </label>

            <button
              onClick={addPayment}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
            >
              <Receipt size={18} />
              Save Payment
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function PaymentStat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-slate-500">{icon}</div>

      <p className="mt-4 text-xl font-bold sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-600">
        {title}
      </p>
    </div>
  );
}

function PaymentCard({
  payment,
  onOpen,
}: {
  payment: Payment;
  onOpen: () => void;
}) {
  const balance = Math.max(
    payment.orderAmount - payment.paidAmount,
    0
  );

  const progress =
    payment.orderAmount > 0
      ? Math.min(
          (payment.paidAmount / payment.orderAmount) * 100,
          100
        )
      : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Receipt size={19} className="text-slate-600" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">
                  {payment.customer}
                </h3>

                <PaymentStatus status={payment.status} />
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {payment.orderId} · {payment.product}
              </p>
            </div>

            <button
              onClick={onOpen}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <MoreVertical size={18} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Amount
              label="Order"
              value={currency(payment.orderAmount)}
            />

            <Amount
              label="Paid"
              value={currency(payment.paidAmount)}
            />

            <Amount
              label="Balance"
              value={currency(balance)}
            />

            <Amount
              label="Method"
              value={payment.paymentMethod}
            />
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-[11px] text-slate-500">
              <span>Payment progress</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{payment.date}</span>

              {payment.evidence && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <ImageIcon size={13} />
                  Evidence
                </span>
              )}
            </div>

            <button
              onClick={onOpen}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
            >
              View Payment
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentStatus({
  status,
}: {
  status: PaymentStatus;
}) {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-slate-100 text-slate-600",
    Partial: "bg-amber-50 text-amber-700",
    "Awaiting Verification":
      "bg-blue-50 text-blue-700",
    Rejected: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function Amount({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 truncate text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
      />
    </label>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto bg-white sm:max-w-lg sm:rounded-2xl">
        {children}
      </div>
    </div>
  );
}