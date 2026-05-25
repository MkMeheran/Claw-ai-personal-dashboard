'use client';

import { useEffect, useState } from 'react';
import { RetroCard } from '@/components/ui/RetroCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroInput } from '@/components/ui/RetroInput';
import { Activity, Calendar, TrendingUp } from 'lucide-react';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { logs, isLoading, fetchLogs, addLog } = useAnalyticsStore();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(5);
  const [focusScore, setFocusScore] = useState(5);
  const [mood, setMood] = useState('Neutral');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault();
    await addLog({ date, rating, focus_score: focusScore, mood, notes });
  };

  const chartData = [...logs].reverse().map(log => ({
    date: log.date.slice(5), // MM-DD
    rating: log.rating,
    focus: log.focus_score
  }));

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-2xl uppercase tracking-wider text-stone-900">
            Personal Analytics
          </h1>
          <p className="font-bold text-stone-600 mt-1">
            Track your daily productivity and mood.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Entry */}
        <RetroCard title="Daily Entry" icon={Calendar} accentColor="rose" className="lg:col-span-1">
          <form onSubmit={handleSaveLog} className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase text-stone-500 mb-1 block">Date</label>
              <RetroInput type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            
            <div>
              <label className="text-xs font-black uppercase text-stone-500 mb-1 block">Overall Rating (1-10): {rating}</label>
              <input type="range" min="1" max="10" value={rating} onChange={e => setRating(parseInt(e.target.value))} className="w-full accent-rose-500" />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-stone-500 mb-1 block">Focus Score (1-10): {focusScore}</label>
              <input type="range" min="1" max="10" value={focusScore} onChange={e => setFocusScore(parseInt(e.target.value))} className="w-full accent-amber-500" />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-stone-500 mb-1 block">Mood</label>
              <select 
                value={mood} 
                onChange={e => setMood(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold text-stone-900 bg-stone-50 border-2 border-stone-900 rounded focus:outline-none focus:border-amber-500 font-[family-name:var(--font-space)]"
                style={{ boxShadow: "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc" }}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Neutral">Neutral</option>
                <option value="Poor">Poor</option>
                <option value="Terrible">Terrible</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase text-stone-500 mb-1 block">Notes</label>
              <textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold text-stone-900 bg-stone-50 border-2 border-stone-900 rounded focus:outline-none focus:border-amber-500 font-[family-name:var(--font-space)] resize-y min-h-[80px]"
                style={{ boxShadow: "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc" }}
              />
            </div>

            <RetroButton type="submit" label="Save Log" variant="primary" className="w-full" />
          </form>
        </RetroCard>

        {/* Trends */}
        <RetroCard title="Trends" icon={TrendingUp} accentColor="rose" className="lg:col-span-2">
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d6d3d1" />
                  <XAxis dataKey="date" tick={{ fontFamily: 'var(--font-space-mono)', fontSize: 12, fill: '#44403c' }} />
                  <YAxis domain={[0, 10]} tick={{ fontFamily: 'var(--font-space-mono)', fontSize: 12, fill: '#44403c' }} />
                  <Tooltip contentStyle={{ fontFamily: 'var(--font-space)', fontWeight: 'bold', border: '3px solid #1c1917', borderRadius: '0.5rem', boxShadow: 'inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc' }} />
                  <Line type="monotone" dataKey="rating" stroke="#f43f5e" strokeWidth={3} dot={{ stroke: '#1c1917', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} name="Overall Rating" />
                  <Line type="monotone" dataKey="focus" stroke="#f59e0b" strokeWidth={3} dot={{ stroke: '#1c1917', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} name="Focus Score" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg">
                Log a few days to see trends.
              </div>
            )}
          </div>
        </RetroCard>
      </div>

      <RetroCard title="Recent Logs" icon={Activity} accentColor="stone">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-stone-900 bg-stone-200">
                <th className="p-3 font-black uppercase text-xs">Date</th>
                <th className="p-3 font-black uppercase text-xs">Rating</th>
                <th className="p-3 font-black uppercase text-xs">Focus</th>
                <th className="p-3 font-black uppercase text-xs">Mood</th>
                <th className="p-3 font-black uppercase text-xs">Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b-2 border-stone-300 hover:bg-stone-100">
                  <td className="p-3 font-bold font-[family-name:var(--font-space-mono)]">{log.date}</td>
                  <td className="p-3 font-black text-rose-600">{log.rating}/10</td>
                  <td className="p-3 font-black text-amber-600">{log.focus_score}/10</td>
                  <td className="p-3 font-bold text-sm">{log.mood}</td>
                  <td className="p-3 font-bold text-xs max-w-xs truncate">{log.notes}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center font-bold text-stone-500">No logs yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </RetroCard>
    </div>
  );
}
