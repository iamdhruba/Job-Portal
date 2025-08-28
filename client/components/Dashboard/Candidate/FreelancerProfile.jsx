import React from "react";
import { motion } from "framer-motion";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
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
  Info
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = {
  name: "Dhruba C.",
  username: "@medhruba24",
  title: "Professional Graphic Designer and Video Editor",
  rate: 250,
  currency: "USD",
  location: "Nepal",
  localTime: "7:27 AM",
  joined: "June 23, 2025",
  about:
    "Hello, I am Dhruba Raj Chaudhary, a graphic designer and video editor. I create social media designs, festival programs, event posters, and cards. I have worked with local companies, business owners, and agencies, including consultancies, hospitals, and schools, to deliver engaging and effective visual content.",
  verifications: {
    email: true,
    phone: true,
    payment: true,
    facebook: true,
  },
  stats: {
    rating: 4.5,
    reviews: 12,
    completionRate: 75,
  },
  portfolio: [
    { image: "https://via.placeholder.com/300x180", title: "Social Media Post" },
    { image: "https://via.placeholder.com/300x180", title: "Event Poster" },
    { image: "https://via.placeholder.com/300x180", title: "Business Card" },
  ],
  applicationsOverTime: [
    { name: "Week 1", applications: 5 },
    { name: "Week 2", applications: 8 },
    { name: "Week 3", applications: 12 },
    { name: "Week 4", applications: 15 },
  ],
};

function Stat({ label, value, icon: Icon, progress }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-5 text-indigo-600" />}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {progress && (
        <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
          <div className="h-2 bg-indigo-600 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </motion.div>
  );
}

function Section({ title, emptyText, cta }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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

export default function FreelancerProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="h-28 w-full bg-[url('https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center relative"
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </motion.div>

      <div className="mx-auto max-w-6xl px-4 -mt-14">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative self-center lg:self-start"
              >
                <Avatar className="size-28 ring-4 ring-white shadow-md">
                  <AvatarImage src="https://i.pravatar.cc/150?img=12" alt={data.name} />
                  <AvatarFallback>DC</AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-green-100 text-green-800">
                  <ShieldCheck className="size-3" /> Verified
                </Badge>
              </motion.div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-semibold truncate">{data.name}</h1>
                      <Badge variant="secondary">{data.username}</Badge>
                    </div>
                    <p className="mt-1 text-gray-600">{data.title}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                      <Stat label="Rate" value={`$${data.rate} ${data.currency}/hr`} icon={CreditCard} />
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="size-4" />
                        <span>{data.location}</span>
                        <span>• Local time {data.localTime}</span>
                      </div>
                      <Stat label="Joined" value={data.joined} icon={CalendarDays} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="gap-2"><Camera className="size-4" /> Upload cover</Button>
                      <Button variant="outline" size="sm" className="gap-2"><Link2 className="size-4" /> View client</Button>
                      <Button size="sm" className="gap-2"><Edit className="size-4" /> Edit</Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Mail className="size-3" /> Email</span>
                      <span className="flex items-center gap-1"><Phone className="size-3" /> Phone</span>
                      <span className="flex items-center gap-1"><CreditCard className="size-3" /> Payment</span>
                      <span className="flex items-center gap-1"><Facebook className="size-3" /> Facebook</span>
                      <Badge variant="secondary">All verified</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-6">{data.about}</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Stat label="Rating" value={data.stats.rating} icon={Star} progress={data.stats.rating * 20} />
              <Stat label="Profile Completion" value={`${data.stats.completionRate}%`} icon={CheckCircle2} progress={data.stats.completionRate} />
              <Stat label="Portfolio Items" value={data.portfolio.length} icon={Plus} />
            </div>

            {/* Applications Chart */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Applications Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.applicationsOverTime} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="applications" stroke="#6366F1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Portfolio Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h2 className="text-lg font-semibold">Portfolio</h2>
                <Button variant="ghost" size="sm" className="gap-2"><Plus className="size-4" /> Manage portfolio</Button>
              </div>
              {data.portfolio.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-10 text-center text-sm text-gray-500">
                    No portfolio items yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.portfolio.map((item, idx) => (
                    <motion.div key={idx} whileHover={{ scale: 1.05 }}>
                      <Card>
                        <CardContent className="p-0">
                          <img src={item.image} alt={item.title} className="aspect-video w-full object-cover rounded-t-lg" />
                          <div className="p-3 text-sm">{item.title}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs for Sections */}
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
                  <Section title="Reviews" emptyText="No reviews yet" cta={<Button size="sm" variant="outline" className="gap-2"><CheckCircle2 className="size-4" /> Request review</Button>} />
                </TabsContent>
                <TabsContent value="experience" className="mt-4">
                  <Section title="Experience" emptyText="No experience added" cta={<Button size="sm" variant="outline" className="gap-2"><Plus className="size-4" /> Add experience</Button>} />
                </TabsContent>
                <TabsContent value="education" className="mt-4">
                  <Section title="Education" emptyText="No education added" cta={<Button size="sm" variant="outline" className="gap-2"><Plus className="size-4" /> Add education</Button>} />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-6">
          Built with <span className="font-medium">React</span> & <span className="font-medium">Tailwind + shadcn/ui</span>
        </div>
      </div>
    </div>
  );
}
