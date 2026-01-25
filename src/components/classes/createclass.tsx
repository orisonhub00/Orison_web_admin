"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { createClass, updateClass } from "@/lib/auth";

export default function CreateClass({
  onBack,
  editingClass,
}: {
  onBack: () => void;
  editingClass: { id: string; class_name: string } | null;
}) {
  const isEditMode = Boolean(editingClass?.id);

  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Auto-prefill when editing
  useEffect(() => {
    if (editingClass) {
      setClassName(editingClass.class_name);
    } else {
      setClassName("");
    }
  }, [editingClass]);

  const handleSave = async () => {
    if (className.trim() === "") {
      alert("Enter class name");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && editingClass) {
        await updateClass(editingClass.id, className);
        alert("✅ Class updated successfully!");
      } else {
        await createClass(className);
        alert(`✅ Class "${className}" created successfully!`);
      }

      setClassName("");
      onBack(); // return to list

    } catch (error: any) {
      console.error("❌ Save Class Error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4">
      <button
        onClick={() => {
          onBack();
        }}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <h2 className="text-lg font-semibold mb-4">
        {isEditMode ? "Edit Class" : "Create Class"}
      </h2>

      <div className="bg-white rounded-2xl shadow p-5 max-w-md">
        <label className="block text-sm font-medium mb-1">
          Class Name
        </label>

        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4 outline-none"
          placeholder="Enter class name"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {loading
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update"
            : "Create"}
        </button>
      </div>
    </div>
  );
}
