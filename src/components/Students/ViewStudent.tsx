"use client";

import React from "react";
import { ChevronLeft, User, Mail, Phone, Calendar, MapPin } from "lucide-react";

interface ViewStudentProps {
  onBack?: () => void;
}

export default function ViewStudent({ onBack }: ViewStudentProps) {
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
        <button onClick={onBack} className="hover:text-gray-800 transition font-medium">
          View Students
        </button>
        <span className="text-gray-400">/</span>
        <span className="text-gray-800 font-medium">Student Details</span>
      </div>

      {/* Back Button */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center justify-center hover:bg-gray-100 rounded-lg p-1 transition"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <h3 className="text-[14px] font-semibold text-gray-700">Student Details</h3>
      </div>

      {/* Student Details Card */}
      <div className="mt-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Student Info */}
          <div className="lg:col-span-3 mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                <User size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-gray-800">John Doe</h3>
                <p className="text-[13px] text-gray-600 mt-1">Admission No: ADM1001</p>
                <p className="text-[13px] text-gray-600">Class: Class 1, Section A</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <DetailField label="Date of Birth" value="01/01/2010" icon={<Calendar size={16} />} />
          <DetailField label="Gender" value="Male" icon={<User size={16} />} />
          <DetailField label="Blood Group" value="O+" icon={<User size={16} />} />
          <DetailField label="Aadhar No" value="1234 5678 9012" icon={<User size={16} />} />

          {/* Parent Information */}
          <div className="lg:col-span-3 mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-[15px] font-semibold text-gray-800 mb-4">Parent Information</h4>
          </div>

          <DetailField label="Father Name" value="John Doe Sr." icon={<User size={16} />} />
          <DetailField label="Father Mobile" value="+91 98765 43210" icon={<Phone size={16} />} />
          <DetailField label="Mother Name" value="Jane Doe" icon={<User size={16} />} />
          <DetailField label="Mother Mobile" value="+91 98765 43211" icon={<Phone size={16} />} />
          <DetailField label="Guardian Name" value="John Doe Sr." icon={<User size={16} />} />
          <DetailField label="Emergency Contact" value="+91 98765 43212" icon={<Phone size={16} />} />

          {/* Academic Information */}
          <div className="lg:col-span-3 mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-[15px] font-semibold text-gray-800 mb-4">Academic Information</h4>
          </div>

          <DetailField label="Academic Year" value="2025 - 2026" icon={<Calendar size={16} />} />
          <DetailField label="Status" value="Active" icon={<User size={16} />} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-6 py-2 text-[13px] rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button className="px-6 py-2 text-[13px] rounded-lg bg-[#ff6b35] text-white hover:opacity-90 transition">
            Edit Student
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[12px] text-gray-600 mb-2">
        {icon}
        {label}
      </label>
      <div className="text-[13px] text-gray-800 font-medium bg-gray-50 rounded-lg px-3 py-2">
        {value}
      </div>
    </div>
  );
}
