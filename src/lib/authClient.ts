// src/lib/authClient.ts
import {
  getAdminToken,
  setAdminToken,
  removeAdminToken,
} from "@/lib/getToken";
import { Toaster } from "react-hot-toast";


import toast from "react-hot-toast";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4447";

// Example: Admin Login
export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) 
    
    throw new Error(data.message || "Login failed");

    toast.success("Login successful");
  setAdminToken(data.token); // Store token in localStorage
  return data;
}

// Example: Get Classes
export async function getClasses(search = "", page = 1, limit = 10) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(`${BASE_URL}/api/v1/classes?search=${search}&page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to fetch classes");
  
  return {
    classes: data.classes.map((cls: any) => ({
      id: cls.id,
      class_name: cls.class_name,
      status: cls.status || "active",
      section_count: cls.section_count || 0,
      student_count: cls.student_count || 0,
    })),
    total: data.total || 0
  };
}

export async function createClass(className: string) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(`${BASE_URL}/api/v1/classes/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ class_name: className }),
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to create class");
  toast.success("Class created successfully");
  return data;
}

export async function updateClass(
  id: string,
  className: string,
  status: "active" | "inactive"
) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(`${BASE_URL}/api/v1/classes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ class_name: className, status }),
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to update class");
  return data;
}

export async function getClassById(id: string) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(`${BASE_URL}/api/v1/classes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to fetch class details");
  return data.class;
}

export async function deleteClass(id: string) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(`${BASE_URL}/api/v1/classes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to delete class");
  return data;
}

export async function getSections() {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(`${BASE_URL}/api/v1/sections`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to fetch sections");
  return data.sections.map((sec: any) => ({
    id: sec.id,
    section_name: sec.section_name,
    status: sec.status || "active",
  }));
}

/* ---------------- ROLES & PERMISSIONS ---------------- */

export async function getRoles() {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found");
  const res = await fetch(`${BASE_URL}/api/v1/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch roles");
  return data.roles;
}

export async function createRole(roleData: { name: string; description?: string; permissions?: any[] }) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found");
  const res = await fetch(`${BASE_URL}/api/v1/roles/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(roleData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to create role");
  return data.role;
}

export async function getRolePermissions(roleId: string) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found");
  const res = await fetch(`${BASE_URL}/api/v1/roles/${roleId}/permissions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch permissions");
  return data.permissions;
}

export async function updateRolePermissions(roleId: string, permissions: any[]) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found");
  const res = await fetch(`${BASE_URL}/api/v1/roles/${roleId}/permissions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ permissions }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to update permissions");
  return data.permissions;
}

export async function getSectionById(id: string) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(`${BASE_URL}/api/v1/sections/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to fetch section");
  return data.section;
}

export async function createSection(sectionName: string) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(`${BASE_URL}/api/v1/sections/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ section_name: sectionName }),
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to create section");
  return data;
}

export async function updateSection(
  id: string,
  sectionName: string,
  status: "active" | "inactive"
) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(`${BASE_URL}/api/v1/sections/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ section_name: sectionName, status }),
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to update section");
  return data;
}

export async function deleteSection(id: string) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(`${BASE_URL}/api/v1/sections/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to delete section");
  toast.success("Section deleted successfully");
  return data;
}

export async function createAcademicYear(yearName: string) {
  const token = getAdminToken();
  const res = await fetch(`${BASE_URL}/api/v1/academicyear/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ year_name: yearName }),
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to create academic year");

  toast.success("Academic year created successfully");
  return data.data;
}

export async function getAcademicYears(search = "", page = 1, limit = 20) {
  const token = getAdminToken();
  const res = await fetch(`${BASE_URL}/api/v1/academicyear`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to fetch academic years");
  return data.data;
}

export async function getAcademicYearById(id: string) {
  const token = getAdminToken();
  const res = await fetch(`${BASE_URL}/api/v1/academicyear/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to fetch academic year");
  return data.data;
}

export async function updateAcademicYear(
  id: string,
  yearName: string,
  status: "active" | "inactive"
) {
  const token = getAdminToken();
  const res = await fetch(`${BASE_URL}/api/v1/academicyear/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ year_name: yearName, status }),
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to update academic year");
  return data.data;
}

export async function deleteAcademicYear(id: string) {
  const token = getAdminToken();
  const res = await fetch(`${BASE_URL}/api/v1/academicyear/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to delete academic year");
  toast.success("Academic year deleted successfully");
  return data;
}


export interface GetSectionsByClassResponse {
  success: boolean;
  sections: {
    id: string;
    section_name: string;
    status?: "active" | "inactive";
  }[];
}

export async function getSectionsByClass(
  classId: string
): Promise<GetSectionsByClassResponse> {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found");

  const res = await fetch(
    `${BASE_URL}/api/v1/classSections/by-class/${classId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch class sections");
  }
  return data;
}

export async function assignSectionsToClass(
  classId: string,
  sectionIds: string[]
) {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found");

  const res = await fetch(`${BASE_URL}/api/v1/classSections/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      class_id: classId,
      section_ids: sectionIds,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to assign sections");
  }
toast.success("Sections assigned to class successfully");
  return data;
}

// ---------- Profile ----------
export async function getProfile() {
  const token = getAdminToken();
  const res = await fetch(`${BASE_URL}/api/v1/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

export async function updateProfile(data: { name: string; phone: string }) {
  const token = getAdminToken();
  const res = await fetch(`${BASE_URL}/api/v1/profile/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---------- Registration ----------
export async function getPublicRoles() {
  const res = await fetch(`${BASE_URL}/api/v1/registration/roles`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch roles");
  return data.roles;
}

export async function registerUser(formData: FormData) {
  const res = await fetch(`${BASE_URL}/api/v1/registration/register`, {
    method: "POST",
    body: formData, // No Authorization header needed
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Registration failed");
  return data;
}
