"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getRolePermissions, updateRolePermissions } from "@/lib/authClient";
import toast from "react-hot-toast";
import { ChevronLeft, Save, Loader2, Check } from "lucide-react";
import { PERMISSION_STRUCTURE } from "@/constants/permissionStructure";

export default function RolePermissionsPage() {
  const router = useRouter();
  const params = useParams();
  const roleId = params.id as string;

  // Flattened permissions state: { "students.view": true, "classes.create": false }
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, [roleId]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const data = await getRolePermissions(roleId);
      
      const permMap: Record<string, boolean> = {};
      data.forEach((p: any) => {
          if (p.can_view) permMap[`${p.module}.view`] = true;
          if (p.can_create) permMap[`${p.module}.create`] = true;
          if (p.can_edit) permMap[`${p.module}.edit`] = true;
          if (p.can_delete) permMap[`${p.module}.delete`] = true;
      });
      
      setPermissions(permMap);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Transform flattened permissions map back to API format
      const apiPermissions: any[] = [];

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

      await updateRolePermissions(roleId, apiPermissions);
      toast.success("Permissions updated successfully");
      router.push("/roles");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
       <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Configure Permissions</h1>
            <p className="text-gray-500 text-xs">Manage access for this role</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-70 flex items-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500 flex justify-center">
              <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
             <div className="p-6 space-y-6">
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
        )}
      </div>
    </div>
  );
}
