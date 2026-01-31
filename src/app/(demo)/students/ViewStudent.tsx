"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  User,
  Phone,
  Calendar,
} from "lucide-react";
import { BASE_URL } from "@/lib/authClient";
import { getAdminToken } from "@/lib/getToken";

interface ViewStudentProps {
  studentId: string;
  onBack?: () => void;
}

type Student = {
  id: string;
  name: string;
  admission_no: string;
  dob: string | null;
  gender: string | null;
  aadhar_no: string | null;
  father_name: string | null;
  father_mobile: string | null;
  mother_name: string | null;
  mother_mobile: string | null;
  guardian_name: string | null;
  emergency_contact: string | null;
  status: string;
};

export default function ViewStudent({ studentId, onBack }: ViewStudentProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH STUDENT ================= */

  useEffect(() => {
    if (!studentId) return;

    const fetchStudent = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/v1/students/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${getAdminToken()}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setStudent(data.student);
        }
      } catch (err) {
        console.error("Failed to fetch student", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading student details...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 text-sm text-red-500">
        Student not found
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Card */}
      <div className="bg-white rounded-xl p-6 border">
        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
            <User className="text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {student.name}
            </h3>
            <p className="text-sm text-gray-500">
              Admission No: {student.admission_no}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailField
            label="Date of Birth"
            value={student.dob || "-"}
            icon={<Calendar size={14} />}
          />
          <DetailField
            label="Gender"
            value={student.gender || "-"}
            icon={<User size={14} />}
          />
          <DetailField
            label="Aadhar No"
            value={student.aadhar_no || "-"}
            icon={<User size={14} />}
          />

          <DetailField
            label="Father Name"
            value={student.father_name || "-"}
            icon={<User size={14} />}
          />
          <DetailField
            label="Father Mobile"
            value={student.father_mobile || "-"}
            icon={<Phone size={14} />}
          />

          <DetailField
            label="Mother Name"
            value={student.mother_name || "-"}
            icon={<User size={14} />}
          />
          <DetailField
            label="Mother Mobile"
            value={student.mother_mobile || "-"}
            icon={<Phone size={14} />}
          />

          <DetailField
            label="Guardian Name"
            value={student.guardian_name || "-"}
            icon={<User size={14} />}
          />
          <DetailField
            label="Emergency Contact"
            value={student.emergency_contact || "-"}
            icon={<Phone size={14} />}
          />

          <DetailField
            label="Status"
            value={student.status}
            icon={<User size={14} />}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE FIELD ================= */

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
      <label className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        {icon} {label}
      </label>
      <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-medium">
        {value}
      </div>
    </div>
  );
}
