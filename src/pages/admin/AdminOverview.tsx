import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, Tag, Sparkles, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RevealOnView } from "@/components/motion/RevealOnView";

const AdminOverview = () => {
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [products, categories, featured, oos] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("is_featured", true),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("stock_status", "out_of_stock"),
      ]);
      return {
        products: products.count ?? 0,
        categories: categories.count ?? 0,
        featured: featured.count ?? 0,
        oos: oos.count ?? 0,
      };
    },
  });

  const stats = [
    { label: "Products", value: data?.products ?? 0, icon: Package, color: "text-primary" },
    { label: "Categories", value: data?.categories ?? 0, icon: Tag, color: "text-emerald-400" },
    { label: "Featured", value: data?.featured ?? 0, icon: Sparkles, color: "text-amber-400" },
    { label: "Out of stock", value: data?.oos ?? 0, icon: AlertCircle, color: "text-destructive" },
  ];

  return (
    <RevealOnView className="max-w-6xl">
      <h1 className="font-display text-3xl font-bold">Overview</h1>
      <p className="text-muted-foreground mt-1">Quick snapshot of your store.</p>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5">
            <s.icon className={`h-5 w-5 ${s.color}`} />
            <p className="mt-4 text-3xl font-display font-bold">{s.value}</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-4">
        <ActionCard title="Add a new product" desc="Create a new drop with images, sizes & colors." to="/admin/products/new" cta="New product" />
        <ActionCard title="Manage categories" desc="Edit Mens Wear, Kids Wear, Perfumes, Belts." to="/admin/categories" cta="Open categories" />
      </div>
    </RevealOnView>
  );
};

const ActionCard = ({ title, desc, to, cta }: { title: string; desc: string; to: string; cta: string }) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <h3 className="font-display text-lg font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{desc}</p>
    <Button asChild variant="hero" size="sm" className="mt-4"><Link to={to}>{cta}</Link></Button>
  </div>
);

export default AdminOverview;
