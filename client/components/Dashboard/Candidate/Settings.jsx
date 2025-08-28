import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin, DollarSign, Edit, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import userService from "@/services/userService";

export default function Settings() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = React.useState({
    name: user?.name || "",
    title: user?.title || "",
    location: user?.location || "",
    rate: user?.rate ?? 0,
    currency: user?.currency || "USD",
  });
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  const avatarUrl = user?.avatarUrl
    ? (user.avatarUrl.startsWith("http") ? user.avatarUrl : `${apiBase}${user.avatarUrl}`)
    : undefined;

  const fileRef = React.useRef(null);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await updateUser(form);
      setMessage("Profile settings saved");
    } catch (err) {
      setError(err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const onPickFile = () => fileRef.current?.click();
  const onAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    setError("");
    try {
      const res = await userService.uploadAvatar(file);
      // res.avatarUrl expected like /uploads/...
      await updateUser({ avatarUrl: res.avatarUrl });
      setMessage("Avatar updated");
    } catch (err) {
      setError(err?.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const initials = (user?.name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-white shadow">
                <AvatarImage src={avatarUrl} alt={user?.name || user?.email} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" className="gap-2" onClick={onPickFile} disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit className="h-4 w-4" />}
                  {uploading ? "Uploading..." : "Change Avatar"}
                </Button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFile} />
              </div>
            </div>

            {/* Name & Title */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Professional Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="What do you do?"
                />
              </div>
            </div>

            {/* Location & Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1"><MapPin className="h-4 w-4" /> Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1"><DollarSign className="h-4 w-4" /> Hourly Rate</label>
                <div className="flex gap-2">
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={onChange}
                    className="border border-input rounded-md px-3 py-2 focus:outline-none"
                  >
                    {['USD', 'EUR', 'GBP', 'NPR', 'INR'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    name="rate"
                    type="number"
                    value={form.rate}
                    onChange={onChange}
                    className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="0"
                    min={0}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 min-h-[1.25rem]">
              {message && <div className="text-xs text-green-700">{message}</div>}
              {error && <div className="text-xs text-red-700">{error}</div>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
