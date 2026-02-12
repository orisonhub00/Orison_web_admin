"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPublicRoles, registerUser } from "@/lib/authClient";
import toast from "react-hot-toast";
import { Loader2, Upload, User, Mail, Phone, Lock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import emailjs from "@emailjs/browser";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4447";

// ⚠️ REPLACE THESE WITH YOUR EMAILJS CREDENTIALS
// OR BETTER, USE ENVIRONMENT VARIABLES
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";


export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role_id: "",
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await getPublicRoles();
      setRoles(data);
    } catch (error: any) {
      toast.error("Failed to load roles");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role_id) return toast.error("Please select a role");
    if (!profilePic) return toast.error("Profile picture is required");

    try {
      setLoading(true);

      const data = new FormData();
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("role_id", formData.role_id);
      data.append("profile_pic", profilePic);

      const res = await registerUser(data);
      
      // ✅ Send Notification to Admin via EmailJS
      try {
           const newUser = res.user; // Ensure backend returns user object
           const roleName = roles.find(r => r.id === formData.role_id)?.name || "Unknown Role";
           
           const templateParams = {
              name: `${formData.first_name} ${formData.last_name}`,
              email: formData.email,
              phone: formData.phone,
              role: roleName,
              time: new Date().toLocaleString(),
              approve_link: `${BASE_URL}/api/v1/registration/approve?token=${newUser.approval_token}`,
              reject_link: `${BASE_URL}/api/v1/registration/reject?token=${newUser.approval_token}`,
           };

           await emailjs.send(
              EMAILJS_SERVICE_ID,
              EMAILJS_TEMPLATE_ID,
              templateParams,
              EMAILJS_PUBLIC_KEY
           );
           console.log("✅ Admin notification sent via EmailJS");

      } catch (emailErr) {
          console.error("❌ EmailJS Error:", emailErr);
          // Don't block success UI, just log it
          toast.error("Profile submitted, but failed to notify admin.");
      }

      setSuccess(true);
      toast.success("Registration submitted successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your registration has been sent to the administrator for approval. 
            You will receive an email notification once your account is active.
          </p>
          <Link href="/" className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 md:p-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <ChevronLeft size={16} /> Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create Staff Account</h1>
            <p className="text-gray-500">Submit your details for admin approval.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Pic Upload */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 group hover:border-primary transition-colors">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Upload size={24} />
                    <span className="text-[10px] mt-1">Upload</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Upload Profile Picture *</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="john@school.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <select
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none bg-white"
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                >
                  <option value="">Select a role...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Submit Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
