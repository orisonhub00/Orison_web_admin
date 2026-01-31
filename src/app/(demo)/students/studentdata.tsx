"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Download, Upload as UploadIcon } from "lucide-react";
import { getClasses, getSectionsByClass, BASE_URL, getAcademicYears } from "@/lib/authClient";
import { getAdminToken } from "@/lib/getToken";

import { useRouter } from "next/navigation";


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
  createdAt: string;
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

  const [files, setFiles] = useState<File[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

const router = useRouter();

  /* ================= HELPERS ================= */

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const reloadBatches = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/studentbatches`, {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    const data = await res.json();
    setBatches(data.batches || []);
  };

  const academicYearMap = Object.fromEntries(
  academicYears.map(y => [y.id, y.year_name])
);
  /* ================= INIT ================= */

 useEffect(() => {
  getClasses().then(setClasses);

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

    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${batch.id}.xlsx`;
    a.click();

    reloadBatches();
    showToast("✅ Template downloaded");
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
      showToast("🎉 Students uploaded successfully");
      setActiveBatch(null);
      setFiles([]);
      reloadBatches();
       router.push(
    `/students?class_id=${activeBatch.class_id}&section_id=${activeBatch.section_id ?? ""}`
  );

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

    if (res.status === 201) {
      showToast("✅ Retry successful");
      setFiles([]);
      reloadBatches();
    }
  };

  const classMap = Object.fromEntries(
  classes.map(c => [c.id, c.class_name])
);

const sectionMap = Object.fromEntries(
  sections.map(s => [s.id, s.section_name])
);

console.log("Section Map:", sectionMap);
console.log("Class Map:", classMap);


  /* ================= UI ================= */

return (
  <div className="min-h-screen bg-[#f7ebe7] p-6">
    {toast && (
      <div className="fixed top-6 right-6 bg-black text-white px-4 py-2 rounded-lg z-50">
        {toast}
      </div>
    )}

    {/* HEADER */}
    <div className="bg-white rounded-2xl border px-6 py-4 mb-6 flex items-center gap-4">
      <button onClick={onBack} className="h-9 w-9 border rounded-full">
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
  className="border rounded-full px-4 py-3"
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
            className="border rounded-full px-4 py-3"
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
            className="border rounded-full px-4 py-3"
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
            className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center justify-center gap-2"
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
          {files[0]?.name ?? (
            activeBatch
              ? "Choose Excel for selected batch"
              : "Select a batch first")}
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
            className="h-[52px] rounded-full bg-blue-600 text-white font-semibold disabled:opacity-40"
          >
            Upload
          </button>
        </div>
      </div>

      {/* ================= BATCH TABLE ================= */}
      <div>
        <h3 className="font-semibold mb-3">Upload History</h3>

        <table className="w-full border rounded-xl overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Class</th>
              <th className="p-3 text-center">Year</th>
              <th className="p-3 text-center">Section</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch.id} className="border-t">
                <td className="p-3">
                  {classMap[batch.class_id] || "-"}
                </td>

                <td className="p-3 text-center"> {academicYearMap[batch.academic_year_id] || "-"}</td>
                <td className="p-3 text-center">{batch.section_id ? sectionMap[batch.section_id] || "-" : "-"}</td>
                <td className="p-3 text-center">
                  {batch.status === "pending" && "⏳ Pending"}
                  {batch.status === "processing" && "⚙️ Processing"}
                  {batch.status === "failed" && "❌ Failed"}
                  {batch.status === "completed" && "✅ Completed"}
                </td>
                <td className="p-3 text-center">
                  {batch.status === "pending" && (
                    <button
                      onClick={() => {
                        setActiveBatch(batch);
                        setFiles([]);
                        setTimeout(() => fileInputRef.current?.click(), 0);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Upload
                    </button>
                  )}
                  {batch.status === "failed" && (
                    <button
                      onClick={() => {
                        setActiveBatch(batch);
                        showToast("Select corrected Excel file and click Upload");
                        fileInputRef.current?.click();
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Retry
                    </button>

                  )}
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
