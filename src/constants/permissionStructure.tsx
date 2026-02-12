
import { PERMISSIONS } from "./permissions";
import { 
  Gauge, 
  UserSquare2, 
  LibraryBig, 
  UserCog, 
  CalendarCheck2, 
  NotebookPen, 
  CalendarClock, 
  UsersRound, 
  FileCheck2, 
  Wallet, 
  Utensils 
} from "lucide-react";

export const PERMISSION_STRUCTURE = [
  {
    id: PERMISSIONS.DASHBOARD,
    label: "Dashboard",
    icon: <Gauge size={18} />,
    actions: [
      { id: "view", label: "View Dashboard" }
    ]
  },
  {
    id: PERMISSIONS.STUDENTS,
    label: "Students",
    icon: <UserSquare2 size={18} />,
    subModules: [
      {
        id: PERMISSIONS.STUDENT_LIST,
        label: "Student List",
        actions: [
            { id: "view", label: "View Students" },
            { id: "delete", label: "Delete Student" }
        ]
      },
      {
        id: PERMISSIONS.STUDENT_ADMISSION,
        label: "Student Admission",
        actions: [
            { id: "create", label: "Add Student" },
            { id: "edit", label: "Edit Student" }
        ]
      }
    ]
  },
  {
    id: PERMISSIONS.ACADEMICS,
    label: "Academics",
    icon: <LibraryBig size={18} />,
    subModules: [
      {
        id: PERMISSIONS.CLASSES, 
        label: "Classes",
        actions: [
            { id: "view", label: "View Classes" },
            { id: "create", label: "Create Class" },
            { id: "edit", label: "Edit Class" },
            { id: "delete", label: "Delete Class" }
        ]
      },
      {
        id: PERMISSIONS.SECTIONS,
        label: "Sections",
        actions: [
            { id: "view", label: "View Sections" },
            { id: "create", label: "Create Section" },
            { id: "edit", label: "Edit Section" },
            { id: "delete", label: "Delete Section" }
        ]
      },
      {
        id: PERMISSIONS.ACADEMIC_YEARS,
        label: "Academic Years",
        actions: [
            { id: "view", label: "View Years" },
            { id: "create", label: "Create Year" },
            { id: "edit", label: "Edit Year" },
            { id: "delete", label: "Delete Year" }
        ]
      },
      {
        id: PERMISSIONS.ASSIGN_CLASS_SECTIONS,
        label: "Assign Class Sections",
        actions: [
            { id: "view", label: "View" },
            { id: "create", label: "Create/Edit" }
        ]
      }
    ]
  },
  {
    id: PERMISSIONS.TEACHERS,
    label: "Teachers",
    icon: <UserCog size={18} />,
    actions: [{ id: "view", label: "View Teachers" }, { id: "create", label: "Add Teacher" }]
  },
  {
    id: PERMISSIONS.ATTENDANCE,
    label: "Attendance",
    icon: <CalendarCheck2 size={18} />,
    actions: [{ id: "view", label: "View Attendance" }, { id: "create", label: "Mark Attendance" }]
  },
  {
      id: PERMISSIONS.SUBJECTS,
      label: "Subjects",
      icon: <NotebookPen size={18} />,
      actions: [{ id: "view", label: "View Subjects" }, { id: "create", label: "Add Subject" }]
  },
  {
      id: PERMISSIONS.TIMETABLE,
      label: "Timetable",
      icon: <CalendarClock size={18} />,
      actions: [{ id: "view", label: "View Timetable" }, { id: "create", label: "Manage Timetable" }]
  },
  {
      id: PERMISSIONS.STAFF,
      label: "Staff",
      icon: <UsersRound size={18} />,
      actions: [{ id: "view", label: "View Staff" }, { id: "create", label: "Add Staff" }]
  },
  {
      id: PERMISSIONS.EXAMS,
      label: "Exams",
      icon: <FileCheck2 size={18} />,
      actions: [{ id: "view", label: "View Exams" }, { id: "create", label: "Manage Exams" }]
  },
  {
      id: PERMISSIONS.FEES,
      label: "Fees",
      icon: <Wallet size={18} />,
      actions: [{ id: "view", label: "View Fees" }, { id: "create", label: "Manage Fees" }]
  },
  {
      id: PERMISSIONS.FOOD,
      label: "Food",
      icon: <Utensils size={18} />,
      actions: [{ id: "view", label: "View Food" }, { id: "create", label: "Manage Food" }]
  },
  {
      id: PERMISSIONS.ROLES,
      label: "Roles & Permissions",
      icon: <UserCog size={18} />,
      actions: [{ id: "view", label: "View Roles" }, { id: "create", label: "Manage Roles" }]
  }
];
