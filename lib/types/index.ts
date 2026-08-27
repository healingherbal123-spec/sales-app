// ============================================
// USER ROLES
// ============================================
export type UserRole = 
  | 'owner'
  | 'admin'
  | 'manager'
  | 'sales'
  | 'inventory'
  | 'dispatcher'
  | 'delivery_agent'
  | 'accountant'
  | 'hr';

// ============================================
// USER
// ============================================
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  role_id: string;
  company_id: string;
  phone?: string;
  avatar_url?: string;
  department?: string;
  employee_id?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

// ============================================
// COMPANY
// ============================================
export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  industry: string;
  plan: 'startup' | 'business' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================
// ROLE
// ============================================
export interface Role {
  id: string;
  name: UserRole;
  display_name: string;
  description: string;
  permissions: string[];
  created_at: string;
}

// ============================================
// STAFF MEMBER
// ============================================
export interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  role_name: string;
  department?: string;
  status: 'active' | 'inactive' | 'pending';
  joined_at: string;
  avatar_url?: string;
}

// ============================================
// CUSTOMER
// ============================================
export interface Customer {
  id: string;
  company_id: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  type: 'individual' | 'business';
  tax_id?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// ORDER
// ============================================
export interface Order {
  id: string;
  company_id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  type: 'product' | 'service' | 'mixed';
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'delivered';
  payment_status: 'pending' | 'paid' | 'partial' | 'overdue';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// ============================================
// PRODUCT
// ============================================
export interface Product {
  id: string;
  company_id: string;
  name: string;
  sku: string;
  description?: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  min_stock: number;
  unit: string;
  image_url?: string;
  status: 'active' | 'inactive' | 'discontinued';
  created_at: string;
  updated_at: string;
}

// ============================================
// PAYMENT
// ============================================
export interface Payment {
  id: string;
  company_id: string;
  order_id: string;
  customer_id: string;
  amount: number;
  method: 'cash' | 'bank_transfer' | 'card' | 'mobile_money' | 'cheque';
  status: 'pending' | 'verified' | 'failed' | 'refunded';
  reference?: string;
  notes?: string;
  verified_by?: string;
  verified_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// DELIVERY
// ============================================
export interface Delivery {
  id: string;
  company_id: string;
  order_id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  address: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'failed' | 'returned';
  driver_id?: string;
  driver_name?: string;
  waybill?: string;
  tracking_url?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// NOTIFICATION
// ============================================
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  created_at: string;
}

// ============================================
// DASHBOARD STATS
// ============================================
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  lowStockItems: number;
  pendingDeliveries: number;
  outstandingPayments: number;
  growth: {
    revenue: number;
    orders: number;
    customers: number;
  };
}

// ============================================
// SALES STATS
// ============================================
export interface SalesStats {
  todaySales: number;
  monthlySales: number;
  monthlyTarget: number;
  targetProgress: number;
  customers: number;
  pendingOrders: number;
  outstandingPayments: number;
  followUps: number;
  recentSales: Order[];
}

// ============================================
// INVENTORY STATS
// ============================================
export interface InventoryStats {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  pendingRequests: number;
  recentMovements: StockMovement[];
}

export interface StockMovement {
  id: string;
  product_id: string;
  product_name: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason?: string;
  user_id: string;
  user_name: string;
  created_at: string;
}

// ============================================
// DELIVERY STATS
// ============================================
export interface DeliveryStats {
  pending: number;
  today: number;
  shipped: number;
  delivered: number;
  delayed: number;
  failed: number;
  activeDrivers: number;
  recentDeliveries: Delivery[];
}

// ============================================
// FINANCE STATS
// ============================================
export interface FinanceStats {
  todayRevenue: number;
  monthlyRevenue: number;
  paymentsReceived: number;
  outstandingPayments: number;
  pendingVerification: number;
  totalTransactions: number;
  recentPayments: Payment[];
}

// ============================================
// HR STATS
// ============================================
export interface HRStats {
  totalStaff: number;
  activeStaff: number;
  onLeave: number;
  pendingRequests: number;
  departments: number;
  newHires: number;
  recentStaff: StaffMember[];
}

// ============================================
// API RESPONSES
// ============================================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// PAGINATION
// ============================================
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}