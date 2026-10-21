import React, { useState } from 'react';
import { Announcement } from '../types';
import { Megaphone, Search, Filter, ShieldCheck, Clock, AlertTriangle, Calendar } from 'lucide-react';

interface AnnouncementsTabProps {
  announcements: Announcement[];
}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({ announcements }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Schedule', 'Safety', 'Facilities', 'Emergency', 'General'];

  const filtered = announcements.filter((ann) => {
    const matchCategory = selectedCategory === 'all' || ann.category === selectedCategory;
    const matchSearch =
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div
        className="bg-orange-700 bg-linear-to-r from-orange-700 via-amber-600 to-orange-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ backgroundColor: '#c2410c' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-200">
            <Megaphone className="w-4 h-4" />
            <span>Devasthan Trust & Municipal Corporation Advisories</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            Official Yatra Announcements (अधिकृत सूचना व वेळापत्रक)
          </h2>
          <p className="text-xs text-orange-100 max-w-xl">
            Live schedule notifications, Indrayani River safety warnings, special bus timings, and battery cart updates.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? 'All Announcements' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search advisories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-stone-500 text-xs">
            No announcements found matching the selected filter.
          </div>
        ) : (
          filtered.map((ann) => (
            <div
              key={ann.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition ${
                ann.priority === 'urgent'
                  ? 'border-red-400 bg-red-50/20'
                  : ann.priority === 'high'
                  ? 'border-orange-300'
                  : 'border-stone-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      ann.priority === 'urgent'
                        ? 'bg-red-600 text-white animate-pulse'
                        : ann.priority === 'high'
                        ? 'bg-orange-500 text-white'
                        : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {ann.priority} Priority
                  </span>
                  <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded">
                    {ann.category}
                  </span>
                  <h3 className="text-base font-bold text-stone-900">{ann.title}</h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(ann.published_at).toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{ann.content}</p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Issued by Alandi Devasthan Trust Information Desk</span>
                </div>
                <span className="font-mono text-stone-400">Notice #{ann.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
