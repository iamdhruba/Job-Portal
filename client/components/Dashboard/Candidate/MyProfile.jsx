import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  CheckCircle2,
  CalendarDays,
  Star,
  Plus,
  Link2,
  Camera,
  Edit,
  ShieldCheck,
  Mail,
  Phone,
  CreditCard,
  Facebook,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import userService from "@/services/userService";
import PortfolioManager from "./PortfolioManager";
import SectionManager from "./SectionManager";

/**
 * Enhanced interactive profile component with improved alignment and responsiveness.
 */
// profile data is derived from the authenticated user inside the component

function Stat({ label, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 cursor-pointer whitespace-nowrap"
    >
      {Icon ? <Icon className="size-4 shrink-0" /> : null}
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium">{value}</span>
    </motion.div>
  );
}

function Section({ title, emptyText, cta }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-dashed">
        <CardHeader className="py-4">
          <CardTitle className="text-base flex items-center justify-between">
            <span>{title}</span>
            {cta}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Star className="size-4" />
            <span>{emptyText}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  const profile = {
    name: user?.name || user?.fullName || user?.email?.split("@")[0] || "User",
    username: user?.username ? `@${user.username}` : user?.email ? `@${user.email.split("@")[0]}` : "@user",
    title: user?.title || user?.headline || "Your professional title",
    rate: user?.rate ?? 0,
    currency: user?.currency || "USD",
    location: user?.location || "Unknown",
    localTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    joined: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—",
    about:
      user?.about ||
      "Tell others about yourself. Share your skills, experience, and what you’re looking for.",
    verifications: {
      email: !!(user?.emailVerified ?? true),
      phone: !!user?.phone,
      payment: !!user?.paymentVerified,
      facebook: !!user?.facebookLinked,
    },
    stats: {
      rating: user?.rating ?? 0,
      reviews: user?.reviewsCount ?? 0,
      completionRate: user?.completionRate ?? 0,
    },
    portfolio: user?.portfolio || [],
    avatarUrl: user?.avatarUrl,
  };
  const data = profile;
  const avatarSrc = data.avatarUrl || "https://i.pravatar.cc/150?img=12";

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const updated = await userService.uploadAvatar(file);
      await updateUser({ avatarUrl: updated.avatarUrl });
    } catch (err) {
      console.error('Avatar upload failed', err);
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const updated = await userService.uploadCover(file);
      await updateUser({ coverUrl: updated.coverUrl });
    } catch (err) {
      console.error('Cover upload failed', err);
    }
  };

  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({
    name: data.name,
    title: data.title,
    location: data.location,
    rate: data.rate,
    currency: data.currency,
    about: data.about,
  });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(form);
      setEditing(false);
    } catch (err) {
      console.error('Profile update failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="h-28 w-full bg-[url('https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center"
      />

      <div className="mx-auto max-w-6xl container-px -mt-12 lg:-mt-16">
        <Card className="shadow-lg">
          <CardContent className="p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative -mt-14 lg:mt-0 self-center lg:self-start"
              >
                <Avatar className="size-36 md:size-40 ring-4 ring-white shadow-md">
                  <AvatarImage src={avatarSrc} alt={data.name} />
                  <AvatarFallback>{(data.name||"U").slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                                <Badge className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-green-100 text-green-800">
                  <ShieldCheck className="size-3" /> Verified
                </Badge>
              </motion.div>

              <div className="flex-1 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-semibold tracking-tight truncate">{data.name}</h1>
                      <Badge variant="secondary">{data.username}</Badge>
                    </div>
                    <p className="mt-1 text-muted-foreground">{data.title}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                      <Stat label="Rate" value={`${`$${data.rate} ${data.currency}/hr`}`} icon={CreditCard} />
                      <div className="flex flex-wrap items-center gap-2">
                        <MapPin className="size-4 shrink-0" />
                        <span className="text-muted-foreground">{data.location}</span>
                        <span>•</span>
                        <span className="text-muted-foreground">Local time {data.localTime}</span>
                      </div>
                      <Stat label="Joined" value={data.joined} icon={CalendarDays} />
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3">
                    <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end">
                      <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm cursor-pointer hover:bg-accent/20">
                        <Camera className="size-4" /> Upload cover
                        <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                      </label>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Link2 className="size-4" /> View client
                      </Button>
                      <Button size="sm" className="gap-2" onClick={() => setEditing(true)}>
                        <Edit className="size-4" /> Edit
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground justify-start md:justify-end">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3" /> Email
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" /> Phone
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="size-3" /> Payment
                      </span>
                      <span className="flex items-center gap-1">
                        <Facebook className="size-3" /> Facebook
                      </span>
                      <Badge variant="secondary" className="ml-2">All verified</Badge>
                    </div>
                  </div>
                </div>

                <div className="text-sm leading-6 text-slate-700">{data.about}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div whileHover={{ scale: 1.03 }}>
                <Card className="bg-slate-50 h-full">
                  <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                      <div className="text-2xl font-semibold flex items-center gap-2">
                        {data.stats.rating}
                        <Star className="size-5 fill-current" />
                      </div>
                    </div>
                    <Badge variant="outline" className="mt-2 self-start">{data.stats.reviews} reviews</Badge>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }}>
                <Card className="bg-slate-50 h-full">
                  <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="text-xs text-muted-foreground">Completion rate</div>
                    <div className="text-2xl font-semibold">{data.stats.completionRate}%</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }}>
                <Card className="bg-slate-50 h-full">
                  <CardContent className="p-4 flex flex-col justify-between h-full">
                    <div className="text-xs text-muted-foreground">Portfolio items</div>
                    <div className="text-2xl font-semibold">{data.portfolio.length}</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Portfolio */}
            <PortfolioManager />

            {/* Edit dialog */}
            {editing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input name="name" value={form.name} onChange={onChange} className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input name="title" value={form.title} onChange={onChange} className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input name="location" value={form.location} onChange={onChange} className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Currency</label>
                        <select name="currency" value={form.currency} onChange={onChange} className="w-full border border-input rounded-md px-3 py-2 focus:outline-none">
                          {['USD','EUR','GBP','INR','NPR'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rate</label>
                      <input name="rate" type="number" min={0} value={form.rate} onChange={onChange} className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">About</label>
                      <textarea name="about" rows={4} value={form.about} onChange={onChange} className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Tabs for sections */}
            <div className="mt-8">
              <Tabs defaultValue="reviews">
                <TabsList className="flex flex-wrap w-full overflow-x-auto gap-2">
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                  <TabsTrigger value="certifications">Certifications</TabsTrigger>
                  <TabsTrigger value="articles">Articles</TabsTrigger>
                </TabsList>

                <TabsContent value="reviews" className="mt-4">
                  <Section
                    title="Reviews"
                    emptyText="No reviews to see here yet."
                    cta={
                      <Button size="sm" variant="outline" className="gap-2">
                        <CheckCircle2 className="size-4" /> Request review
                      </Button>
                    }
                  />
                </TabsContent>

                <TabsContent value="experience" className="mt-4">
                  <SectionManager
                    title="Experience"
                    listFn={userService.listExperiences}
                    addFn={userService.addExperience}
                    updateFn={userService.updateExperience}
                    deleteFn={userService.deleteExperience}
                    fields={[
                      { name: 'title', label: 'Title' },
                      { name: 'company', label: 'Company' },
                      { name: 'location', label: 'Location' },
                      { name: 'startDate', label: 'Start Date', type: 'date' },
                      { name: 'endDate', label: 'End Date', type: 'date' },
                      { name: 'description', label: 'Description', type: 'textarea' },
                    ]}
                  />
                </TabsContent>

                <TabsContent value="education" className="mt-4">
                  <SectionManager
                    title="Education"
                    listFn={userService.listEducation}
                    addFn={userService.addEducation}
                    updateFn={userService.updateEducation}
                    deleteFn={userService.deleteEducation}
                    fields={[
                      { name: 'school', label: 'School' },
                      { name: 'degree', label: 'Degree' },
                      { name: 'field', label: 'Field of Study' },
                      { name: 'startYear', label: 'Start Year', type: 'number' },
                      { name: 'endYear', label: 'End Year', type: 'number' },
                      { name: 'grade', label: 'Grade' },
                      { name: 'description', label: 'Description', type: 'textarea' },
                    ]}
                  />
                </TabsContent>

                <TabsContent value="qualifications" className="mt-4">
                  <SectionManager
                    title="Qualifications"
                    listFn={userService.listQualifications}
                    addFn={userService.addQualification}
                    updateFn={userService.updateQualification}
                    deleteFn={userService.deleteQualification}
                    fields={[
                      { name: 'title', label: 'Title' },
                      { name: 'issuer', label: 'Issuer' },
                      { name: 'date', label: 'Date', type: 'date' },
                      { name: 'description', label: 'Description', type: 'textarea' },
                    ]}
                  />
                </TabsContent>

                <TabsContent value="certifications" className="mt-4">
                  <SectionManager
                    title="Certifications"
                    listFn={userService.listCertifications}
                    addFn={userService.addCertification}
                    updateFn={userService.updateCertification}
                    deleteFn={userService.deleteCertification}
                    fields={[
                      { name: 'title', label: 'Title' },
                      { name: 'issuer', label: 'Issuer' },
                      { name: 'date', label: 'Date', type: 'date' },
                      { name: 'credentialId', label: 'Credential ID' },
                      { name: 'credentialUrl', label: 'Credential URL' },
                    ]}
                  />
                </TabsContent>

                <TabsContent value="articles" className="mt-4">
                  <Section
                    title="Articles"
                    emptyText="No articles have been added."
                    cta={
                        <Button size="sm" variant="outline" className="gap-2">
                          <Plus className="size-4" /> Add article
                        </Button>
                    }
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Footer mini */}
        <div className="text-center text-xs text-muted-foreground mt-6">
          Built with <span className="font-medium">React</span>, styled by <span className="font-medium">Tailwind + shadcn/ui</span>.
        </div>
      </div>
    </div>
  );
}
