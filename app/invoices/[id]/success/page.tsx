import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-lg min-h-screen flex items-center justify-center">
      <Card className="p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your payment. Your invoice has been marked as paid.
        </p>
        <Link href="/invoices">
          <Button>View All Invoices</Button>
        </Link>
      </Card>
    </div>
  );
}