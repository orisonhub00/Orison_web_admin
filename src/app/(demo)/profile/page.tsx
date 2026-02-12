"use client";

import { useEffect, useState } from "react";
import { User, Phone, Mail, BadgeCheck, Save, Loader2, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { getProfile, updateProfile } from "@/lib/authClient";
import LoadingOverlay from "@/components/reuseble_components/LoadingOverlay";
import { BASE_URL } from "@/lib/authClient";
import { getAdminToken } from "@/lib/getToken";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    role_id: "",
    role_name: "",
    status: "",
    profile_pic: "",
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
          role_name: res.user.role?.name || "No Role",
          status: res.user.status || "",
          profile_pic: res.user.profile_pic || "",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optimistic Preview
    const objectUrl = URL.createObjectURL(file);
    setData((prev) => ({ ...prev, profile_pic: objectUrl }));
    setSelectedFile(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      if (selectedFile) {
        formData.append("profile_pic", selectedFile);
      }

      // We need to use fetch directly or update the updateProfile helper to support FormData
      // Since updateProfile in authClient might send JSON, let's use direct fetch here for FormData support
      const res = await fetch(`${BASE_URL}/api/v1/profile/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: formData,
      });

      const response = await res.json();

      if (response.success) {
        toast.success("Details updated successfully!");
        // Update local storage user if needed
        const user = localStorage.getItem("user");
        if (user) {
           const parsed = JSON.parse(user);
           parsed.name = data.name;
           parsed.phone = data.phone;
           if (response.user.profile_pic) {
             parsed.profile_pic = response.user.profile_pic;
           }
           localStorage.setItem("user", JSON.stringify(parsed));
           
           // Force reload to update header image if necessary, or use context
           window.dispatchEvent(new Event("storage")); 
        }
      } else {
        toast.error(response.message || "Update failed");
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
          {/* Profile Image & Name Section in Grid */}
           <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center mb-6">
              <div className="relative group h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-sm mb-4">
                {data.profile_pic ? (
                  <img
                    src={data.profile_pic}
                    alt={data.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                    <User size={48} />
                  </div>
                )}
                
                {/* Overlay for upload */}
                 <label className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                   <Camera className="text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                 </label>
              </div>
              <p className="text-sm font-medium text-gray-500">Click image to change</p>
           </div>

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
                value={data.role_name}
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
