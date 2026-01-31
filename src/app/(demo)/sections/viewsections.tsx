"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Edit2, Trash2 } from "lucide-react";
import { getSections, getSectionById, deleteSection } from "@/lib/authClient";
import toast from "react-hot-toast";


interface SectionType {
  id: string;
  section_name: string;
  status?: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function ViewSections({
  onBack,
  onEditSection,
}: {
  onBack: () => void;
  onEditSection: (sec: SectionType) => void;
}) {
  const [sections, setSections] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState(false);

  /* ---------- FETCH SECTIONS ---------- */
  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const data = await getSections();
        setSections(
          data.map((s: SectionType) => ({
            ...s,
            status: s.status || "active",
          }))
        );
      } catch (err: any) {
        toast.error(err.message);
        
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  /* ---------- DETAILS ---------- */
  const fetchSectionDetails = async (id: string) => {
    setDetailLoading(true);
    try {
      const sec = await getSectionById(id);
      setSelectedSection({ ...sec, status: sec.status || "active" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      await deleteSection(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
      toast.success("Section deleted successfully");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  /* ================= DETAIL VIEW ================= */
  if (selectedSection) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4">
        <button
          onClick={() => setSelectedSection(null)}
          className="flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-black"
        >
          <ChevronLeft size={16} /> Back to Sections
        </button>

        <div className="bg-white rounded-2xl border shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Section Details</h2>
          </div>

          {detailLoading ? (
            <div className="p-6 text-gray-500">Loading details...</div>
          ) : (
            <div className="divide-y">
              {[
                ["Section Name", selectedSection.section_name],
                [
                  "Status",
                  <span
                    key="status"
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedSection.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {selectedSection.status}
                  </span>,
                ],
                [
                  "Created At",
                  new Date(selectedSection.createdAt).toLocaleString(),
                ],
                [
                  "Updated At",
                  new Date(selectedSection.updatedAt).toLocaleString(),
                ],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-4 px-6 py-4 text-sm"
                >
                  <div className="text-gray-500 font-medium">{label}</div>
                  <div className="col-span-2 text-gray-900">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ================= LIST VIEW ================= */
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-black"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">All Sections</h2>
        </div>

        {loading ? (
          <div className="p-6 text-gray-500">Loading sections...</div>
        ) : sections.length === 0 ? (
          <div className="p-6 text-gray-500">No sections found</div>
        ) : (
          <div className="divide-y">
            {/* TABLE HEADER */}
            <div className="grid grid-cols-6 px-6 py-3 text-xs font-semibold text-gray-500 bg-gray-50">
              <div className="col-span-2">SECTION NAME</div>
              <div>STATUS</div>
              <div>CREATED</div>
              <div>UPDATED</div>
              <div className="text-right">ACTIONS</div>
            </div>

            {/* TABLE ROWS */}
            {sections.map((s) => (
              <div
                key={s.id}
                onClick={() => fetchSectionDetails(s.id)}
                className="grid grid-cols-6 px-6 py-4 text-sm items-center hover:bg-gray-50 cursor-pointer"
              >
                <div className="col-span-2 font-medium text-gray-900">
                  {s.section_name}
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="text-gray-600">
                  {new Date(s.createdAt).toLocaleDateString()}
                </div>

                <div className="text-gray-600">
                  {new Date(s.updatedAt).toLocaleDateString()}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSection(s);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(s.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
