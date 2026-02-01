"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Download } from "lucide-react";
import { getAcademicYears, getClasses, getSections } from "@/lib/authClient"; // import your API functions
import toast from "react-hot-toast";

export default function AddStudent({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const [classes, setClasses] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [otherSection, setOtherSection] = useState("");

  // Fetch classes and sections from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ----- Classes -----
        const { classes: classData } = await getClasses();
        const activeClasses = classData
          .filter((cls: any) => cls.status === "active")
          .map((cls: any) => cls.class_name);

        setClasses(activeClasses);

        // ----- Sections -----
        const sectionData = await getSections();
        const activeSections = sectionData
          .filter((sec: any) => sec.status === "active")
          .map((sec: any) => sec.section_name);

        setSections(activeSections);

        // ----- Academic Years -----
        const yearData = await getAcademicYears();
        const activeYears = yearData
          .filter((yr: any) => yr.status === "active")
          .map((yr: any) => yr.year_name); // ✅ keep as string

        setAcademicYears(activeYears);
      } catch (error) {
        console.error(
          "Error fetching classes, sections or academic years:",
          error,
          toast.error("Error fetching data")
        );
      }
    };

    fetchData();
  }, []);

  // Handle file download
  const handleDownload = async () => {
    const sectionValue =
      selectedSection === "Other" ? otherSection : selectedSection;
    if (!selectedClass || !sectionValue || !selectedYear) {
      toast.error("Please select Class, Section and Academic Year.");
      return;
    }

    const params = new URLSearchParams({
      class: selectedClass,
      section: sectionValue,
      academicYear: selectedYear, // ✅ already string
    });

    try {
      const res = await fetch(`${params.toString()}`);
      if (!res.ok) throw new Error("Failed to download file");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `StudentList_${selectedClass}_${sectionValue}_${selectedYear}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      toast.error("Error downloading file");
    } finally {
      onNext?.();
    }
  };

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-2xl px-4 sm:px-5 py-3 shadow-sm border border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-muted"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-[16px] font-semibold text-black">Students</h2>
        </div>
        <button className="h-9 w-9 rounded-full bg-muted flex items-center justify-center self-end sm:self-auto">
          <Download size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Student Info Card */}
      <div className="mt-4 bg-white rounded-2xl border border-border shadow-sm p-4 sm:p-5">
        <h3 className="text-[15px] font-semibold text-black mb-4">
          Student Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class */}
          <div>
            <label className="block text-[12px] font-medium text-gray-600 mb-1">
              Select Class*
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-[12px] font-medium text-gray-600 mb-1">
              Select Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select academic year</option>
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block text-[12px] font-medium text-gray-600 mb-1">
              Select Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select section</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            {selectedSection === "Other" && (
              <input
                type="text"
                placeholder="Enter section"
                value={otherSection}
                onChange={(e) => setOtherSection(e.target.value)}
                className="mt-2 w-full border border-border rounded-xl px-3 py-2.5 text-[13px] outline-none focus:ring-1 focus:ring-primary"
              />
            )}
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto bg-[#f25c2a] hover:bg-[#e65324] text-white text-[13px] px-6 py-2.5 rounded-xl shadow transition"
          >
            Download File
          </button>
        </div>
      </div>
    </div>
  );
}
