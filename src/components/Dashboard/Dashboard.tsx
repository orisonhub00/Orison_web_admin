"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  UserRound,
  Search,
  UserCircle2,
} from "lucide-react";

import StatCard from "../reuseble_components/StatCard";
import { Users, GraduationCap, Briefcase } from "lucide-react";

import Sidebar from "../Sidebar/Sidebar";
// import AddStudent from "../Students/AddStudent";
import StudentDataScreen from "../Students/studentdata";
import AllStudents from "../Students/AllStudents";
import ViewStudent from "../Students/ViewStudent";
import EditStudent from "../Students/editStudent";
import UploadStudentData from "../Students/upload_student";

import { ContentType } from "@/types/content";
import CreateClass from "../classes/createclass";
import ViewClasses from "../classes/viewclasses";
import ViewSections from "../sections/viewsections";
import CreateSection from "../sections/addsection";
import CreateAcademicYear from "../academicyears/CreateAcademicYear";
import ViewAcademicYears from "../academicyears/ViewAcademicYears";
import AssignClassSections from "../academics/classsections/AssignClassSections";

export default function Dashboard() {
  const [activeContent, setActiveContent] = useState<ContentType>("dashboard");

  const [editingClass, setEditingClass] = useState<{
    id: string;
    class_name: string;
    status: string;
  } | null>(null);

  const [editingYear, setEditingYear] = useState<{
    id: string;
    year_name: string;
    status: string;
  } | null>(null);

  const [editingSection, setEditingSection] = useState<{
    id: string;
    section_name: string;
    status?: string; // optional
  } | null>(null);

  const attendanceData = {
    student: { present: 2400, absent: 67 },
    teacher: { present: 180, absent: 12 },
    staff: { present: 95, absent: 5 },
  };

  const [activeTab, setActiveTab] = useState<"student" | "teacher" | "staff">(
    "student"
  );
  const present = attendanceData[activeTab].present;
  const absent = attendanceData[activeTab].absent;
  const total = present + absent;

  const renderContent = () => {
    switch (activeContent) {
      //     case "add-student":
      // return (
      //   <AddStudent
      //     onBack={() => setActiveContent("view-students")}
      //     onNext={() => setActiveContent("upload-student-data")}
      //   />
      // );

      case "add-student":
        return (
          <StudentDataScreen onBack={() => setActiveContent("view-students")} />
        );

      case "create-class":
        return (
          <CreateClass
            onBack={() => {
              setEditingClass(null);
              setActiveContent("view-classes");
            }}
            editingClass={editingClass}
          />
        );

      case "view-classes":
        return (
          <ViewClasses
            onBack={() => setActiveContent("dashboard")}
            onEditClass={(cls) => {
              setEditingClass({
                id: cls.id,
                class_name: cls.class_name,
                status: cls.status,
              });
              setActiveContent("create-class");
            }}
          />
        );

      case "create-academic-year":
        return (
          <CreateAcademicYear
            onBack={() => {
              setEditingYear(null);
              setActiveContent("view-academic-years");
            }}
            editingYear={editingYear}
          />
        );

      case "view-academic-years":
        return (
          <ViewAcademicYears
            onBack={() => setActiveContent("dashboard")}
            onEditYear={(yr) => {
              setEditingYear({
                id: yr.id,
                year_name: yr.year_name,
                status: yr.status,
              });
              setActiveContent("create-academic-year");
            }}
          />
        );

      case "create-section":
        return (
          <CreateSection
            onBack={() => {
              setEditingSection(null);
              setActiveContent("view-sections");
            }}
            editingSection={editingSection}
          />
        );

      case "assign-class-sections":
        return <AssignClassSections />;

      case "view-sections":
        return (
          <ViewSections
            onBack={() => setActiveContent("dashboard")}
            onEditSection={(sec) => {
              setEditingSection({
                id: sec.id,
                section_name: sec.section_name,
                status: sec.status || "active", // ✅ include status here
              });
              setActiveContent("create-section");
            }}
          />
        );

      case "view-students":
        return (
          <AllStudents
            onViewStudent={() => setActiveContent("view-student")}
            onEditStudent={() => setActiveContent("edit-student")}
            onAddStudent={() => setActiveContent("add-student")}
          />
        );
      case "view-student":
        return <ViewStudent onBack={() => setActiveContent("view-students")} />;

      case "upload-student-data":
        return (
          <UploadStudentData onBack={() => setActiveContent("view-students")} />
        );

      case "edit-student":
        return <EditStudent onBack={() => setActiveContent("view-students")} />;
      case "dashboard":
      default:
        return (
          <>
            {/* Top Bar */}
            <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3 shadow-sm border border-border">
              <h1 className="text-[16px] font-semibold text-black">
                Admin Dashboard
              </h1>
              <button className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                <UserCircle2 className="text-gray-600" size={18} />
              </button>
            </div>

            {/* Welcome Banner */}
            <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#0b0b1a] to-[#1c1c3a] px-5 py-4 shadow-sm">
              <h2 className="text-white font-semibold text-[16px]">
                Welcome Back, Admin
              </h2>
              <p className="text-white/60 text-[12px] mt-1">
                Have a productive day
              </p>
            </div>

            {/* Stats + Right Controls */}
            <div className="mt-4 grid grid-cols-12 gap-4">
              {/* Stats cards */}
              <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  title={2000}
                  subtitle="Total Students"
                  icon={<Users size={16} className="text-blue-500" />}
                />

                <StatCard
                  title={180}
                  subtitle="Total Teachers"
                  icon={<GraduationCap size={16} className="text-green-500" />}
                />

                <StatCard
                  title={95}
                  subtitle="Total Staff"
                  icon={<Briefcase size={16} className="text-purple-500" />}
                />
              </div>

              {/* Right controls */}

              <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-4">
                <div className="bg-white rounded-2xl border border-border shadow-sm px-4 py-3 flex items-center justify-between">
                  <span className="text-[14px] font-medium text-gray-700">
                    Academic year
                  </span>
                  <span className="text-[14px] text-gray-600">
                    2025 v to 2026 v
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-border shadow-sm px-4 py-3 flex items-center gap-2">
                  <Search size={18} className="text-gray-400" />
                  <input
                    placeholder="Search"
                    className="w-full outline-none text-[12px] placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Middle Widgets */}
            <div className="mt-4 grid grid-cols-12 gap-4">
              {/* Schedules */}
              <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-border shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[18px] font-semibold text-black">
                      Schedules
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-1">Jan 2026</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="h-7 w-7 rounded-full border border-border flex items-center justify-center">
                      <ChevronLeft size={14} />
                    </button>
                    <button className="h-7 w-7 rounded-full border border-border flex items-center justify-center">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Days */}
                <div className="mt-4 grid grid-cols-7 text-center text-[11px] text-gray-500 font-medium">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d) => (
                      <div key={d}>{d}</div>
                    )
                  )}
                </div>

                {/* Calendar numbers */}
                <div className="mt-3 grid grid-cols-7 gap-y-3 text-center text-[11px] text-gray-700">
                  {Array.from({ length: 31 }).map((_, idx) => {
                    const day = idx + 1;
                    const active = day === 10;
                    return (
                      <div
                        key={day}
                        className="flex items-center justify-center"
                      >
                        <div
                          className={`h-7 w-7 flex items-center justify-center rounded-full
                          ${
                            active ? "bg-primary text-white" : "hover:bg-muted"
                          }`}
                        >
                          {day}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attendance Donut */}
              <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-border shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[18px] font-semibold text-black">
                      Attendance
                    </h3>

                    {/* Tabs */}
                    <div className="mt-2 flex gap-3 text-[12px]">
                      {["student", "teacher", "staff"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab as any)}
                          className={`capitalize font-semibold ${
                            activeTab === tab
                              ? "text-black"
                              : "text-gray-400 hover:text-black"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Donut */}
                <div className="mt-8 flex items-center justify-center">
                  <div className="relative h-[220px] w-[220px]">
                    {(() => {
                      const total = present + absent;
                      const absentAngle = (absent / total) * 360;

                      // We want the GREY slice to END near right side (≈ 20deg)
                      const endAngle = 20;
                      const startAngle = endAngle - absentAngle;

                      return (
                        <>
                          {/* Outer ring */}
                          <div
                            className="h-full w-full rounded-full"
                            style={{
                              background: `conic-gradient(
                            #f25c2a 0deg ${startAngle}deg,
                            #e5e5e5 ${startAngle}deg ${endAngle}deg,
                            #f25c2a ${endAngle}deg 360deg
                        )`,
                            }}
                          />

                          {/* Inner hole */}
                          <div className="absolute inset-[60px] rounded-full bg-white" />

                          {/* Present bubble (perfect circle, left) */}
                          <div className="absolute left-[-15px] top-[80px] h-[70px] w-[70px] bg-white shadow-md rounded-full flex flex-col items-center justify-center text-[#b93c14] font-bold leading-tight">
                            <div className="text-[14px]">{present}</div>
                            <div className="text-[12px] font-semibold">
                              Present
                            </div>
                          </div>

                          {/* Absent bubble (perfect circle, aligned to grey end) */}
                          <div className="absolute right-[-15px] top-[95px] h-[70px] w-[70px] bg-white shadow-md rounded-full flex flex-col items-center justify-center text-[#b93c14] font-bold leading-tight">
                            <div className="text-[14px]">{absent}</div>
                            <div className="text-[12px] font-semibold">
                              Absent
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Notice Board */}
              <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-border shadow-sm p-4">
                <h3 className="text-[18px] font-semibold text-black text-center">
                  Notice Board
                </h3>
                <div className="mt-6 h-[180px] rounded-2xl bg-white" />
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-4 grid grid-cols-12 gap-4">
              {/* Upcoming Events */}
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-white rounded-2xl border border-border shadow-sm p-4">
                  <h3 className="text-[18px] font-semibold text-black">
                    Upcoming Events
                  </h3>

                  <div className="mt-3 space-y-3">
                    <EventCard
                      title="Parents teachers meeting"
                      date="10th Jan 2026"
                    />
                    <EventCard title="Anniversary" date="3rd mar 2026" />
                    <EventCard title="Half yearly exams" date="4th Apr 2026" />
                  </div>
                </div>
              </div>

              {/* Empty Panel */}
              <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-border shadow-sm p-4">
                <div className="h-[180px]" />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f7ebe7] flex">
      {/* ✅ SIDEBAR - Fixed and always visible */}
      <div className="flex-shrink-0">
        <Sidebar
          onContentChange={setActiveContent}
          activeContent={activeContent}
        />
      </div>

      {/* ✅ MAIN CONTENT - Changes based on sidebar selection */}
      <main className="flex-1 px-6 py-5 overflow-y-auto min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
}

function EventCard({ title, date }: { title: string; date: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-3 shadow-sm">
      <p className="text-[15px] font-semibold text-black">{title}</p>
      <p className="text-[13px] text-gray-500 mt-1">{date}</p>
    </div>
  );
}
