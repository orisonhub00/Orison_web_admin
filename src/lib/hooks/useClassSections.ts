import { getAdminToken } from "../getToken";
import { BASE_URL } from "../authClient";

export interface SectionType {
  id: string;
  section_name: string;
  status?: string;
}

export interface GetSectionsByClassResponse {
  success: boolean;
  statusCode: number;
  message: string;
  sections: SectionType[];
}

export async function assignSectionsToClass(
  class_id: string,
  section_ids: string[]
): Promise<{ success: boolean; statusCode: number; message: string }> {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(`${BASE_URL}/api/v1/class-sections/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ class_id, section_ids }),
  });
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to assign sections to class");
  return data;
}

export async function getSectionsByClass(
  class_id: string
): Promise<GetSectionsByClassResponse> {
  const token = getAdminToken();
  if (!token) throw new Error("No admin token found. Please login again.");
  const res = await fetch(
    `${BASE_URL}/api/v1/class-sections/by-class/${class_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  if (!res.ok || !data.success)
    throw new Error(data.message || "Failed to fetch sections for class");
  return data;
}
