"use client";

import React from "react";
import { ChevronLeft, User, Search, Eye } from "lucide-react";

interface AllStudentsProps {
  onViewStudent?: () => void;
}

export default function AllStudents({ onViewStudent }: AllStudentsProps) {
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
        <span className="text-gray-800 font-medium">View Students</span>
      </div>

      {/* Search and Filters */}
      <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-800 outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <button className="px-4 py-2 text-[13px] rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
            Filter
          </button>
        </div>
      </div>

      {/* Students List */}
      <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-700">Admission No</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-700">Class</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-700">Section</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((student) => (
                <tr key={student} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-[13px] text-gray-800">Student {student}</td>
                  <td className="px-6 py-4 text-[13px] text-gray-600">ADM{1000 + student}</td>
                  <td className="px-6 py-4 text-[13px] text-gray-600">Class {student}</td>
                  <td className="px-6 py-4 text-[13px] text-gray-600">A</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-[11px] rounded-full bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={onViewStudent}
                      className="flex items-center gap-1 px-3 py-1 text-[12px] text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
