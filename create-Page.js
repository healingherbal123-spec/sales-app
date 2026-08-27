const fs = require('fs');
const path = require('path');

const pages = [
  // Sales Management
  { path: 'app/(dashboard)/sales/customers', title: 'Customers', icon: 'Users' },
  { path: 'app/(dashboard)/sales/orders', title: 'Orders', icon: 'Package' },
  { path: 'app/(dashboard)/sales/payments', title: 'Sales Payments', icon: 'CreditCard' },
  { path: 'app/(dashboard)/sales/followups', title: 'Follow-ups', icon: 'Bell' },
  { path: 'app/(dashboard)/sales/performance', title: 'My Performance', icon: 'TrendingUp' },

  // Inventory Management
  { path: 'app/(dashboard)/inventory/movements', title: 'Stock Movements', icon: 'RefreshCw' },
  { path: 'app/(dashboard)/inventory/low-stock', title: 'Low Stock Items', icon: 'AlertCircle' },
  { path: 'app/(dashboard)/inventory/warehouses', title: 'Warehouses', icon: 'Warehouse' },
  { path: 'app/(dashboard)/inventory/adjustments', title: 'Stock Adjustments', icon: 'Sliders' },

  // Delivery & Dispatch
  { path: 'app/(dashboard)/deliveries/assign', title: 'Assign Delivery', icon: 'UserPlus' },
  { path: 'app/(dashboard)/deliveries/drivers', title: 'Drivers', icon: 'Users' },
  { path: 'app/(dashboard)/deliveries/dispatch', title: 'Dispatch', icon: 'ClipboardList' },
  { path: 'app/(dashboard)/deliveries/track', title: 'Delivery Tracking', icon: 'MapPin' },

  // Delivery Agent
  { path: 'app/(dashboard)/delivery/active', title: 'Active Deliveries', icon: 'Activity' },
  { path: 'app/(dashboard)/delivery/history', title: 'Delivery History', icon: 'History' },
  { path: 'app/(dashboard)/delivery/route', title: 'Route Optimizer', icon: 'Route' },

  // Finance & Accounting
  { path: 'app/(dashboard)/accountant/verify', title: 'Verify Payments', icon: 'CheckCircle' },
  { path: 'app/(dashboard)/accountant/transactions', title: 'Transactions', icon: 'Receipt' },
  { path: 'app/(dashboard)/accountant/reports', title: 'Financial Reports', icon: 'FileText' },
  { path: 'app/(dashboard)/accountant/outstanding', title: 'Outstanding Payments', icon: 'DollarSign' },
  { path: 'app/(dashboard)/accountant/revenue', title: 'Revenue', icon: 'TrendingUp' },
  { path: 'app/(dashboard)/accountant/invoices', title: 'Invoices', icon: 'FileText' },

  // Human Resources
  { path: 'app/(dashboard)/hr/attendance', title: 'Attendance', icon: 'Clock' },
  { path: 'app/(dashboard)/hr/leaves', title: 'Leave Requests', icon: 'Calendar' },
  { path: 'app/(dashboard)/hr/performance', title: 'Performance Reviews', icon: 'TrendingUp' },
  { path: 'app/(dashboard)/hr/payroll', title: 'Payroll', icon: 'DollarSign' },

  // Manager
  { path: 'app/(dashboard)/manager/sales', title: 'Sales Overview', icon: 'BarChart' },
  { path: 'app/(dashboard)/manager/staff', title: 'Staff Activity', icon: 'Users' },
  { path: 'app/(dashboard)/manager/performance', title: 'Team Performance', icon: 'Award' },
  { path: 'app/(dashboard)/manager/reports', title: 'Reports', icon: 'FileText' },

  // Owner
  { path: 'app/(dashboard)/owner/companies', title: 'Companies', icon: 'Building2' },
  { path: 'app/(dashboard)/owner/analytics', title: 'Platform Analytics', icon: 'BarChart' },
  { path: 'app/(dashboard)/owner/settings', title: 'Platform Settings', icon: 'Settings' },
  { path: 'app/(dashboard)/owner/activity', title: 'Activity Logs', icon: 'Activity' },

  // AI
  { path: 'app/(dashboard)/ai/agents', title: 'AI Agents', icon: 'Bot' },
  { path: 'app/(dashboard)/ai/tasks', title: 'AI Tasks', icon: 'ClipboardList' },
  { path: 'app/(dashboard)/ai/activity', title: 'AI Activity', icon: 'Activity' },
  { path: 'app/(dashboard)/ai/contact', title: 'AI Contact', icon: 'MessageSquare' },
  { path: 'app/(dashboard)/ai/router', title: 'AI Router', icon: 'GitBranch' },
  { path: 'app/(dashboard)/ai/insights', title: 'AI Insights', icon: 'Brain' },
  { path: 'app/(dashboard)/ai/training', title: 'AI Training', icon: 'BookOpen' },

  // Settings
  { path: 'app/(dashboard)/settings/profile', title: 'Profile Settings', icon: 'User' },
  { path: 'app/(dashboard)/settings/company', title: 'Company Settings', icon: 'Building2' },
  { path: 'app/(dashboard)/settings/staff', title: 'Staff Settings', icon: 'Users' },
  { path: 'app/(dashboard)/settings/security', title: 'Security Settings', icon: 'Shield' },
  { path: 'app/(dashboard)/settings/notifications', title: 'Notification Settings', icon: 'Bell' },
  { path: 'app/(dashboard)/settings/integrations', title: 'Integrations', icon: 'Link2' },
  { path: 'app/(dashboard)/settings/billing', title: 'Billing & Subscription', icon: 'CreditCard' },
];

