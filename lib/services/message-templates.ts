export const messageTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Message',
    subject: 'Welcome to AI SalesOS! 🎉',
    body: `Hello {name},

Welcome to AI SalesOS! We're excited to have you on board.

Here's what you can do next:
1. Complete your profile
2. Set up your company
3. Add your team members
4. Start selling!

If you need any help, don't hesitate to reach out.

Best regards,
The AI SalesOS Team`,
    type: 'both' as const,
  },
  {
    id: 'order_confirmation',
    name: 'Order Confirmation',
    subject: 'Order Confirmation - #{orderNumber}',
    body: `Dear {name},

Thank you for your order!

Order Details:
- Order Number: {orderNumber}
- Items: {items}
- Total: {total}
- Delivery Date: {deliveryDate}

Your order is being processed and will be delivered on the specified date.

Track your order: {trackingLink}

Thank you for choosing us!`,
    type: 'both' as const,
  },
  {
    id: 'payment_reminder',
    name: 'Payment Reminder',
    subject: 'Payment Reminder - {amount} due',
    body: `Dear {name},

This is a friendly reminder that your payment of {amount} is due.

Order: {orderNumber}
Due Date: {dueDate}

Please make payment at your earliest convenience.

Payment Options:
- Bank Transfer: {bankDetails}
- Card: {cardLink}

Thank you for your business!`,
    type: 'both' as const,
  },
  {
    id: 'product_update',
    name: 'Product Update',
    subject: 'New Products Available! 🚀',
    body: `Hi {name},

We're excited to announce our new product lineup!

Check out what's new:
{productList}

Visit our store to explore all products and place your order.

https://aisalesos.com/products

Happy shopping!`,
    type: 'email' as const,
  },
  {
    id: 'followup',
    name: 'Follow-up Message',
    subject: 'Checking in with you',
    body: `Hello {name},

I hope this message finds you well!

I wanted to check in and see if you have any questions about your recent purchase or if there's anything else we can help you with.

Looking forward to hearing from you!

Best regards,
{agentName}`,
    type: 'both' as const,
  },
];