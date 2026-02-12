"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, Camera, User, Loader2 } from "lucide-react";
import { BASE_URL } from "@/lib/authClient";
import { getAdminToken } from "@/lib/getToken";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";


/* ================= TYPES ================= */

type StudentForm = {
  name: string;
  admission_no: string;
  class_id: string;
  section_id: string | null;
  academic_year_id: string;
  status: string;
  dob: string;
  gender: string;
  aadhar_no: string;
  father_name: string;
  father_mobile: string;
  mother_name: string;
  mother_mobile: string;
  guardian_name: string;
  emergency_contact: string;
  profile_pic?: string;
  // Associations
  academic_year?: { id: string; year_name: string };
  class?: { id: string; class_name: string };
  section?: { id: string; section_name: string };
};

export default function EditStudent({
  id,
  onBack,
}: {
  id: string;
  onBack?: () => void;
}) {
  const [form, setForm] = useState<StudentForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /* ================= IMAGE UPLOAD (Deferred) ================= */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optimistic Preview
    const objectUrl = URL.createObjectURL(file);
    setForm((prev) => (prev ? { ...prev, profile_pic: objectUrl } : null));
    setSelectedFile(file);
  };

  useEffect(() => {
    const fetchStudent = async () => {
      const res = await fetch(`${BASE_URL}/api/v1/students/${id}`, {
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      });
      const data = await res.json();
      if (data.success) setForm(data.student);
      
      setLoading(false);
      
    };
    fetchStudent();
    toast.success("Student data loaded");
  }, [id]);

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    if (!form) return;

    try {
      setUploading(true);
      const formData = new FormData();

      // Append all text fields
      Object.entries(form).forEach(([key, value]) => {
        // Skip null/undefined/objects (like associations)
        if (value !== null && value !== undefined && typeof value !== 'object') {
           formData.append(key, value as string);
        }
      });
      // Handle associations if needed (usually just ID references are enough for update)
       if(form.academic_year_id) formData.append("academic_year_id", form.academic_year_id);
       if(form.class_id) formData.append("class_id", form.class_id);
       if(form.section_id) formData.append("section_id", form.section_id);

      // Append File
      if (selectedFile) {
        formData.append("profile_pic", selectedFile);
      }

      const res = await fetch(`${BASE_URL}/api/v1/students/${id}`, {
        method: "PUT",
        headers: {
          // "Content-Type": "multipart/form-data", // Browser sets this automatically
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Student updated successfully");
        onBack?.();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setUploading(false);
    }
  };

  if (loading || !form) {
    return <div className="p-6">Loading...</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className="text-[15px] font-semibold">Edit Student</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Image */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border flex flex-col items-center">
             <div className="relative group h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-sm mb-4">
                {form.profile_pic ? (
                  <img
                    src={form.profile_pic}
                    alt={form.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-orange-50 text-orange-400">
                    <User size={48} />
                  </div>
                )}
                
                {/* Overlay for upload */}
                 <label className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                   {uploading ? <Loader2 className="animate-spin text-white" /> : <Camera className="text-white" />}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploading}
                    />
                 </label>
              </div>
              <p className="text-sm font-medium text-gray-900">{form.name}</p>
              <p className="text-xs text-gray-500">{form.admission_no}</p>
          </div>
        </div>

        {/* Right Col: Form */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Input label="Student Name" value={form.name}
              onChange={(v) => setForm({ ...form, name: v })} />

            <Input label="Admission No" value={form.admission_no} disabled />

            {/* Display Names if available, else fallback to IDs. 
                Note: The API returns objects for academic_year, class, section now. 
                But form state is StudentForm which has _id strings. 
                We need to handle the display vs value. 
                Actually, the API returns the student object which HAS the associations.
                But the type StudentForm doesn't have them. 
                I need to update the type first. */}
            
             <Input label="Academic Year" value={form.academic_year?.year_name || form.academic_year_id} disabled />
             <Input label="Class" value={form.class?.class_name || form.class_id} disabled />
             <Input label="Section" value={form.section?.section_name || form.section_id || "-"} disabled />

            <Select
              label="Status"
              value={form.status}
              onChange={(v) => setForm({ ...form, status: v })}
              options={["active", "inactive"]}
            />

          <Input
            label="Date of Birth"
            type="date"
            value={form.dob || ""}
            onChange={(v) => setForm({ ...form, dob: v })}
          />

          <Select
            label="Gender"
            value={form.gender || ""}
            onChange={(v) => setForm({ ...form, gender: v })}
            options={["male", "female", "other"]}
          />

          <Input label="Aadhar No" value={form.aadhar_no || ""}
            onChange={(v) => setForm({ ...form, aadhar_no: v })} />

          <Input label="Father Name" value={form.father_name || ""}
            onChange={(v) => setForm({ ...form, father_name: v })} />

          <Input label="Father Mobile" value={form.father_mobile || ""}
            onChange={(v) => setForm({ ...form, father_mobile: v })} />

          <Input label="Mother Name" value={form.mother_name || ""}
            onChange={(v) => setForm({ ...form, mother_name: v })} />

          <Input label="Mother Mobile" value={form.mother_mobile || ""}
            onChange={(v) => setForm({ ...form, mother_mobile: v })} />

          <Input label="Emergency Contact" value={form.emergency_contact || ""}
            onChange={(v) => setForm({ ...form, emergency_contact: v })} />

            <Input label="Guardian Name" value={form.guardian_name || ""}
              onChange={(v) => setForm({ ...form, guardian_name: v })} />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onBack}
              className="px-6 py-2 text-[13px] border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="px-6 py-2 text-[13px] rounded-lg bg-[#ff6b35] text-white"
            >
              Update Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE INPUTS ================= */

function Input({
  label,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] mb-2">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-[13px]"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[12px] mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-[13px]"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
