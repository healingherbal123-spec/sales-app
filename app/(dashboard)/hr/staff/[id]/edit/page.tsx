"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditStaffPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/hr/staff/${id}`}>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Staff</h1>
          <p className="text-sm text-slate-500">Edit staff member information.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <p className="text-slate-500 text-center py-8">Edit form coming soon...</p>
        <div className="flex justify-end gap-3 mt-4">
          <Link href={`/hr/staff/${id}`}>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
              Cancel
            </button>
          </Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}