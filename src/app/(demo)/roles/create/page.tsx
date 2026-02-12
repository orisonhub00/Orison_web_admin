"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRole } from "@/lib/authClient";
import toast from "react-hot-toast";
import { ChevronLeft, Loader2, Check } from "lucide-react";
import { PERMISSION_STRUCTURE } from "@/constants/permissionStructure";



export default function CreateRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Flat structure for permissions: { "students.view": true, "classes.create": false }
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  const togglePermission = (module: string, action: string) => {
    const key = `${module}.${action}`;
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAllInModule = (module: string, actions: { id: string }[], forceState?: boolean) => {
    setPermissions(prev => {
      const next = { ...prev };
      const allActive = actions.every(a => prev[`${module}.${a.id}`]);
      const targetState = forceState !== undefined ? forceState : !allActive;
      
      actions.forEach(a => {
        next[`${module}.${a.id}`] = targetState;
      });
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Role Name is required");

    try {
      setLoading(true);

      // Transform generic permissions map to API format
      // API expects: [{ module: "students", can_view: true, can_create: false... }]
      const apiPermissions: any[] = [];
      const modulesProcessed = new Set<string>();

      // Iterate through our structure to build the API payload
      PERMISSION_STRUCTURE.forEach(group => {
          if (group.subModules) {
              group.subModules.forEach(sub => {
                  const moduleName = sub.id;
                  apiPermissions.push({
                      module: moduleName,
                      can_view: permissions[`${moduleName}.view`] || false,
                      can_create: permissions[`${moduleName}.create`] || false,
                      can_edit: permissions[`${moduleName}.edit`] || false,
                      can_delete: permissions[`${moduleName}.delete`] || false,
                  });
              });
          } else if (group.actions) {
              const moduleName = group.id;
               apiPermissions.push({
                  module: moduleName,
                  can_view: permissions[`${moduleName}.view`] || false,
                  can_create: permissions[`${moduleName}.create`] || false,
                  can_edit: permissions[`${moduleName}.edit`] || false,
                  can_delete: permissions[`${moduleName}.delete`] || false,
              });
          }
      });
      
      // Also include "roles" module by default for super admins possibly, or manual add? 
      // For now, let's stick to the visible UI modules.

      await createRole({ 
          ...formData, 
          permissions: apiPermissions 
      });
      
      toast.success("Role created successfully");
      router.push("/roles");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft size={16} /> Back to Roles
      </button>

      <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Create New Role</h1>
        <p className="text-gray-500 text-sm mb-6">
          Define role details and toggle access permissions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Content Editor"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Describe the responsibilities of this role..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold text-gray-900 mb-4">Access Permissions</h2>
            
            <div className="space-y-6">
              {PERMISSION_STRUCTURE.map((group) => (
                <div key={group.id} className="border rounded-xl overflow-hidden">
                   {/* Group Header */}
                   <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium text-gray-800">
                         {group.icon}
                         {group.label}
                      </div>
                      
                      {group.actions && (
                          <button 
                            type="button" 
                            onClick={() => toggleAllInModule(group.id, group.actions!)}
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            Toggle All
                          </button>
                      )}
                   </div>

                   {/* Actions / Submodules */}
                   <div className="p-4 bg-white">
                      {group.subModules ? (
                          <div className="grid gap-6">
                              {group.subModules.map(sub => (
                                  <div key={sub.id} className="space-y-2">
                                      <div className="flex items-center justify-between">
                                          <h4 className="text-sm font-medium text-gray-700">{sub.label}</h4>
                                          <button 
                                              type="button" 
                                              onClick={() => toggleAllInModule(sub.id, sub.actions)}
                                              className="text-xs text-gray-500 hover:text-primary"
                                          >
                                              All {sub.label}
                                          </button>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                          {sub.actions.map(action => {
                                              const key = `${sub.id}.${action.id}`;
                                              const isActive = permissions[key];
                                              return (
                                                  <button
                                                    key={action.id}
                                                    type="button"
                                                    onClick={() => togglePermission(sub.id, action.id)}
                                                    className={`
                                                      px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5
                                                      ${isActive 
                                                          ? "bg-primary text-white border-primary" 
                                                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}
                                                    `}
                                                  >
                                                      {isActive && <Check size={12} />}
                                                      {action.label}
                                                  </button>
                                              );
                                          })}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="flex flex-wrap gap-3">
                              {group.actions?.map(action => {
                                  const key = `${group.id}.${action.id}`;
                                  const isActive = permissions[key];
                                  return (
                                      <button
                                        key={action.id}
                                        type="button"
                                        onClick={() => togglePermission(group.id, action.id)}
                                        className={`
                                          px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5
                                          ${isActive 
                                              ? "bg-primary text-white border-primary" 
                                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}
                                        `}
                                      >
                                          {isActive && <Check size={12} />}
                                          {action.label}
                                      </button>
                                  );
                              })}
                          </div>
                      )}
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 sticky bottom-4">
            <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100 flex gap-3">
                <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                Cancel
                </button>
                <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Create Role
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
