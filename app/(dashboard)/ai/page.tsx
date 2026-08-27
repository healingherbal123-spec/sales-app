import { Bot, Activity, CheckCircle, Clock } from "lucide-react";

export default function AIAgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Agents</h1>
        <p className="text-sm text-slate-500">Manage your AI workforce.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Atlas</p>
              <p className="text-xs text-slate-500">Sales AI</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-600">Active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Bot className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium">Mira</p>
              <p className="text-xs text-slate-500">Inventory AI</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-600">Active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Bot className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Nova</p>
              <p className="text-xs text-slate-500">Delivery AI</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-slate-600">Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
}