"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

interface EditStudentProps {
  onBack?: () => void;
  student?: {
    name: string;
    admissionNo: string;
    className: string;
    section: string;
    academicYear: string;
    status: string;
    bloodGroup: string;
    dob: string;
    gender: string;
    aadhar: string;
    fatherName: string;
    fatherMobile: string;
    motherName: string;
    motherMobile: string;
    guardianName: string;
    emergencyContact: string;
  };
}

export default function EditStudent({ onBack, student }: EditStudentProps) {
  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="text-[15px] font-semibold text-gray-800">
          Edit Student
        </h3>
      </div>

      {/* Form Card */}
      <div className="mt-4 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Student Name" defaultValue={student?.name} />
          <Field label="Admission No *" defaultValue={student?.admissionNo} />
          <SelectField label="Class" defaultValue={student?.className} />
          <SelectField label="Section" defaultValue={student?.section} />
          <SelectField label="Academic Year" defaultValue={student?.academicYear} />
          <Field label="Status" defaultValue={student?.status} />
          <Field label="Blood Group" defaultValue={student?.bloodGroup} />
          <Field label="Date of Birth" defaultValue={student?.dob} />
          <SelectField label="Gender" defaultValue={student?.gender} />
          <Field label="Aadhar No" defaultValue={student?.aadhar} />
          <Field label="Father Name" defaultValue={student?.fatherName} />
          <Field label="Father Mobile" defaultValue={student?.fatherMobile} />
          <Field label="Mother Name" defaultValue={student?.motherName} />
          <Field label="Mother Mobile" defaultValue={student?.motherMobile} />
          <Field label="Emergency Contact" defaultValue={student?.emergencyContact} />
          <Field label="Guardian Name" defaultValue={student?.guardianName} />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 text-[13px] rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button className="px-6 py-2 text-[13px] rounded-lg bg-[#ff6b35] text-white hover:opacity-90">
            Update Student
          </button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Fields */

function Field({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] text-gray-600 mb-2">{label}</label>
      <input
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-gray-200"
      />
    </div>
  );
}

function SelectField({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] text-gray-600 mb-2">{label}</label>
      <select
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-gray-200"
      >
        <option>{defaultValue ?? "Select"}</option>
      </select>
    </div>
  );
}
