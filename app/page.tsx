import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Invoice Creator</h1>
        <Link href="/invoices/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-2">Recent Invoices</h2>
          <p className="text-muted-foreground">View and manage your recent invoices</p>
          <Link href="/invoices">
            <Button className="mt-4" variant="outline">View All</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-2">Clients</h2>
          <p className="text-muted-foreground">Manage your client information</p>
          <Link href="/clients">
            <Button className="mt-4" variant="outline">Manage Clients</Button>
          </Link>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-2">Settings</h2>
          <p className="text-muted-foreground">Configure your account and preferences</p>
          <Link href="/settings">
            <Button className="mt-4" variant="outline">Open Settings</Button>
          </Link>
        </Card>
      </div>
    </main>
  );
}