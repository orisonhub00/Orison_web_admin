"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { createSection, updateSection } from "@/lib/auth";

export default function CreateSection({
  onBack,
  editingSection,
}: {
  onBack: () => void;
  editingSection: { id: string; section_name: string } | null;
}) {
  const isEditMode = Boolean(editingSection?.id);

  const [sectionName, setSectionName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingSection) setSectionName(editingSection.section_name);
    else setSectionName("");
  }, [editingSection]);

  const handleSave = async () => {
    if (sectionName.trim() === "") {
      alert("Enter section name");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && editingSection) {
        await updateSection(editingSection.id, sectionName);
        alert("✅ Section updated successfully!");
      } else {
        await createSection(sectionName);
        alert(`✅ Section "${sectionName}" created successfully!`);
      }

      setSectionName("");
      onBack();
    } catch (error: any) {
      console.error("❌ Save Section Error:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4">
      <button
        onClick={() => onBack()}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <h2 className="text-lg font-semibold mb-4">
        {isEditMode ? "Edit Section" : "Create Section"}
      </h2>

      <div className="bg-white rounded-2xl shadow p-5 max-w-md">
        <label className="block text-sm font-medium mb-1">Section Name</label>

        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4 outline-none"
          placeholder="Enter section name"
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
          {loading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
}
