"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from "lucide-react";

interface InvoiceData {
  id: string;
  number: string;
  userDetails: {
    name: string;
    email: string;
    company?: string;
    address: string;
    phone?: string;
    logo?: string;
  };
  billTo: {
    name: string;
    email: string;
    address: string;
  };
  invoiceDetails: {
    issueDate: string;
    dueDate: string;
    frequency: string;
  };
  items: {
    activityType: string;
    date: string;
    description: string;
    duration?: string;
    rate?: string;
    amount: string;
  }[];
  total: number;
  status: string;
}

export default function InvoicePage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch invoice");
      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load invoice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!invoice) return;
    setPaying(true);
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: invoice.total,
          invoiceId: invoice.id,
          description: `Payment for invoice #${invoice.number}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to create payment session");
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">Invoice not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <Card className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Invoice #{invoice.number}</h1>
            <p className="text-muted-foreground">
              Status: <span className="capitalize">{invoice.status}</span>
            </p>
          </div>
          {invoice.userDetails.logo && (
            <img
              src={invoice.userDetails.logo}
              alt="Company Logo"
              className="h-16 w-auto"
            />
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">From</h2>
            <div className="space-y-1">
              <p className="font-medium">{invoice.userDetails.name}</p>
              {invoice.userDetails.company && (
                <p>{invoice.userDetails.company}</p>
              )}
              <p className="whitespace-pre-line">{invoice.userDetails.address}</p>
              {invoice.userDetails.phone && (
                <p>{invoice.userDetails.phone}</p>
              )}
              <p>{invoice.userDetails.email}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Bill To</h2>
            <div className="space-y-1">
              <p className="font-medium">{invoice.billTo.name}</p>
              <p className="whitespace-pre-line">{invoice.billTo.address}</p>
              <p>{invoice.billTo.email}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div>
            <p className="text-sm text-muted-foreground">Issue Date</p>
            <p className="font-medium">
              {format(new Date(invoice.invoiceDetails.issueDate), "PPP")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="font-medium">
              {format(new Date(invoice.invoiceDetails.dueDate), "PPP")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Frequency</p>
            <p className="font-medium capitalize">
              {invoice.invoiceDetails.frequency}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Items</h2>
          <div className="space-y-4">
            {invoice.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="text-sm text-muted-foreground">Activity Type</p>
                  <p className="font-medium">{item.activityType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(item.date), "PPP")}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{item.description}</p>
                </div>
                {item.duration && (
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{item.duration}</p>
                  </div>
                )}
                {item.rate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Rate</p>
                    <p className="font-medium">{item.rate}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">{item.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold">
            Total: {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(invoice.total)}
          </div>
          {invoice.status !== "paid" && (
            <Button
              className="mt-4"
              size="lg"
              onClick={handlePayment}
              disabled={paying}
            >
              {paying ? "Processing..." : "Pay Now"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}