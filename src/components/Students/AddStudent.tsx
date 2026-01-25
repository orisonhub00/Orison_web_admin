"use client";

import React from "react";
import { ChevronLeft, User } from "lucide-react";

interface AddStudentProps {
  onBack?: () => void;
}

export default function AddStudent({ onBack }: AddStudentProps) {
  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100">
        <h2 className="text-[15px] font-semibold text-[#1f2937]">Students</h2>

        <button className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition">
          <User size={16} />
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="mt-4 flex items-center gap-2 text-[13px] text-gray-500">
        <span className="text-gray-800 font-medium">Add Student</span>
      </div>

      {/* Back + Title (like screenshot left arrow Add Student) */}
      <div className="mt-3 flex items-center gap-2 text-gray-700">
        <button
          onClick={onBack}
          className="flex items-center justify-center hover:bg-gray-100 rounded-lg p-1 transition"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <h3 className="text-[14px] font-semibold text-gray-700">Add Student</h3>
      </div>

      {/* Form Card */}
      <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1 */}
          <Field label="Student Name" placeholder="Enter project title" />

          {/* 2 */}
          <Field label="Admission no *" placeholder="Enter Mandal/Village name" />

          {/* 3 */}
          <SelectField label="Class" placeholder="Select Class" />

          {/* 4 */}
          <SelectField label="Section" placeholder="Select section" />

          {/* 5 */}
          <SelectField label="Academic year" placeholder="select section" />

          {/* 6 */}
          <Field label="Status" placeholder="Active/Tc/Dropout" />

          {/* 7 */}
          <Field label="Blood group" placeholder="Enter Name" />

          {/* 8 */}
          <Field label="Date of Birth" placeholder="Select Date of Preparation" />

          {/* 9 */}
          <SelectField label="Gender" placeholder="Select Gender" />

          {/* 10 */}
          <Field label="Aadhar no" placeholder="Active/Tc/Dropout" />

          {/* 11 */}
          <Field label="Father Name" placeholder="Enter Name" />

          {/* 12 */}
          <Field label="Mobile num" placeholder="Select Date of Preparation" />

          {/* 13 */}
          <Field label="Mother name" placeholder="Active/Tc/Dropout" />

          {/* 14 */}
          <Field label="Mobile no" placeholder="Active/Tc/Dropout" />

          {/* 15 */}
          <Field label="emergency contact" placeholder="Enter Name" />

          {/* 16 */}
          <Field label="Guardian name" placeholder="gaurdian name" />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-10">
          <button
            onClick={onBack}
            className="px-6 py-2 text-[13px] rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button className="px-6 py-2 text-[13px] rounded-lg bg-[#ff6b35] text-white hover:opacity-90 transition">
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

/* ✅ Small Reusable Components */

function Field({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-[12px] text-gray-600 mb-2">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-800 outline-none focus:ring-2 focus:ring-gray-200"
      />
    </div>
  );
}

function SelectField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-[12px] text-gray-600 mb-2">{label}</label>
      <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-700 outline-none focus:ring-2 focus:ring-gray-200">
        <option>{placeholder}</option>
      </select>
    </div>
  );
}
