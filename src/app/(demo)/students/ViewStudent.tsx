"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  User,
  Phone,
  Calendar,
  Camera,
  Upload,
  Loader2,
  MapPin,
} from "lucide-react";
import { BASE_URL } from "@/lib/authClient";
import { getAdminToken } from "@/lib/getToken";
import toast from "react-hot-toast";

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
  profile_pic: string | null;
  academic_year: { id: string; year_name: string };
  class: { id: string; class_name: string };
  section: { id: string; section_name: string } | null;
};

export default function ViewStudent({ studentId, onBack }: ViewStudentProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  /* ================= IMAGE UPLOAD ================= */

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optimistic Preview
    const objectUrl = URL.createObjectURL(file);
    setStudent((prev) => (prev ? { ...prev, profile_pic: objectUrl } : null));

    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      setUploading(true);
      const res = await fetch(`${BASE_URL}/api/v1/students/${studentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profile picture updated");
        // Update with actual S3 URL from server
        // setStudent((prev) => (prev ? { ...prev, profile_pic: data.student.profile_pic } : null));
        
        // Reload to get fresh data ensures sync
        window.location.reload(); 
      } else {
        toast.error(data.message || "Failed to update image");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

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
          toast.success("Student details loaded");
        }
      } catch (err) {
        console.error("Failed to fetch student", err);
        toast.error("Failed to fetch student details");
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 mb-6">
          <div className="flex items-center gap-5">
            {/* Profile Pic with Upload */}
            <div className="relative group">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-sm">
                {student.profile_pic ? (
                  <img
                    src={student.profile_pic}
                    alt={student.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-orange-50 text-orange-400">
                    <User size={40} />
                  </div>
                )}
              </div>

              {/* Edit Icon Overlay */}
              <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all hover:scale-105 active:scale-95">
                {uploading ? (
                  <Loader2 size={16} className="animate-spin text-primary" />
                ) : (
                  <Camera size={16} className="text-gray-600" />
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              </label>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {student.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                <span className="font-medium text-gray-700">Admission No:</span>{" "}
                {student.admission_no}
              </p>

              {/* Academic Info Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium border border-blue-100">
                  {student.academic_year?.year_name || "N/A"}
                </span>
                <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full font-medium border border-purple-100">
                  {student.class?.class_name || "N/A"}
                </span>
                {student.section && (
                  <span className="bg-pink-50 text-pink-700 text-xs px-3 py-1 rounded-full font-medium border border-pink-100">
                    {student.section.section_name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-end gap-2">
             <div
            className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${
              student.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {student.status.toUpperCase()}
          </div>
          <p className="text-xs text-gray-400 mt-1">Student Status</p>
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
