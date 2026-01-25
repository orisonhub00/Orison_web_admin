"use client";

import React from "react";
import { User, Search, Eye, Pencil, Trash2, Plus } from "lucide-react";

interface AllStudentsProps {
  onViewStudent: () => void;
  onEditStudent: () => void;
  onAddStudent: () => void;
}

export default function AllStudents({
  onViewStudent,
  onEditStudent,
  onAddStudent,
}: AllStudentsProps) {
  return (
    <div className="w-full min-h-screen bg-[#f5f6fa] p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100">
        <h2 className="text-[15px] font-semibold text-[#ff6b35]">
          Students
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search"
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-[12px] outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <button className="px-3 py-2 text-[12px] border border-gray-200 rounded-lg">
            Filter
          </button>

          <button
            onClick={onAddStudent}
            className="flex items-center gap-2 px-4 py-2 text-[12px] rounded-lg bg-[#ff6b35] text-white"
          >
            <Plus size={14} />
            Add New student
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">Sr.</th>
              <th className="px-4 py-3 text-left">Student Name</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Section</th>
              <th className="px-4 py-3 text-left">Modify</th>
              <th className="px-4 py-3 text-left">View</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3">0{i}</td>
                <td className="px-4 py-3">Student {i}</td>
                <td className="px-4 py-3">XI</td>
                <td className="px-4 py-3">A</td>

                {/* Modify */}
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={onEditStudent}
                    className="text-gray-500 hover:text-[#ff6b35]"
                  >
                    <Pencil size={14} />
                  </button>
                  <button className="text-gray-500 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </td>

                {/* View */}
                <td className="px-4 py-3">
                  <button
                    onClick={onViewStudent}
                    className="text-gray-500 hover:text-[#ff6b35]"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-[11px]">
          <span>showing 06 of 06</span>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg">
              Previous
            </button>
            <span>Page 01 of 01</span>
            <button className="px-3 py-1 bg-[#ff6b35] text-white rounded-lg">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
