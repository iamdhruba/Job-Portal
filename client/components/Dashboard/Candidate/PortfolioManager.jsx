import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import userService from "@/services/userService";

export default function PortfolioManager() {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [adding, setAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [form, setForm] = React.useState({ title: "", description: "", link: "", imageUrl: "" });

  const load = async () => {
    setLoading(true);
    try {
      const list = await userService.listPortfolio();
      setItems(list);
    } finally { setLoading(false); }
  };
  React.useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { imageUrl } = await userService.uploadPortfolioImage(file);
    setForm((f) => ({ ...f, imageUrl }));
  };

  const startAdd = () => { setAdding(true); setEditingId(null); setForm({ title: "", description: "", link: "", imageUrl: "" }); };
  const startEdit = (item) => { setEditingId(item._id); setAdding(true); setForm({ title: item.title, description: item.description || "", link: item.link || "", imageUrl: item.imageUrl || "" }); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    if (editingId) {
      const updated = await userService.updatePortfolio(editingId, form);
      setItems((arr) => arr.map((it) => it._id === editingId ? updated : it));
    } else {
      const created = await userService.addPortfolio(form);
      setItems((arr) => [...arr, created]);
    }
    setAdding(false);
  };

  const remove = async (id) => {
    await userService.deletePortfolio(id);
    setItems((arr) => arr.filter((it) => it._id !== id));
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-lg font-semibold">Portfolio</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2" onClick={startAdd}>
            <Plus className="size-4" /> Add item
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Loading portfolio...
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            No portfolio items have been added yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <motion.div key={item._id} whileHover={{ scale: 1.02 }}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="aspect-video w-full object-cover" />
                  ) : (
                    <div className="aspect-video w-full bg-muted" />
                  )}
                  <div className="p-3 text-sm flex items-center justify-between">
                    <span className="font-medium truncate" title={item.title}>{item.title}</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(item)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(item._id)}>Delete</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {adding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Portfolio Item</h3>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input name="title" value={form.title} onChange={onChange} className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" rows={3} value={form.description} onChange={onChange} className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link</label>
                <input name="link" value={form.link} onChange={onChange} className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="flex items-center gap-3">
                  <input name="imageUrl" value={form.imageUrl} onChange={onChange} className="flex-1 border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Image URL or upload" />
                  <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm cursor-pointer hover:bg-accent/20">
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
