import { prisma } from "./prisma";

// ============================================
// CREATE ORDER - Handles Products & Services
// ============================================

interface CreateOrderInput {
  customerId?: string;
  clientId?: string;
  sellerId: string;
  items: {
    type: "PRODUCT" | "SERVICE";
    productId?: string;
    serviceId?: string;
    quantity: number;
    price: number;
  }[];
  deliveryFee?: number;
  notes?: string;
}

export async function createUnifiedOrder(data: CreateOrderInput) {
  return await prisma.$transaction(async (tx) => {
    let subtotal = 0;
    const orderItems = [];

    // Process each item
    for (const item of data.items) {
      let itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      // If product, check inventory
      if (item.type === "PRODUCT" && item.productId) {
        const inventory = await tx.inventory.findUnique({
          where: { productId: item.productId }
        });

        if (!inventory || inventory.available < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        // Reserve stock
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            reserved: inventory.reserved + item.quantity,
            available: inventory.available - item.quantity
          }
        });

        // Get product name
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        orderItems.push({
          productId: item.productId,
          itemType: "PRODUCT",
          name: product?.name || "Product",
          quantity: item.quantity,
          price: item.price,
          total: itemTotal
        });
      }

      // If service, check availability
      if (item.type === "SERVICE" && item.serviceId) {
        const service = await tx.service.findUnique({
          where: { id: item.serviceId }
        });

        if (!service || service.status !== "ACTIVE") {
          throw new Error(`Service ${item.serviceId} is not available`);
        }

        orderItems.push({
          serviceId: item.serviceId,
          itemType: "SERVICE",
          name: service?.name || "Service",
          quantity: item.quantity,
          price: item.price,
          total: itemTotal
        });
      }
    }

    // Determine order type
    const orderType = data.items.some(i => i.type === "PRODUCT") && 
                      data.items.some(i => i.type === "SERVICE") 
                      ? "MIXED" 
                      : data.items[0]?.type === "SERVICE" ? "SERVICE" : "PRODUCT";

    // Create order
    const order = await tx.order.create({
      data: {
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        orderType,
        customerId: data.customerId,
        clientId: data.clientId,
        sellerId: data.sellerId,
        subtotal,
        total: subtotal + (data.deliveryFee || 0),
        deliveryFee: data.deliveryFee,
        notes: data.notes,
        items: {
          create: orderItems
        }
      },
      include: {
        items: true,
        customer: true,
        client: true
      }
    });

    // If service order, create booking
    if (orderType === "SERVICE" || orderType === "MIXED") {
      const serviceItems = orderItems.filter(i => i.itemType === "SERVICE");
      
      for (const item of serviceItems) {
        if (item.serviceId && data.clientId) {
          await tx.booking.create({
            data: {
              bookingNumber: `BK-${Date.now().toString().slice(-6)}`,
              orderId: order.id,
              serviceId: item.serviceId,
              clientId: data.clientId,
              date: new Date(),
              amount: item.total,
              status: "CONFIRMED",
              paymentStatus: "UNPAID"
            }
          });
        }
      }
    }

    return order;
  });
}

// ============================================
// GET UNIFIED ORDER
// ============================================

export async function getUnifiedOrder(orderId: string) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          service: true
        }
      },
      customer: true,
      client: true,
      seller: true,
      payment: true,
      delivery: true,
      booking: {
        include: {
          service: true,
          client: true
        }
      },
      timeline: true
    }
  });
}

// ============================================
// GET ALL ORDERS (Unified)
// ============================================

export async function getAllUnifiedOrders() {
  return await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
          service: true
        }
      },
      customer: true,
      client: true,
      payment: true,
      delivery: true
    },
    orderBy: { createdAt: "desc" }
  });
}

// ============================================
// CONVERT PRODUCT SALE TO ORDER
// ============================================

export async function convertSaleToOrder(saleId: string) {
  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: { customer: true, product: true, seller: true }
  });

  if (!sale) throw new Error("Sale not found");

  return await createUnifiedOrder({
    customerId: sale.customerId,
    sellerId: sale.sellerId,
    items: [{
      type: "PRODUCT",
      productId: sale.productId,
      quantity: sale.quantity,
      price: sale.price
    }],
    notes: `Converted from sale ${sale.saleNumber}`
  });
}

// ============================================
// CONVERT SERVICE BOOKING TO ORDER
// ============================================

export async function convertBookingToOrder(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, client: true }
  });

  if (!booking) throw new Error("Booking not found");

  return await createUnifiedOrder({
    clientId: booking.clientId,
    sellerId: "system",
    items: [{
      type: "SERVICE",
      serviceId: booking.serviceId,
      quantity: 1,
      price: booking.amount
    }],
    notes: `Converted from booking ${booking.bookingNumber}`
  });
}