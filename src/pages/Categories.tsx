import { Link, useParams } from "react-router-dom";
import { useCategories, useProducts } from "@/hooks/useShop";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryBannerMedia } from "@/components/shop/CategoryBannerMedia";
import { ArrowRight } from "lucide-react";
import { RevealOnView } from "@/components/motion/RevealOnView";

const Categories = () => {
  const { slug } = useParams();
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts({ categorySlug: slug });

  if (slug) {
    const cat = categories.find((c) => c.slug === slug);
    return (
      <>
        {cat && (
          <section className="relative w-full overflow-hidden bg-black border-b border-border/40">
            <div className="group relative w-full h-[38vh] min-h-[260px] sm:h-[42vh] sm:min-h-[300px] md:min-h-[340px] lg:h-[min(48vh,560px)] lg:min-h-[380px] max-h-[640px]">
              <CategoryBannerMedia category={cat} />
              <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
                <div className="container-edge w-full pb-10 pt-28 md:pb-14 md:pt-36">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">Category</p>
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-md mt-2">
                    {cat.name}
                  </h1>
                </div>
              </div>
            </div>
          </section>
        )}

        <RevealOnView className="container-edge py-10 md:py-12">
          {!cat && (
            <>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Category</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold mt-2">{slug}</h1>
            </>
          )}
          <p className="text-muted-foreground mt-2">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>

          <div className="mt-10">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-xl bg-card animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="text-muted-foreground">Nothing here yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 min-[400px]:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </RevealOnView>
      </>
    );
  }

  return (
    <RevealOnView className="container-edge py-12">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">Browse</p>
      <h1 className="font-display text-4xl md:text-6xl font-bold mt-2">Categories</h1>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/categories/${c.slug}`}
            className="group relative aspect-[16/9] rounded-xl overflow-hidden border border-border bg-black transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.2)]"
          >
            <CategoryBannerMedia category={c} />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <p className="text-xs uppercase tracking-widest text-white/70">Category</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white drop-shadow-sm mt-1">{c.name}</h2>
              <span className="mt-2 text-sm text-primary inline-flex items-center gap-2">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </RevealOnView>
  );
};

export default Categories;
