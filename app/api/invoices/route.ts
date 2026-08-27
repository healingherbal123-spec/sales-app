import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Helper function to generate invoice number
function generateInvoiceNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `INV-${year}-${month}-${random}`;
}

// GET - Fetch all invoices
export async function GET() {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", session.user.id)
      .single();

    if (!profile?.company_id) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        items:invoice_items(*)
      `)
      .eq("company_id", profile.company_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// POST - Create new invoice
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      issue_date,
      due_date,
      items,
      tax_rate,
      discount_type,
      discount_value,
      notes,
      terms,
      currency = "₦"
    } = body;

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", session.user.id)
      .single();

    if (!profile?.company_id) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    let subtotal = 0;
    const itemsWithTotal = items.map((item: any) => {
      const total = item.quantity * item.unit_price;
      subtotal += total;
      return { ...item, total };
    });

    const taxAmount = (subtotal * (tax_rate || 0)) / 100;
    let discountAmount = 0;
    if (discount_type === "percentage") {
      discountAmount = (subtotal * (discount_value || 0)) / 100;
    } else if (discount_type === "fixed") {
      discountAmount = discount_value || 0;
    }
    const total = subtotal + taxAmount - discountAmount;

    const invoiceNumber = generateInvoiceNumber();

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert([{
        invoice_number: invoiceNumber,
        company_id: profile.company_id,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        issue_date: issue_date || new Date().toISOString().split('T')[0],
        due_date,
        status: "draft",
        subtotal,
        tax_rate: tax_rate || 0,
        tax_amount: taxAmount,
        discount_type: discount_type || "percentage",
        discount_value: discount_value || 0,
        discount_amount: discountAmount,
        total,
        currency,
        notes,
        terms,
        created_by: session.user.id,
      }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    if (itemsWithTotal.length > 0) {
      const itemsWithInvoiceId = itemsWithTotal.map((item: any) => ({
        ...item,
        invoice_id: invoice.id,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsWithInvoiceId);

      if (itemsError) throw itemsError;
    }

    return NextResponse.json({ 
      success: true, 
      data: invoice 
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}