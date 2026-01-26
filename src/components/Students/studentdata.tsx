"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Download, Upload as UploadIcon } from "lucide-react";
import { getClasses, getSections } from "@/lib/auth";

type FileStatus = {
  name: string;
  class: string;
  year: number;
  section: string;
  status: "pending" | "completed";
};

export default function StudentDataScreen({ onBack }: { onBack: () => void }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [classes, setClasses] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [academicYears, setAcademicYears] = useState<number[]>([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | "">("");

  const [files, setFiles] = useState<File[]>([]);
  const [recentFiles, setRecentFiles] = useState<FileStatus[]>([]);
  const [activeUploadFile, setActiveUploadFile] =
    useState<FileStatus | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  /* ---------- INIT ---------- */
  useEffect(() => {
    const fetchData = async () => {
      const classData = await getClasses();
      const sectionData = await getSections();

      setClasses(classData.map((c: any) => c.class_name));
      setSections(sectionData.map((s: any) => s.section_name));
    };

    fetchData();

    const years: number[] = [];
    for (let y = 1999; y <= 2045; y++) years.push(y);
    setAcademicYears(years);
  }, []);

  /* ---------- HELPERS ---------- */
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fileName =
    selectedClass && selectedYear && selectedSection
      ? `StudentList_${selectedClass}_${selectedSection}_${selectedYear}.xlsx`
      : "";

  /* ---------- DOWNLOAD ---------- */
  const handleDownload = async () => {
    if (!selectedClass || !selectedYear || !selectedSection) {
      showToast("⚠️ Select Class, Year & Section");
      return;
    }

    const alreadyPending = recentFiles.find(
      (f) => f.name === fileName && f.status === "pending"
    );

    if (alreadyPending) {
      showToast("⚠️ File already downloaded. Upload it first.");
      return;
    }

    const params = new URLSearchParams({
      class: selectedClass,
      section: selectedSection,
      academicYear: selectedYear.toString(),
    });

    const res = await fetch(`?${params.toString()}`);
    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    setRecentFiles((prev) => [
      ...prev,
      {
        name: fileName,
        class: selectedClass,
        year: selectedYear as number,
        section: selectedSection,
        status: "pending",
      },
    ]);

    setSelectedClass("");
    setSelectedSection("");
    setSelectedYear("");
    setFiles([]);
    setActiveUploadFile(null);

    showToast("✅ File downloaded (Pending)");
  };

  /* ---------- FILE PICK ---------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles([e.target.files[0]]);
  };

  /* ---------- UPLOAD CLICK ---------- */
  const handleUploadClick = () => {
    if (!activeUploadFile) {
      showToast("⚠️ Select a pending file from table");
      return;
    }

    if (files.length === 0) {
      fileInputRef.current?.click(); // manual picker
      return;
    }

    if (files[0].name !== activeUploadFile.name) {
      showToast("⚠️ Upload the same downloaded Excel file");
      return;
    }

    handleUpload();
  };

  /* ---------- UPLOAD ---------- */
  const handleUpload = () => {
    if (!activeUploadFile || files.length === 0) return;

    const formData = new FormData();
    formData.append("file", files[0]);

    fetch("https://your-api.com/upload-student", {
      method: "POST",
      body: formData,
    })
      .then(() => {
        setRecentFiles((prev) =>
          prev.map((f) =>
            f.name === activeUploadFile.name
              ? { ...f, status: "completed" }
              : f
          )
        );
        setFiles([]);
        setActiveUploadFile(null);
        showToast("🎉 File uploaded successfully");
      })
      .catch(() => showToast("❌ Upload failed"));
  };

  return (
    <div className="min-h-screen bg-[#f7ebe7] p-6">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 right-6 bg-black text-white px-4 py-2 rounded-lg">
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white rounded-2xl border px-6 py-4 mb-6 flex items-center gap-4">
        <button onClick={onBack} className="h-9 w-9 border rounded-full">
          <ChevronLeft size={16} />
        </button>
        <div>
          <h2 className="font-semibold">Students</h2>
          <p className="text-[12px] text-gray-500">
            Download & Upload Student Data
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="bg-white rounded-2xl border p-6 space-y-6">
        {/* FILTERS */}
        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border rounded-full px-4 py-2"
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded-full px-4 py-2"
          >
            <option value="">Academic Year</option>
            {academicYears.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="border rounded-full px-4 py-2"
          >
            <option value="">Section</option>
            {sections.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* ACTIONS */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* DOWNLOAD */}
          <button
            onClick={handleDownload}
            className="h-[56px] rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center justify-center gap-2"
          >
            <Download size={18} /> Download Excel
          </button>

          {/* UPLOAD */}
          <div className="flex flex-col items-center">
            <div
              className={`h-[56px] w-full rounded-full border-2 border-dashed flex items-center justify-center gap-3 ${
                activeUploadFile
                  ? "border-blue-400 text-blue-600"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              <UploadIcon size={18} />
              {activeUploadFile
                ? activeUploadFile.name
                : "Select pending file below"}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={handleUploadClick}
              disabled={!activeUploadFile}
              className={`mt-4 h-[56px] w-full rounded-full font-semibold flex items-center justify-center gap-2 ${
                activeUploadFile
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <UploadIcon size={18} />
              {files.length === 0 ? "Select File & Upload" : "Upload"}
            </button>
          </div>
        </div>

        {/* RECENT TABLE */}
        <div>
          <h4 className="font-semibold mb-3">Recently Downloaded Files</h4>

          <table className="w-full border text-[13px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Year</th>
                <th className="border p-2">Section</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentFiles.map((f, i) => (
                <tr
                  key={i}
                  className={`${
                    activeUploadFile?.name === f.name
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="border p-2">{i + 1}</td>
                  <td className="border p-2">{f.class}</td>
                  <td className="border p-2">{f.year}</td>
                  <td className="border p-2">{f.section}</td>
                  <td className="border p-2 text-center">
                    {f.status === "pending" ? "⏳ Pending" : "✅ Completed"}
                  </td>
                  <td className="border p-2 text-center">
                    {f.status === "pending" ? (
                      <button
                        onClick={() => {
                          setActiveUploadFile(f);
                          setSelectedClass(f.class);
                          setSelectedYear(f.year);
                          setSelectedSection(f.section);
                        }}
                        className="text-blue-600 font-medium"
                      >
                        Upload
                      </button>
                    ) : (
                      "—"
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
