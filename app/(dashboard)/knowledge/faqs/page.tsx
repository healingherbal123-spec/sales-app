import { HelpCircle } from "lucide-react";

export default function FAQsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">FAQs</h1>
        <p className="text-sm text-slate-500">Frequently asked questions.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">FAQs coming soon...</p>
      </div>
    </div>
  );
}