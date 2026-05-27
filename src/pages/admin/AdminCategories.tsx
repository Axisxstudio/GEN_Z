import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { RevealOnView } from "@/components/motion/RevealOnView";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminCategories = () => {
  const qc = useQueryClient();
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["all-categories-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["all-categories-admin"] });
    qc.invalidateQueries({ queryKey: ["categories"] });
    qc.invalidateQueries({ queryKey: ["all-categories"] });
  };

  const create = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const { error } = await supabase.from("categories").insert({ name: newName.trim(), slug: slugify(newName) });
    setCreating(false);
    if (error) return toast.error(error.message);
    setNewName("");
    toast.success("Category created");
    refresh();
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    const { error } = await supabase.from("categories").update({ name: editName.trim(), slug: slugify(editName) }).eq("id", id);
    if (error) return toast.error(error.message);
    setEditingId(null);
    toast.success("Updated");
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  };

  return (
    <RevealOnView className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold">Categories</h1>

      <div className="mt-6 flex gap-2">
        <Input placeholder="New category name…" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-card" />
        <Button onClick={create} variant="hero" disabled={creating}>
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
        </Button>
      </div>

      <div className="mt-8 border border-border rounded-xl overflow-hidden bg-card">
        {isLoading ? (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">Loading…</div>
        ) : (
          <ul className="divide-y divide-border">
            {categories.map((c: any) => (
              <li key={c.id} className="px-4 py-3 flex items-center gap-3">
                {editingId === c.id ? (
                  <>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1" />
                    <Button size="icon" variant="ghost" onClick={() => saveEdit(c.id)}><Check className="h-4 w-4 text-emerald-400" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">/{c.slug}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => { setEditingId(c.id); setEditName(c.name); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete category?</AlertDialogTitle>
                          <AlertDialogDescription>Products in "{c.name}" will not be deleted but will lose their category.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(c.id)} className="bg-destructive">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </RevealOnView>
  );
};

export default AdminCategories;
