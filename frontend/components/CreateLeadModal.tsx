"use client";

import { useState } from "react";
import { X, Building2, Globe, User, Mail, MapPin, DollarSign, Sparkles } from "lucide-react";
import { createLead } from "../lib/api";
import { Lead } from "../types";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCreated: (lead: Lead) => void;
}

export default function CreateLeadModal({ isOpen, onClose, onLeadCreated }: CreateLeadModalProps) {
  const [form, setForm] = useState({
    company_name: "",
    website: "",
    industry: "Enterprise SaaS",
    location: "San Francisco, CA",
    contact_name: "",
    email: "",
    company_size: "100-250",
    annual_revenue: "$10M-$25M",
    deal_value: 35000,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newLead = await createLead(form);
      onLeadCreated(newLead);
      onClose();
    } catch (err) {
      alert("Failed to create lead. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillDemo = () => {
    setForm({
      company_name: "Nexus Dynamics AI",
      website: "https://nexusdynamics.ai",
      industry: "AI & Cybersecurity",
      location: "Seattle, WA",
      contact_name: "Sarah Jenkins",
      email: "s.jenkins@nexusdynamics.ai",
      company_size: "250-500",
      annual_revenue: "$25M-$50M",
      deal_value: 50000,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Add B2B Prospect Lead</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Acme SaaS Inc."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Website URL</label>
              <input
                type="text"
                required
                placeholder="https://company.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Industry</label>
              <input
                type="text"
                required
                placeholder="Enterprise SaaS"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Location</label>
              <input
                type="text"
                required
                placeholder="San Francisco, CA"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Contact Name</label>
              <input
                type="text"
                required
                placeholder="Sarah Jenkins (VP Sales)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                value={form.contact_name}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Contact Email</label>
              <input
                type="email"
                required
                placeholder="sarah@company.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Company Size</label>
              <select
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                value={form.company_size}
                onChange={(e) => setForm({ ...form, company_size: e.target.value })}
              >
                <option value="10-50">10-50</option>
                <option value="50-200">50-200</option>
                <option value="250-500">250-500</option>
                <option value="500-1000">500-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Annual Revenue</label>
              <select
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                value={form.annual_revenue}
                onChange={(e) => setForm({ ...form, annual_revenue: e.target.value })}
              >
                <option value="$1M-$10M">$1M-$10M</option>
                <option value="$10M-$25M">$10M-$25M</option>
                <option value="$25M-$50M">$25M-$50M</option>
                <option value="$50M-$100M">$50M-$100M</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Deal Value ($)</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                value={form.deal_value}
                onChange={(e) => setForm({ ...form, deal_value: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Demo Prospect</span>
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-cyan-500/20"
              >
                {loading ? "Creating..." : "Save Prospect"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
