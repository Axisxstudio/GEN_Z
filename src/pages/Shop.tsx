import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCategories, useProducts } from "@/hooks/useShop";
import { RevealOnView } from "@/components/motion/RevealOnView";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const Shop = () => {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [size, setSize] = useState<string | undefined>();
  const [price, setPrice] = useState<[number, number]>([0, 30000]);
  const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">("newest");
  const [showFilters, setShowFilters] = useState(false);

  const categorySlug = params.get("category") ?? undefined;

  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts({
    categorySlug,
    search: search || undefined,
    minPrice: price[0],
    maxPrice: price[1],
    size,
    sort,
  });

  const setCat = (slug?: string) => {
    const next = new URLSearchParams(params);
    if (slug) next.set("category", slug); else next.delete("category");
    setParams(next, { replace: true });
  };

  const cats = useMemo(() => [{ id: "all", name: "All", slug: undefined as string | undefined }, ...categories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))], [categories]);

  return (
    <RevealOnView className="container-edge py-12">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Shop</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold mt-2">All Products</h1>
        <p className="text-muted-foreground mt-2">Curated drops for men & boys.</p>
      </header>

      {/* Top bar */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className="pl-9 bg-card border-border" />
        </div>
        <Select value={sort} onValueChange={(v: any) => setSort(v)}>
          <SelectTrigger className="w-[180px] bg-card border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low → High</SelectItem>
            <SelectItem value="price_desc">Price: High → Low</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={() => setShowFilters((v) => !v)} className="md:hidden">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Filters */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block space-y-8`}>
          <FilterBlock title="Category">
            <div className="space-y-1">
              {cats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.slug)}
                  className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${categorySlug === c.slug || (!categorySlug && !c.slug) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
                >{c.name}</button>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock title="Price (LKR)">
            <Slider min={0} max={30000} step={500} value={price} onValueChange={(v) => setPrice(v as [number, number])} />
            <p className="text-xs text-muted-foreground mt-3">{price[0].toLocaleString()} — {price[1].toLocaleString()}</p>
          </FilterBlock>

          <FilterBlock title="Size">
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(size === s ? undefined : s)}
                  className={`h-9 min-w-9 px-3 text-xs border rounded-md transition-all ${size === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground/50"}`}
                >{s}</button>
              ))}
            </div>
          </FilterBlock>
        </aside>

        {/* Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-xl bg-card animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border rounded-xl">
              <p className="text-muted-foreground">No products match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </RevealOnView>
  );
};

const FilterBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{title}</h3>
    {children}
  </div>
);

export default Shop;