const template = (title, description, icon) => `import { ${icon} } from "lucide-react";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export default function ${title.replace(/\s/g, '')}Page() {
  return (
    <PagePlaceholder 
      title="${title}" 
      description="${description}"
      icon={<${icon} className="w-6 h-6" />}
    />
  );
}
`;

const descriptions = {
  'Customers': 'Manage your customer relationships.',
  'Orders': 'Manage all customer orders.',
  'Sales Payments': 'Track and manage customer payments.',
  'Follow-ups': 'Manage customer follow-ups and reminders.',
  'My Performance': 'Track your sales performance and targets.',
  'Stock Movements': 'Track all inventory movements and changes.',
  'Low Stock Items': 'Items that need reordering.',
  'Warehouses': 'Manage your warehouse locations.',
  'Stock Adjustments': 'Manage stock adjustments and corrections.',
  'Assign Delivery': 'Assign a delivery to a driver.',
  'Drivers': 'Manage your delivery drivers.',
  'Dispatch': 'Manage dispatch operations.',
  'Delivery Tracking': 'Track deliveries in real-time.',
  'Active Deliveries': 'View your active deliveries.',
  'Delivery History': 'View your delivery history.',
  'Route Optimizer': 'Optimize your delivery routes.',
  'Verify Payments': 'Verify pending payments.',
  'Transactions': 'View all financial transactions.',
  'Financial Reports': 'Generate and view financial reports.',
  'Outstanding Payments': 'View all outstanding customer payments.',
  'Revenue': 'Track your revenue and income.',
  'Invoices': 'Manage all invoices.',
  'Attendance': 'Track staff attendance.',
  'Leave Requests': 'Manage employee leave requests.',
  'Performance Reviews': 'Manage staff performance reviews.',
  'Payroll': 'Manage staff payroll.',
  'Sales Overview': 'View all sales and performance metrics.',
  'Staff Activity': 'Monitor staff performance and activity.',
  'Team Performance': 'View team performance metrics.',
  'Reports': 'Generate and view reports.',
  'Companies': 'Manage all registered companies.',
  'Platform Analytics': 'View platform-wide analytics and insights.',
  'Platform Settings': 'Manage your AI SalesOS platform settings.',
  'Activity Logs': 'View platform activity logs.',
  'AI Agents': 'Manage your AI workforce and agents.',
  'AI Tasks': 'View and manage AI tasks.',
  'AI Activity': 'View AI activity logs.',
  'AI Contact': 'Manage AI contact interactions.',
  'AI Router': 'Manage AI routing and workflows.',
  'AI Insights': 'View AI-powered insights and analytics.',
  'AI Training': 'Train your AI workforce.',
  'Profile Settings': 'Manage your personal information and preferences.',
  'Company Settings': 'Manage your company information and branding.',
  'Staff Settings': 'Manage staff roles and permissions.',
  'Security Settings': 'Manage your security preferences.',
  'Notification Settings': 'Manage how you receive notifications.',
  'Integrations': 'Connect external services and integrations.',
  'Billing & Subscription': 'Manage your subscription and billing.',
};

pages.forEach(page => {
  const dir = path.join(__dirname, page.path);
  const filePath = path.join(dir, 'page.tsx');
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const description = descriptions[page.title] || 'Manage your settings and preferences.';
  const content = template(page.title, description, page.icon);
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${filePath}`);
});

console.log('\n🎉 All pages created successfully!');