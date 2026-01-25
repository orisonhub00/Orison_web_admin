import { getAuthToken } from "./cookies";

const BASE_URL = "https://orison-server.vercel.app";

export async function adminLogin(email: string, password: string) {
  console.log("📡 Calling Login API...");
  console.log("➡️ Request payload:", { email, password });

  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  console.log("📥 Raw response status:", res.status);

  const data = await res.json();
  console.log("📥 API response data:", data);

  if (!res.ok || !data.success) {
    console.error("❌ Login API error:", data.message || "Login failed");
    throw new Error(data.message || "Login failed");
  }

  console.log("✅ Login API success");
  return data;
}


export async function createClass(className: string) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No admin token found. Please login again.");
  }

  console.log("📡 Calling Create Class API...");
  console.log("➡️ Request payload:", { class_name: className });

  const res = await fetch(`${BASE_URL}/api/v1/classes/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ class_name: className }),
  });

  console.log("📥 Raw response status:", res.status);
  const data = await res.json();
  console.log("📥 API response data:", data);

  if (!res.ok || !data.success) {
    console.error("❌ Create class error:", data.message || "Failed to create class");
    throw new Error(data.message || "Failed to create class");
  }

  console.log("✅ Class created successfully!");
  return data;
}


export async function updateClass(id: string, className: string) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No admin token found. Please login again.");
  }

  console.log("📡 Calling Update Class API...");
  console.log("➡️ Request payload:", { class_name: className });

  const res = await fetch(`${BASE_URL}/api/v1/classes/${id}`, {
    method: "PUT", // or PATCH if your backend expects PATCH
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ class_name: className }),
  });

  console.log("📥 Raw response status:", res.status);
  const data = await res.json();
  console.log("📥 API response data:", data);

  if (!res.ok || !data.success) {
    console.error("❌ Update class error:", data.message || "Failed to update class");
    throw new Error(data.message || "Failed to update class");
  }

  console.log("✅ Class updated successfully!");
  return data;
}


export async function getClassById(id: string) {
  const token = getAuthToken();
  if (!token) throw new Error("No admin token found. Please login again.");

  console.log("📡 Calling Get Class By ID API...", id);

  const res = await fetch(`${BASE_URL}/api/v1/classes/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("📥 Raw response status:", res.status);
  const data = await res.json();
  console.log("📥 API response data:", data);

  if (!res.ok || !data.success) {
    console.error("❌ Fetch class detail error:", data.message || "Failed to fetch class details");
    throw new Error(data.message || "Failed to fetch class details");
  }

  return data.class; // matches your API response
}


export async function deleteClass(id: string) {
  const token = getAuthToken();
  if (!token) throw new Error("No admin token found. Please login again.");

  console.log("📡 Calling Delete Class API...", id);

  const res = await fetch(`${BASE_URL}/api/v1/classes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // using your existing token pattern
    },
  });

  console.log("📥 Raw response status:", res.status);
  const data = await res.json();
  console.log("📥 API response data:", data);

  if (!res.ok || !data.success) {
    console.error("❌ Delete class error:", data.message || "Failed to delete class");
    throw new Error(data.message || "Failed to delete class");
  }

  console.log("✅ Class deleted successfully!");
  return data;
}


// --------------------- SECTIONS ---------------------
export async function getSections() {
  const token = getAuthToken();
  if (!token) throw new Error("No admin token found. Please login again.");

  const res = await fetch(`${BASE_URL}/api/v1/sections`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch sections");
  return data.sections || [];
}

export async function getSectionById(id: string) {
  const token = getAuthToken();
  if (!token) throw new Error("No admin token found. Please login again.");

  const res = await fetch(`${BASE_URL}/api/v1/sections/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch section");
  return data.section;
}

export async function createSection(sectionName: string) {
  const token = getAuthToken();
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
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to create section");
  return data;
}

export async function updateSection(id: string, sectionName: string) {
  const token = getAuthToken();
  if (!token) throw new Error("No admin token found. Please login again.");

  const res = await fetch(`${BASE_URL}/api/v1/sections/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ section_name: sectionName }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to update section");
  return data;
}

export async function deleteSection(id: string) {
  const token = getAuthToken();
  if (!token) throw new Error("No admin token found. Please login again.");

  const res = await fetch(`${BASE_URL}/api/v1/sections/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete section");
  return data;
}


export async function getClasses() {
  const token = getAuthToken();
  if (!token) throw new Error("No admin token found. Please login again.");

  console.log("📡 Calling Get Classes API...");

  const res = await fetch(`${BASE_URL}/api/v1/classes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log("📥 API response data:", data);

  if (!res.ok || !data.success) {
    console.error("❌ Fetch classes error:", data.message || "Failed to fetch classes");
    throw new Error(data.message || "Failed to fetch classes");
  }

  return data.classes || []; // adjust according to API response
}