import React from 'react';
import { 
  PhoneCall, 
  CheckCircle2, 
  CalendarCheck, 
  AlertCircle, 
  TrendingUp 
} from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsGridProps {
  stats: DashboardStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const completionRate = Math.round((stats.completedCalls / (stats.totalCalls || 1)) * 100);
  const bookingRate = Math.round((stats.appointmentsBooked / (stats.completedCalls || 1)) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
      {/* 1. Total Calls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between h-full hover:border-slate-300 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
              Total Calls
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {stats.totalCalls}
            </span>
            <span className="inline-flex items-center text-xs sm:text-sm font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +14%
            </span>
          </div>
        </div>
        <p className="mt-3 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-500 font-medium">
          Outbound inquiries dialed
        </p>
      </div>

      {/* 2. Completed Calls */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between h-full hover:border-slate-300 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
              Completed Calls
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {stats.completedCalls}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-800">
              {completionRate}% rate
            </span>
          </div>
        </div>
        <p className="mt-3 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-500 font-medium">
          Avg duration: <span className="font-semibold text-slate-700">{stats.avgCallDuration}</span>
        </p>
      </div>

      {/* 3. Appointments Booked (Tentative) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between h-full hover:border-slate-300 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
              Appointments Booked
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CalendarCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {stats.appointmentsBooked}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-800">
              {bookingRate}% conversion
            </span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-amber-800">
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
          Tentative (pending clinic sync)
        </div>
      </div>

      {/* 4. Follow-Ups Required */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between h-full hover:border-slate-300 transition-all">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
              Follow-Ups Needed
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {stats.followUpsRequired}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800">
              Triage queue
            </span>
          </div>
        </div>
        <p className="mt-3 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-500 font-medium">
          Surgeon referral review
        </p>
      </div>
    </div>
  );
};
