import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserEntitlements } from "@/server/auth/getUserEntitlements";
import ConsoleLayout from "@/components/console/ConsoleLayout";
import ProductEditor from "./product-editor";

export default async function ConsoleProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sarathi/login?next=/sarathi/console/products");
  }

  const entitlements = await getUserEntitlements(user.id);

  if (entitlements.role !== "admin") {
    redirect("/sarathi");
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("display_order", { ascending: true });

 return (
  <ConsoleLayout
    title="Products"
    description="Manage Sārathi products, pricing, credits, durations and availability."
  >
    <div className="space-y-4">
      {(products ?? []).map((product: any) => (
        <ProductEditor key={product.id} product={product} />
      ))}

      {!products?.length ? (
        <div className="rounded-2xl border border-[color:var(--border)] bg-white/80 p-6 text-center text-sm text-slate-500">
          No products found.
        </div>
      ) : null}
    </div>
  </ConsoleLayout>
);
}