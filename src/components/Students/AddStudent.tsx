"use client";

import { useState, useEffect } from "react";
import { Download, Upload, Trash2 } from "lucide-react";

export default function AddStudentUnified() {
  const [classes, setClasses] = useState<string[]>([]);
  const [files, setFiles] = useState<{ [cls: string]: File[] }>({});

  useEffect(() => {
    const classList = [
      "Nursery",
      "LKG",
      "UKG",
      "1st class",
      "2nd class",
      "3rd class",
      "4th class",
      "5th class",
      "6th class",
      "7th class",
      "8th class",
      "9th class",
      "10th class",
    ];
    setClasses(classList);
  }, []);

  const handleDownload = async (cls: string) => {
    try {
      const res = await fetch(`https://your-api.com/download?class=${cls}`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `StudentList_${cls}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert(`Failed to download file for ${cls}`);
    }
  };

  const handleFileChange = (
    cls: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    setFiles((prev) => ({
      ...prev,
      [cls]: [...(prev[cls] || []), ...Array.from(selectedFiles)],
    }));
  };

  const handleUpload = async (cls: string) => {
    const clsFiles = files[cls];
    if (!clsFiles || clsFiles.length === 0) {
      alert(`Please select file(s) for ${cls}`);
      return;
    }

    const formData = new FormData();
    clsFiles.forEach((f) => formData.append("files", f));
    formData.append("class", cls);

    try {
      await fetch("https://your-api.com/upload-student", {
        method: "POST",
        body: formData,
      });
      alert(`File(s) uploaded for ${cls}`);
      setFiles((prev) => ({ ...prev, [cls]: [] }));
    } catch (err) {
      console.error(err);
      alert(`Failed to upload file for ${cls}`);
    }
  };

  const handleRemoveFile = (cls: string, index: number) => {
    setFiles((prev) => {
      const newFiles = [...(prev[cls] || [])];
      newFiles.splice(index, 1);
      return { ...prev, [cls]: newFiles };
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[16px] font-semibold text-black">Students</h2>
          <p className="text-[12px] text-gray-500 mt-1">
            Please select the class to add the details
          </p>
        </div>

        <button className="bg-[#f25c2a] text-white text-[12px] px-4 py-2 rounded-lg">
          + Add New student
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="px-2 py-2 w-[40px]"></th>
              <th className="px-2 py-2">Student Data</th>
              <th className="px-2 py-2 text-center">Download File</th>
              <th className="px-2 py-2 text-center">Upload File</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((cls) => (
              <tr key={cls} className="border-b">
                {/* Checkbox */}
                <td className="px-2 py-2">
                  <input type="checkbox" />
                </td>

                {/* Class Name */}
                <td className="px-2 py-2 text-[#f25c2a]">{cls}</td>

                {/* Download */}
                <td className="px-2 py-2 text-center">
                  <button onClick={() => handleDownload(cls)}>
                    <Download size={16} className="mx-auto" />
                  </button>
                </td>

                {/* Upload */}
                <td className="px-2 py-2 text-center">
                  <label className="cursor-pointer">
                    <Upload size={16} className="mx-auto" />
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileChange(cls, e)}
                    />
                  </label>

                  {files[cls]?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files[cls].map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-[11px] bg-gray-100 px-2 py-1 rounded"
                        >
                          <span className="truncate max-w-[140px]">
                            {file.name}
                          </span>
                          <Trash2
                            size={12}
                            className="cursor-pointer text-gray-500"
                            onClick={() => handleRemoveFile(cls, idx)}
                          />
                        </div>
                      ))}

                      <button
                        onClick={() => handleUpload(cls)}
                        className="mt-1 text-[11px] underline text-gray-600"
                      >
                        Upload selected files
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-4">
        <button className="bg-[#f25c2a] text-white text-[12px] px-6 py-2 rounded-lg">
          Continue
        </button>
      </div>
    </div>
  );
}
