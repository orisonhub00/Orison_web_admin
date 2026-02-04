"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Download, Upload as UploadIcon, Trash2 } from "lucide-react";
import LoadingOverlay from "@/components/reuseble_components/LoadingOverlay";
import { getClasses, getSectionsByClass, BASE_URL, getAcademicYears } from "@/lib/authClient";
import { getAdminToken } from "@/lib/getToken";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";


/* ================= TYPES ================= */

type ClassType = {
  id: string;
  class_name: string;
};


type AcademicYearType = {
  id: string;
  year_name: string;
};

type SectionType = {
  id: string;
  section_name: string;
};

type Batch = {
  id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string | null;
  status: "pending" | "processing" | "failed" | "completed";
  success_count: number | null;
  failed_count: number | null;
  createdAt: string;
  section?: { section_name: string };
  class?: { class_name: string };
  academicYear?: { year_name: string };
};

/* ================= COMPONENT ================= */

export default function StudentDataScreen({ onBack }: { onBack: () => void }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [classes, setClasses] = useState<ClassType[]>([]);
  const [sections, setSections] = useState<SectionType[]>([]);
const [academicYears, setAcademicYears] = useState<AcademicYearType[]>([]);
const [selectedYear, setSelectedYear] = useState<string>(""); // stores ID
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [batches, setBatches] = useState<Batch[]>([]);
  const [activeBatch, setActiveBatch] = useState<Batch | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [files, setFiles] = useState<File[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

const router = useRouter();

  /* ================= HELPERS ================= */

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const reloadBatches = async (p = 1) => {
    setUploading(true);
    try {
      let url = `${BASE_URL}/api/v1/studentbatches?page=${p}&limit=5`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      const data = await res.json();
      setBatches(data.batches || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setPage(p);
    } catch (err) {
      console.error("Failed to load batches:", err);
    } finally {
      setUploading(false);
    }
  };

  const downloadErrors = async (batchId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/studentbatches/${batchId}/errors`, {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      if (!res.ok) {
        showToast("❌ No error report available");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Get filename from response header
      const disposition = res.headers.get("Content-Disposition");
      let filename = `errors_batch_${batchId}.xlsx`; // fallback
      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    } catch (err) {
      console.error("Error downloading error sheet:", err);
      showToast("❌ Failed to download error sheet");
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the batch and ALL associated students. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BASE_URL}/api/v1/studentbatches/${batchId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });

      if (res.ok) {
        Swal.fire("Deleted!", "The batch and students have been removed.", "success");
        reloadBatches(page);
      } else {
        Swal.fire("Error", "Failed to delete batch.", "error");
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire("Error", "An unexpected error occurred.", "error");
    }
  };

  const academicYearMap = Object.fromEntries(
  academicYears.map(y => [y.id, y.year_name])
);
  /* ================= INIT ================= */

 useEffect(() => {
  getClasses().then(res => setClasses(res.classes));

  getAcademicYears()
    .then(setAcademicYears)
    .catch(() => setAcademicYears([]));

  reloadBatches();
}, []);


  /* ================= FETCH SECTIONS ================= */

  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      setSelectedSection("");
      return;
    }

    getSectionsByClass(selectedClass)
      .then((res) => setSections(res.sections || []))
      .catch(() => setSections([]));
  }, [selectedClass]);

  /* ================= DOWNLOAD TEMPLATE ================= */

  const handleDownload = async () => {
    if (!selectedYear || !selectedClass) {
      showToast("⚠️ Select Academic Year & Class");
      return;
    }

    setUploading(true);
    try {
      // 1️⃣ Create batch
      const res = await fetch(`${BASE_URL}/api/v1/studentbatches/create-template`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify({
          academic_year_id: selectedYear,
          class_id: selectedClass,
          section_id: selectedSection || null,
        }),
      });

      const data = await res.json();
      const batch = data.batch;

      // 2️⃣ Download Excel
      const fileRes = await fetch(
        `${BASE_URL}/api/v1/studentbatches/${batch.id}/template`,
        { headers: { Authorization: `Bearer ${getAdminToken()}` } }
      );

      const blob = await fileRes.blob();
      const url = URL.createObjectURL(blob);

      // Get filename from response header
      const disposition = fileRes.headers.get("Content-Disposition");
      let filename = `students_${batch.id}.xlsx`; // fallback
      if (disposition && disposition.indexOf("attachment") !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      reloadBatches();
      Swal.fire({
        title: "Success",
        text: "Template downloaded successfully!",
        icon: "success",
        confirmButtonColor: "#8b3a16",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Download error:", err);
      Swal.fire("Error", "Failed to download template.", "error");
    } finally {
      setUploading(false);
    }
  };

  /* ================= FILE PICK ================= */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles([e.target.files[0]]);
  };

  /* ================= UPLOAD ================= */

const handleUpload = async () => {
  if (!activeBatch) {
    showToast("⚠️ Select a batch first");
    return;
  }

  if (!files.length) {
    showToast("⚠️ Select the Excel file");
    return;
  }

  setUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", files[0]);

    /* 🔍 LOG EVERYTHING BEFORE REQUEST */
    console.group("📤 STUDENT UPLOAD DEBUG");
    console.log("Batch ID:", activeBatch.id);
    console.log("Academic Year:", activeBatch.academic_year_id);
    console.log("Class ID:", activeBatch.class_id);
    console.log("Section ID:", activeBatch.section_id);
    console.log("File name:", files[0].name);
    console.log("File size:", files[0].size);
    console.log("File type:", files[0].type);

    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    console.groupEnd();

    const res = await fetch(
      `${BASE_URL}/api/v1/studentbatches/${activeBatch.id}/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: formData,
      }
    );

    /* 🔥 LOG RESPONSE EVEN FOR 500 */
    console.group("📥 SERVER RESPONSE");
    console.log("Status:", res.status);
    console.log("Status Text:", res.statusText);

    const text = await res.text();
    console.log("Raw response body:", text);
    console.groupEnd();

    if (res.status === 201 || res.status === 200) {
      const data = JSON.parse(text);
      const { success_count, failed_count } = data.data || {};
      
      await Swal.fire({
        title: "Upload Result",
        html: `
          <div class="text-left py-2">
            <p class="text-green-600 font-bold mb-2">✅ Success: ${success_count} students added</p>
            ${failed_count > 0 ? `<p class="text-red-500 font-bold">❌ Failed: ${failed_count} records</p>
            <p class="text-xs text-gray-500 mt-2 italic">Check history below to download error sheet.</p>` : ""}
          </div>
        `,
        icon: failed_count > 0 ? "warning" : "success",
        confirmButtonColor: "#8b3a16",
        confirmButtonText: "OK",
      });

      setActiveBatch(null);
      setFiles([]);
      reloadBatches(1);

      if (failed_count === 0) {
        router.push(
          `/students?class_id=${activeBatch.class_id}&section_id=${activeBatch.section_id ?? ""}`
        );
      }
      return;
    }

    if (res.status === 422) {
      const data = JSON.parse(text);
      console.error("Validation errors:", data);
      return;
    }

    showToast("❌ Server error while uploading");

  } catch (err) {
    console.error("💥 Upload crashed:", err);
    showToast("❌ Upload failed");
  } finally {
    setUploading(false);
  }
};





  const retryUpload = async (batchId: string) => {
    if (files.length === 0) {
      fileInputRef.current?.click();
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const res = await fetch(
        `${BASE_URL}/api/v1/studentbatches/${batchId}/retry-upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getAdminToken()}` },
          body: formData,
        }
      );

      if (res.status === 201 || res.status === 200) {
        Swal.fire({
          title: "Retry Successful",
          text: "Batch processing completed!",
          icon: "success",
          confirmButtonColor: "#8b3a16",
        });
        setFiles([]);
        reloadBatches();
      } else {
        Swal.fire("Error", "Retry failed.", "error");
      }
    } catch (err) {
      console.error("Retry error:", err);
      Swal.fire("Error", "Something went wrong during retry.", "error");
    } finally {
      setUploading(false);
    }
  };

  const classMap = Object.fromEntries(
  classes.map(c => [c.id, c.class_name])
);

