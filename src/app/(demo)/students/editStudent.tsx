"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { BASE_URL } from "@/lib/authClient";
import { getAdminToken } from "@/lib/getToken";
import { useParams } from "next/navigation";

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
  }, [id]);

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    if (!form) return;

    const res = await fetch(`${BASE_URL}/api/v1/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert("Student updated successfully");
      onBack?.();
    }
  };

  if (loading || !form) {
    return <div className="p-6">Loading...</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="h-8 w-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="text-[15px] font-semibold">Edit Student</h3>
      </div>

      {/* Form */}
      <div className="mt-4 bg-white rounded-xl p-6 border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Input label="Student Name" value={form.name}
            onChange={(v) => setForm({ ...form, name: v })} />

          <Input label="Admission No" value={form.admission_no} disabled />

          <Input label="Class" value={form.class_id} disabled />
          <Input label="Section" value={form.section_id || "-"} disabled />
          <Input label="Academic Year" value={form.academic_year_id} disabled />

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
