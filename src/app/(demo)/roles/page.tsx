"use client";

import { useEffect, useState } from "react";
import { Plus, Shield, Edit2, ShieldCheck } from "lucide-react";
import { getRoles } from "@/lib/authClient";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RoleType {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage system access roles</p>
        </div>
        <Link
          href="/roles/create"
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Create Role
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading roles...</div>
      ) : roles.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed">
          <Shield size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No Roles Found</h3>
          <p className="text-gray-500 text-sm">Create a role to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Shield size={24} />
                </div>
                {/* <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={18} />
                </button> */}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {role.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {role.description || "No description provided."}
              </p>

              <div className="flex items-center gap-2 pt-4 border-t">
                <button
                  onClick={() => router.push(`/roles/${role.id}/permissions`)}
                  className="flex-1 flex items-center justify-center gap-2 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg transition-colors border"
                >
                  <ShieldCheck size={14} />
                  Permissions
                </button>
                {/* <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg">
                  <Edit2 size={16} />
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