const sectionMap = Object.fromEntries(
  sections.map(s => [s.id, s.section_name])
);

// console.log("Section Map:", sectionMap);
// console.log("Class Map:", classMap);


  /* ================= UI ================= */

return (
  <div className="min-h-screen bg-[#f7ebe7] p-6">
    {uploading && <LoadingOverlay message="Uploading Students... Please wait." />}
    
    {toast && (
      <div className="fixed top-6 right-6 bg-black text-white px-4 py-2 rounded-lg z-50">
        {toast}
      </div>
    )}

    {/* HEADER */}
    <div className="bg-white rounded-2xl border px-6 py-4 mb-6 flex items-center gap-4">
      <button onClick={onBack} className="h-9 w-9 border rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
        <ChevronLeft size={16} />
      </button>
      <div>
        <h2 className="font-semibold text-lg">Students</h2>
        <p className="text-xs text-gray-500">
          Download & Upload Student Data
        </p>
      </div>
    </div>

    {/* MAIN CARD */}
    <div className="bg-white rounded-2xl border p-6 space-y-10">

      {/* ================= FILTERS ================= */}
      <div>
        <h3 className="font-semibold mb-3">Select Academic Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-3 cursor-pointer focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35] outline-none transition-all"
          >
            <option value="">Academic Year</option>
            {academicYears.map((y) => (
              <option key={y.id} value={y.id}>
                {y.year_name}
              </option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-3 cursor-pointer focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35] outline-none transition-all"
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.class_name}
              </option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!sections.length}
            className="border border-gray-300 rounded-full px-4 py-3 cursor-pointer disabled:cursor-not-allowed focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35] outline-none transition-all"
          >
            <option value="">Section</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.section_name}
              </option>
            ))}
          </select>

          <button
            onClick={handleDownload}
            className="rounded-full bg-[#ff6b35] hover:bg-[#e85f2e] text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-100 transition-all"
          >
            <Download size={18} /> Download Excel
          </button>
        </div>
      </div>

      {/* ================= UPLOAD CARD ================= */}
      <div className="border rounded-2xl p-6 bg-[#fafafa]">
        <h3 className="font-semibold mb-4">Upload Filled Excel</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

          {/* Batch Info */}
          <div className="border rounded-xl px-4 py-3 bg-white">
            {activeBatch ? (
              <>
                <p className="text-xs text-gray-500">Selected Batch</p>
                <p className="font-medium text-sm">
                  Year {academicYearMap[activeBatch.academic_year_id] || "-"}
                </p>
              </>
            ) : (
              <p className="text-gray-400 text-sm">
                Select a batch from below
              </p>
            )}
          </div>

          {/* File Picker */}
        <label
          className={`border-2 border-dashed rounded-xl px-4 py-3 text-center
          ${!activeBatch ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}
          `}
        >
          <UploadIcon className="inline mr-2" size={16} />
          {files[0] ? (
            <span className="block truncate max-w-[200px] mx-auto text-sm font-medium text-[#ff6b35]">
              {files[0].name}
            </span>
          ) : (
             activeBatch
              ? "Choose Excel for selected batch"
              : "Select a batch first"
          )}
          <input
            ref={fileInputRef}
            type="file"
            disabled={!activeBatch}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>


          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!activeBatch || !files.length}
            className="h-[52px] rounded-full bg-[#ff6b35] hover:bg-[#e85f2e] text-white font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-lg shadow-orange-100 transition-all"
          >
            Upload
          </button>
        </div>
      </div>

      {/* ================= BATCH TABLE ================= */}
      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
          <h3 className="font-semibold text-lg">Upload History</h3>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search by ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && reloadBatches(1)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35] transition-all"
            />
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-[#ff6b35] transition-all"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <button 
              onClick={() => reloadBatches(1)}
              className="px-4 py-1.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-black transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left w-12">#</th>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-center">Year</th>
              <th className="p-3 text-center">Section</th>
              <th className="p-3 text-center cursor-help" title="Successfully added students">Success</th>
              <th className="p-3 text-center cursor-help" title="Rows that failed validation">Failed</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, index) => (
              <tr key={batch.id} className="border-t hover:bg-gray-50">
                <td className="p-3 text-gray-400">{(page - 1) * 5 + index + 1}</td>
                <td className="p-3 font-medium">
                  {batch.class?.class_name || classMap[batch.class_id] || "Class " + batch.class_id}
                </td>

                <td className="p-3 text-center"> {batch.academicYear?.year_name || academicYearMap[batch.academic_year_id] || "-"}</td>
                <td className="p-3 text-center">{batch.section?.section_name || (batch.section_id ? sectionMap[batch.section_id] || "-" : "-")}</td>
                <td className="p-3 text-center font-bold text-green-600">
                  {batch.success_count ?? (batch.status === "completed" ? "-" : 0)}
                </td>
                <td className="p-3 text-center font-bold text-red-600">
                  {batch.failed_count ?? 0}
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    batch.status === "completed" ? "bg-green-100 text-green-700" :
                    batch.status === "failed" ? "bg-red-100 text-red-700" :
                    "bg-orange-100 text-orange-700"
                  }`}>
                    {batch.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex gap-3 justify-end items-center">
                    {batch.status === "pending" && (
                      <button
                        onClick={() => {
                          setActiveBatch(batch);
                          setFiles([]);
                          setTimeout(() => fileInputRef.current?.click(), 0);
                        }}
                        className="text-[#ff6b35] hover:text-[#e85f2e] font-semibold cursor-pointer text-xs"
                      >
                        Upload
                      </button>
                    )}
                    {(batch.status === "failed" || (batch.failed_count ?? 0) > 0) && (
                      <button
                        onClick={async () => {
                          setActiveBatch(batch);
                          await Swal.fire({
                            title: "Retry Upload",
                            text: "Please download the Error report, fix the highlighted fields in red, and then select the corrected file to re-upload.",
                            icon: "info",
                            confirmButtonText: "Select Corrected File",
                            confirmButtonColor: "#ff6b35"
                          });
                          setFiles([]);
                          fileInputRef.current?.click();
                        }}
                        className="text-[#ff6b35] hover:text-[#e85f2e] font-bold px-2 py-1 bg-orange-50 rounded cursor-pointer text-xs flex items-center gap-1"
                      >
                         Retry
                      </button>
                    )}
                    {(batch.failed_count ?? 0) > 0 && (
                      <button
                        onClick={() => downloadErrors(batch.id)}
                        className="text-orange-600 hover:text-orange-800 font-semibold flex items-center gap-1 cursor-pointer text-xs"
                        title="Download Error Report"
                      >
                         Errors
                      </button>
                    )}
                    <button
                        onClick={() => handleDeleteBatch(batch.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Batch Record"
                      >
                         <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 px-2">
            <p className="text-xs text-gray-500 italic">
              Showing page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => reloadBatches(page - 1)}
                disabled={page === 1}
                className="px-4 py-1.5 border rounded-full text-xs font-semibold disabled:opacity-30 hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => reloadBatches(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-1.5 border rounded-full text-xs font-semibold disabled:opacity-30 hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  </div>
);

}
