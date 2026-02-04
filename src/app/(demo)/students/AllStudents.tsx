"use client";

import React, { useEffect, useState } from "react";
import { Search, Eye, Pencil, Plus, Layers, Users, ChevronRight, ArrowLeft, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { BASE_URL, getClasses, getSectionsByClass, getClassById } from "@/lib/authClient";
import { getAdminToken } from "@/lib/getToken";

/* ================= TYPES ================= */

type ClassType = {
  id: string;
  class_name: string;
  section_count: number;
  student_count: number;
};

type AllStudentsProps = {
  onViewStudent: (studentId: string) => void;
  onEditStudent: (studentId: string) => void;
  onAddStudent: () => void;
};

type SectionType = {
  id: string;
  section_name: string;
  student_count?: number; // Optional if we want to show it
};

type Student = {
  id: string;
  name: string;
  admission_no: string;
  class: { id: string; class_name: string } | null;
  section: { id: string; section_name: string } | null;
};

type ViewState = "classes" | "sections" | "students";

export default function AllStudents({
  onViewStudent,
  onEditStudent,
  onAddStudent,
}: AllStudentsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classIdParam = searchParams.get("class_id");
  const sectionIdParam = searchParams.get("section_id");

  /* ================= STATE ================= */

  const [currentView, setCurrentView] = useState<ViewState>("classes");
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Sorting
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const limit = 10;

  /* ================= INIT ================= */

  useEffect(() => {
    if (classIdParam) {
      handleUrlParams(classIdParam, sectionIdParam);
    } else if (currentView === "classes") {
      fetchClasses();
    }
  }, [currentView, page, search, classIdParam, sectionIdParam]);

  const handleUrlParams = async (cId: string, sId: string | null) => {
    setLoading(true);
    try {
      // 1. Fetch Class
      const clsData = await getClassById(cId);
      const mappedClass: ClassType = {
        id: clsData.id,
        class_name: clsData.class_name,
        section_count: clsData.section_count || 0,
        student_count: clsData.student_count || 0,
      };
      setSelectedClass(mappedClass);

      // 2. Fetch Sections
      const resSections = await getSectionsByClass(cId);
      const fetchedSections = resSections.sections || [];
      setSections(fetchedSections);

      // 3. Determine View
      if (sId) {
        const targetSec = fetchedSections.find((s: any) => s.id === sId);
        if (targetSec) {
          setSelectedSection(targetSec);
          setCurrentView("students");
        } else if (fetchedSections.length === 0 && mappedClass.student_count > 0) {
          setSelectedSection(null);
          setCurrentView("students");
        } else {
          setCurrentView("sections");
        }
      } else {
        // No specific section, check if we should skip to students
        if (fetchedSections.length === 0 && mappedClass.student_count > 0) {
          setSelectedSection(null);
          setCurrentView("students");
        } else {
          setCurrentView("sections");
        }
      }
    } catch (err) {
      console.error("Deep link error:", err);
      if (currentView === "classes") fetchClasses();
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await getClasses(search, page, limit);
      setClasses(res.classes);
      setTotal(res.total);
    } catch (error) {
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionsForClass = async (cls: ClassType) => {
    setLoading(true);
    try {
      const resSections = await getSectionsByClass(cls.id);
      const fetchedSections = resSections.sections || [];
      
      setSelectedClass(cls);
      setSearch("");
      setPage(1);

      if (fetchedSections.length === 0 && cls.student_count > 0) {
        setSections([]);
        setSelectedSection(null);
        setCurrentView("students");
        toast.success("No sections found. Showing all students in this class.");
      } else {
        setSections(fetchedSections);
        setCurrentView("sections");
      }
    } catch (error) {
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH STUDENTS ================= */

  const fetchStudents = async () => {
    if (!selectedClass) return;
    // If sections exist but none is selected, don't fetch
    if (sections.length > 0 && !selectedSection) return;

    setLoading(true);
    try {
      const sectionIdParam = selectedSection?.id || "";
      const res = await fetch(
        `${BASE_URL}/api/v1/students?class_id=${selectedClass.id}&section_id=${sectionIdParam}&page=${page}&limit=${limit}&search=${search}&sort=${sortField}&order=${sortOrder}`,
        {
          headers: {
            Authorization: `Bearer ${getAdminToken()}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setStudents(data.students || []);
        setTotal(data.total || 0);
      } else {
        setStudents([]);
        setTotal(0);
      }
    } catch (error) {
      toast.error("Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === "students" && selectedClass && selectedSection) {
      fetchStudents();
    }
  }, [page, search, sortField, sortOrder, currentView, selectedSection]);

  /* ================= HANDLERS ================= */

  const handleClassClick = (cls: ClassType) => {
    fetchSectionsForClass(cls);
  };

  const handleSectionClick = (sec: SectionType) => {
    setSelectedSection(sec);
    setPage(1);
    setSearch("");
    setCurrentView("students");
  };

  const handleBack = () => {
    // If we came from a deep link, clear it
    if (classIdParam || sectionIdParam) {
      router.replace("/students");
    }

    setPage(1);
    setSearch("");
    if (currentView === "students") {
      if (sections.length === 0) {
        setCurrentView("classes");
        setSelectedClass(null);
      } else {
        setCurrentView("sections");
        setSelectedSection(null);
      }
    } else if (currentView === "sections") {
      setCurrentView("classes");
      setSelectedClass(null);
    }
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
      setSortOrder("ASC");
    }
    setPage(1);
  };

  /* ================= RENDER COMPONENTS ================= */

  const ClassGrid = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            onClick={() => handleClassClick(cls)}
            className="group cursor-pointer bg-white rounded-2xl p-6 border border-transparent hover:border-[#ff6b35] transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden"
          >
            {/* Decorative side bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-start justify-between">
              <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-[#ff6b35] transition-colors">
                <Layers className="text-[#ff6b35] group-hover:text-white" size={24} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-semibold border border-green-100">Active</span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold text-gray-800">{cls.class_name}</h3>
              <p className="text-sm text-gray-400 mt-1">Secondary Division</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Sections</span>
                  <span className="text-sm font-bold text-gray-700">{cls.section_count || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Students</span>
                  <span className="text-sm font-bold text-[#ff6b35]">{cls.student_count || 0}</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#ff6b35] group-hover:text-white transition-all">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        ))}
        {!loading && classes.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Layers size={24} className="text-gray-300" />
             </div>
             <p className="text-gray-400 font-medium">No classes found.</p>
          </div>
        )}
      </div>

      {/* Pagination for Classes */}
      {total > limit && (
        <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
          <span className="text-[11px] font-bold text-gray-400 uppercase">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} classes
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 text-xs font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              Previous
            </button>
            <button
              disabled={page * limit >= total}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 text-xs font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );

  const SectionList = () => (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h3 className="text-lg font-bold text-gray-800">Sections for {selectedClass?.class_name}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec) => (
          <div
            key={sec.id}
            onClick={() => handleSectionClick(sec)}
            className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 hover:border-[#ff6b35] cursor-pointer transition-all shadow-sm hover:shadow-md group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#ff6b35] font-bold border border-orange-100">
                {sec.section_name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Section {sec.section_name}</h4>
                <p className="text-xs text-gray-400">Manage students in this section</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-gray-400">VIEW LIST</span>
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#ff6b35] group-hover:text-white transition-all">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        ))}
        {sections.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Layers size={24} className="text-gray-300" />
             </div>
             <p className="text-gray-400 font-medium">No sections found for this class.</p>
          </div>
        )}
      </div>
    </div>
  );

  const StudentTable = () => (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{selectedClass?.class_name} - Section {selectedSection?.section_name}</h3>
            <p className="text-xs text-gray-400">Total {total} students found</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sr.</th>
              <th 
                className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-[#ff6b35]"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Student Name
                  <ArrowUpDown size={12} className={sortField === "name" ? "text-[#ff6b35]" : "opacity-30"} />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-[#ff6b35]"
                onClick={() => toggleSort("admission_no")}
              >
                <div className="flex items-center gap-1">
                  Admission No
                  <ArrowUpDown size={12} className={sortField === "admission_no" ? "text-[#ff6b35]" : "opacity-30"} />
                </div>
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((student, index) => (
              <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-xs font-semibold text-gray-400">#{(page - 1) * limit + index + 1}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#ff6b35] font-bold text-[10px]">
                      {student.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-700">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600">{student.admission_no}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEditStudent(student.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-500 transition-all border border-transparent hover:border-gray-200"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => onViewStudent(student.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-orange-500 transition-all border border-transparent hover:border-gray-200"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Users size={24} className="text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-medium">No students found in this section.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination for Students */}
        {total > limit && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} records
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 text-xs font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                Previous
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 text-xs font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-8">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Student Management</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            {currentView === "classes" && "Select a class to manage students"}
            {currentView === "sections" && `Browsing sections for ${selectedClass?.class_name}`}
            {currentView === "students" && `Viewing students in ${selectedClass?.class_name} - ${selectedSection?.section_name}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          {/* Universal Search bar for Classes and Students */}
          {currentView !== "sections" && (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder={currentView === "classes" ? "Search classes..." : "Search students..."}
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#ff6b35] focus:outline-none w-full sm:w-64 transition-all"
              />
            </div>
          )}

          <button
            onClick={onAddStudent}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-[12px] font-bold rounded-xl bg-[#ff6b35] text-white hover:bg-[#e85f2e] transition-all shadow-lg shadow-orange-100 whitespace-nowrap w-full sm:w-auto"
          >
            <Plus size={16} />
            ADD NEW STUDENT
          </button>
        </div>
      </div>

      {loading && currentView === "classes" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-48 bg-white rounded-2xl border border-gray-100 animate-pulse shadow-sm"></div>
          ))}
        </div>
      )}

      {!loading && currentView === "classes" && <ClassGrid />}
      {currentView === "sections" && <SectionList />}
      {currentView === "students" && <StudentTable />}
    </div>
  );
}
