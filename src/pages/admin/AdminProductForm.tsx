import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Form = {
  name: string;
  slug: string;
  category_id: string | null;
  description: string;
  price: string;
  discount_price: string;
  sizes: string;
  colors: string;
  material: string;
  fit_type: string;
  stock_status: "in_stock" | "out_of_stock";
  is_featured: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  images: string[];
};

const empty: Form = {
  name: "", slug: "", category_id: null, description: "",
  price: "", discount_price: "", sizes: "", colors: "",
  material: "", fit_type: "", stock_status: "in_stock",
  is_featured: false, is_new_arrival: false, is_active: true, images: [],
};

const AdminProductForm = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const nav = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["all-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("products").select("*").eq("id", id!).maybeSingle();
      if (error) return toast.error(error.message);
      if (!data) return;
      setForm({
        name: data.name, slug: data.slug, category_id: data.category_id,
        description: data.description ?? "",
        price: String(data.price), discount_price: data.discount_price != null ? String(data.discount_price) : "",
        sizes: (data.sizes ?? []).join(", "), colors: (data.colors ?? []).join(", "),
        material: data.material ?? "", fit_type: data.fit_type ?? "",
        stock_status: data.stock_status as "in_stock" | "out_of_stock",
        is_featured: data.is_featured, is_new_arrival: data.is_new_arrival, is_active: data.is_active,
        images: data.images ?? [],
      });
    })();
  }, [id, isNew]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600", upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      set("images", [...form.images, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return toast.error("Name and price required");
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      category_id: form.category_id,
      description: form.description || null,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      material: form.material || null,
      fit_type: form.fit_type || null,
      stock_status: form.stock_status,
      is_featured: form.is_featured,
      is_new_arrival: form.is_new_arrival,
      is_active: form.is_active,
      images: form.images,
    };
    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", id!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Product created" : "Product updated");
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
    nav("/admin/products");
  };

  return (
    <div className="max-w-4xl">
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="font-display text-3xl font-bold">{isNew ? "New product" : "Edit product"}</h1>

      <form onSubmit={submit} className="mt-8 space-y-6">
        {/* Images */}
        <Section title="Images">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-border bg-secondary group">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => set("images", form.images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 h-6 w-6 grid place-items-center bg-background/80 rounded opacity-0 group-hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="aspect-square border border-dashed border-border rounded-md grid place-items-center cursor-pointer hover:border-primary/40 transition-colors text-muted-foreground hover:text-primary">
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <div className="text-center text-xs">
                  <Upload className="h-5 w-5 mx-auto mb-1" />
                  Upload
                </div>
              )}
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
            </label>
          </div>
        </Section>

        <Section title="Basics">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name *"><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></Field>
            <Field label="Slug" hint="Auto-generated if blank"><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto" /></Field>
            <Field label="Category">
              <Select value={form.category_id ?? "none"} onValueChange={(v) => set("category_id", v === "none" ? null : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— None —</SelectItem>
                  {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Stock">
              <Select value={form.stock_status} onValueChange={(v: any) => set("stock_status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of stock</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Description"><Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>
        </Section>

        <Section title="Pricing">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Price (LKR) *"><Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required /></Field>
            <Field label="Discount price (LKR)"><Input type="number" min="0" step="0.01" value={form.discount_price} onChange={(e) => set("discount_price", e.target.value)} /></Field>
          </div>
        </Section>

        <Section title="Variants">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sizes" hint="Comma separated, e.g. S, M, L, XL"><Input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} /></Field>
            <Field label="Colors" hint="Comma separated"><Input value={form.colors} onChange={(e) => set("colors", e.target.value)} /></Field>
            <Field label="Material"><Input value={form.material} onChange={(e) => set("material", e.target.value)} /></Field>
            <Field label="Fit type"><Input value={form.fit_type} onChange={(e) => set("fit_type", e.target.value)} placeholder="Slim / Regular / Oversized" /></Field>
          </div>
        </Section>

        <Section title="Visibility">
          <div className="grid sm:grid-cols-3 gap-4">
            <Toggle label="Featured" checked={form.is_featured} onChange={(v) => set("is_featured", v)} />
            <Toggle label="New arrival" checked={form.is_new_arrival} onChange={(v) => set("is_new_arrival", v)} />
            <Toggle label="Active (visible on site)" checked={form.is_active} onChange={(v) => set("is_active", v)} />
          </div>
        </Section>

        <div className="flex gap-3 pt-2">
          <Button type="submit" variant="hero" size="lg" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isNew ? "Create product" : "Save changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => nav("/admin/products")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
    <h2 className="text-xs uppercase tracking-widest text-muted-foreground">{title}</h2>
    {children}
  </div>
);

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div>
    <Label className="text-xs">{label}</Label>
    <div className="mt-1.5">{children}</div>
    {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
  </div>
);

const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex items-center justify-between gap-3 border border-border rounded-md px-3 py-2.5 cursor-pointer">
    <span className="text-sm">{label}</span>
    <Switch checked={checked} onCheckedChange={onChange} />
  </label>
);

export default AdminProductForm;
