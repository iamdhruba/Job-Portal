import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import userService from "@/services/userService";

export default function SectionManager({
  title,
  listFn,
  addFn,
  updateFn,
  deleteFn,
  fields // array of { name, label, type?: 'text'|'textarea'|'date'|'number', placeholder? }
}) {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [adding, setAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [form, setForm] = React.useState({});

  const load = async () => {
    setLoading(true);
    try {
      const list = await listFn();
      setItems(list);
    } finally { setLoading(false); }
  };
  React.useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startAdd = () => { setAdding(true); setEditingId(null); setForm(Object.fromEntries(fields.map(f => [f.name, ""]))); };
  const startEdit = (item) => { setEditingId(item._id); setAdding(true); setForm(Object.fromEntries(fields.map(f => [f.name, item[f.name] || ""]))); };

  const save = async (e) => {
    e.preventDefault();
    if (editingId) {
      const updated = await updateFn(editingId, form);
      setItems((arr) => arr.map((it) => it._id === editingId ? updated : it));
    } else {
      const created = await addFn(form);
      setItems((arr) => [...arr, created]);
    }
    setAdding(false);
  };

  const remove = async (id) => {
    await deleteFn(id);
    setItems((arr) => arr.filter((it) => it._id !== id));
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-md font-semibold">{title}</h3>
        <Button variant="outline" size="sm" onClick={startAdd}>Add</Button>
      </div>

      {loading ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-sm text-muted-foreground">Loading...</CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 text-sm text-muted-foreground">No items.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <motion.div key={item._id} whileHover={{ scale: 1.01 }}>
              <Card>
                <CardContent className="p-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{item.title || item.school}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.company || item.issuer || item.field || item.degree}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(item)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(item._id)}>Delete</Button>
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
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Add'} {title}</h3>
            <form onSubmit={save} className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea name={f.name} rows={3} value={form[f.name] || ''} onChange={onChange} className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={f.placeholder || ''} />
                  ) : (
                    <input name={f.name} type={f.type || 'text'} value={form[f.name] || ''} onChange={onChange} className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={f.placeholder || ''} />
                  )}
                </div>
              ))}

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
