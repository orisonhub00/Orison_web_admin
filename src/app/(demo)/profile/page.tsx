"use client";

import { useEffect, useState } from "react";
import { User, Phone, Mail, BadgeCheck, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getProfile, updateProfile } from "@/lib/authClient";
import LoadingOverlay from "@/components/reuseble_components/LoadingOverlay";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    role_id: "",
    status: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      if (res.success) {
        setData({
          name: res.user.name || "",
          email: res.user.email || "",
          phone: res.user.phone || "",
          role_id: res.user.role_id || "",
          status: res.user.status || "",
        });
      } else {
        toast.error(res.message || "Failed to load profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await updateProfile({
        name: data.name,
        phone: data.phone,
      });

      if (res.success) {
        toast.success("Details updated successfully!");
        // Update local storage user if needed
        const user = localStorage.getItem("user");
        if (user) {
           const parsed = JSON.parse(user);
           parsed.name = data.name;
           parsed.phone = data.phone;
           localStorage.setItem("user", JSON.stringify(parsed));
        }
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingOverlay message="Loading Profile..." />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <User size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-sm text-gray-500">Manage your personal information</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
           <h2 className="text-lg font-semibold text-gray-800">General Information</h2>
           <p className="text-xs text-gray-500">Some fields like Email and Role are read-only for security.</p>
        </div>
        
        <div className="p-6 grid gap-6 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                placeholder="Enter your phone"
              />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address <span className="text-xs text-gray-400">(Read Only)</span></label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                disabled
                value={data.email}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

           {/* Role (Read Only) */}
           <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Assigned Role</label>
            <div className="relative">
              <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={18} />
              <input
                disabled
                value={data.role_id === "admin" ? "Administrator" : "Principal"}
                className="w-full pl-10 pr-4 py-2 bg-primary/5 border border-primary/20 rounded-lg text-primary font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-70"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
