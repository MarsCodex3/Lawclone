import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Calculate total from items
    const total = data.items.reduce((sum: number, item: any) => {
      const amount = parseFloat(item.amount) || 0;
      return sum + amount;
    }, 0);

    // First create the user
    const user = await prisma.user.create({
      data: {
        name: data.userDetails.name,
        email: data.userDetails.email,
        company: data.userDetails.company || null,
        address: data.userDetails.address,
        phone: data.userDetails.phone || null,
        logo: data.userDetails.logo || null,
      },
    });

    // Then create the client
    const client = await prisma.client.create({
      data: {
        name: data.billTo.name,
        email: data.billTo.email,
        address: data.billTo.address,
      },
    });

    // Generate invoice number
    const invoiceCount = await prisma.invoice.count();
    const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(5, '0')}`;

    // Create the invoice with references to user and client
    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        userId: user.id,
        clientId: client.id,
        items: {
          create: data.items.map((item: any) => ({
            description: item.description,
            quantity: 1,
            price: parseFloat(item.amount) || 0,
            total: parseFloat(item.amount) || 0,
          })),
        },
        subtotal: total,
        tax: 0,
        total: total,
        dueDate: new Date(data.invoiceDetails.dueDate),
        status: "pending",
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      invoice: { 
        id: invoice.id,
        number: invoice.number 
      } 
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}