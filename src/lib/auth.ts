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
  if (!token) throw new Error("No admin token found. Please login again.");

  const res = await fetch(`${BASE_URL}/api/v1/classes/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ class_name: className }), // ✅ no status
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to create class");
  return data;
}


export async function updateClass(
  id: string,
  className: string,
  status: "active" | "inactive"
) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No admin token found. Please login again.");
  }

  const res = await fetch(`${BASE_URL}/api/v1/classes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      class_name: className,
      status: status, // ✅ send status
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update class");
  }

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

  return data.sections.map((sec: any) => ({
    id: sec.id,
    section_name: sec.section_name,
    status: sec.status || "active",
  }));
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

export async function updateSection(
  id: string,
  sectionName: string,
  status: "active" | "inactive"
) {
  const token = getAuthToken();
  if (!token) throw new Error("No admin token found. Please login again.");

  const res = await fetch(`${BASE_URL}/api/v1/sections/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      section_name: sectionName,
      status: status, // ✅ include status like updateClass
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to update section");

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


// ===== Academic Years =====

export async function createAcademicYear(yearName: string) {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}/api/v1/academicyear/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ year_name: yearName }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to create academic year");
  }

  return data.data;
}

export async function getAcademicYears(search = "", page = 1, limit = 20) {
  const token = getAuthToken();

  const res = await fetch(
    `${BASE_URL}/api/v1/academicyear`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch academic years");
  }

  return data.data;
}

export async function getAcademicYearById(id: string) {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}/api/v1/academicyear/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch academic year");
  }

  return data.data;
}

export async function updateAcademicYear(
  id: string,
  yearName: string,
  status: "active" | "inactive"
) {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}/api/v1/academicyear/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      year_name: yearName,
      status,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update academic year");
  }

  return data.data;
}

export async function deleteAcademicYear(id: string) {
  const token = getAuthToken();

  const res = await fetch(`${BASE_URL}/api/v1/academicyear/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to delete academic year");
  }

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

return data.classes.map((cls: any) => ({
    id: cls.id,
    class_name: cls.class_name,
    status: cls.status || "active", // default fallback
  }));}