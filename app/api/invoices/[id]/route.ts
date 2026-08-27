import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Fetch single invoice
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(`
        *,
        items:invoice_items(*)
      `)
      .eq("id", params.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

// PATCH - Update invoice
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      status,
      tax_rate,
      discount_type,
      discount_value,
      notes,
      terms,
      currency,
      items
    } = body;

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

    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .update({
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        issue_date,
        due_date,
        status,
        tax_rate,
        discount_type,
        discount_value,
        notes,
        terms,
        currency,
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", params.id);

    if (itemsWithTotal.length > 0) {
      const itemsWithInvoiceId = itemsWithTotal.map((item: any) => ({
        ...item,
        invoice_id: params.id,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsWithInvoiceId);

      if (itemsError) throw itemsError;
    }

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

// DELETE - Delete invoice
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", params.id);

    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}