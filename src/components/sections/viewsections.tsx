"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Edit2, Trash2 } from "lucide-react";
import {
  getSections,
  getSectionById,
  deleteSection,
} from "@/lib/auth";

interface SectionType {
  id: string;
  section_name: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface SectionDetailType extends SectionType {}

export default function ViewSections({
  onBack,
  onEditSection,
}: {
  onBack: () => void;
  onEditSection: (sec: SectionType) => void;
}) {
  const [sections, setSections] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] =
    useState<SectionDetailType | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const sectionList = await getSections();
        setSections(sectionList);
      } catch (error: any) {
        console.error(error);
        alert(`❌ Error fetching sections: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  const fetchSectionDetails = async (id: string) => {
    setDetailLoading(true);
    try {
      const sec = await getSectionById(id);
      setSelectedSection(sec);
    } catch (error: any) {
      console.error(error);
      alert(`❌ ${error.message}`);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      setLoading(true);
      await deleteSection(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
      alert("✅ Section deleted successfully");
    } catch (error: any) {
      console.error(error);
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackFromDetail = () => setSelectedSection(null);

  if (selectedSection) {
    return (
      <div className="w-full px-4">
        <button
          onClick={handleBackFromDetail}
          className="flex items-center gap-2 text-sm text-gray-600 mb-4"
        >
          <ChevronLeft size={16} /> Back to Sections
        </button>

        <h2 className="text-lg font-semibold mb-4">Section Details</h2>

        {detailLoading ? (
          <div className="text-gray-500">Loading section details...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md space-y-3">
            <div>
              <span className="font-medium text-gray-700">Section Name: </span>
              {selectedSection.section_name}
            </div>
            <div>
              <span className="font-medium text-gray-700">Created At: </span>
              {new Date(selectedSection.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="font-medium text-gray-700">Updated At: </span>
              {new Date(selectedSection.updatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <h2 className="text-lg font-semibold mb-4">All Sections</h2>

      {loading ? (
        <div className="text-gray-500">Loading sections...</div>
      ) : (
        <div className="space-y-3">
          {sections.length > 0 ? (
            sections.map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center w-full bg-white rounded-2xl shadow p-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => fetchSectionDetails(s.id)}
              >
                <span className="text-gray-700 font-medium">{s.section_name}</span>

                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSection(s);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(s.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No sections found</div>
          )}
        </div>
      )}
    </div>
  );
}
