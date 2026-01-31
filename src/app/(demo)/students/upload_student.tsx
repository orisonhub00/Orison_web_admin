"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Trash2, Upload as UploadIcon } from "lucide-react";

export default function UploadStudentData({ onBack }: { onBack: () => void }) {
  const [fileName, setFileName] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | "">("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [classes, setClasses] = useState<string[]>([]);
  const [academicYears, setAcademicYears] = useState<number[]>([]);
  const sections = ["A", "B", "C", "D", "Other"];

  useEffect(() => {
    const romanClasses = ["LKG", "UKG", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    setClasses(romanClasses);

    const years: number[] = [];
    for (let y = 1999; y <= 2045; y++) years.push(y);
    setAcademicYears(years);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles([...files, ...Array.from(e.target.files)]);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUpload = () => {
    if (!fileName || !selectedYear || !selectedClass || !selectedSection || files.length === 0) {
      alert("Please fill all fields and upload at least one file.");
      return;
    }

    // Create FormData for API
    const formData = new FormData();
    formData.append("fileName", fileName);
    formData.append("academicYear", selectedYear.toString());
    formData.append("class", selectedClass);
    formData.append("section", selectedSection);
    files.forEach((f) => formData.append("files", f));

    fetch("https://your-api.com/upload-student", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => alert("Files uploaded successfully"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-muted"
        >
          <ChevronLeft size={16} />
        </button>
        <h2 className="text-[16px] font-semibold text-black">Students</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border p-4 sm:p-6 lg:p-8">
        <h3 className="text-[15px] font-semibold text-black mb-6">Upload Student Data</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="File Name*"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-primary"
          />

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select Academic Year</option>
            {academicYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Class*</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Select Section</option>
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-border rounded-xl px-3 py-2.5 text-[13px] w-full sm:w-auto"
          />
          <button
            onClick={handleUpload}
            className="bg-[#f25c2a] hover:bg-[#e65324] text-white px-6 py-2.5 rounded-xl text-[13px] flex items-center gap-2"
          >
            <UploadIcon size={16} /> Upload
          </button>
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-border rounded-xl px-3 py-2 text-[13px]"
              >
                <span>{file.name}</span>
                <Trash2
                  size={16}
                  className="cursor-pointer text-red-500"
                  onClick={() => handleRemoveFile(index)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onBack}
            className="px-6 py-2.5 border border-border rounded-xl text-[13px] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-6 py-2.5 bg-[#f25c2a] hover:bg-[#e65324] text-white rounded-xl text-[13px]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
