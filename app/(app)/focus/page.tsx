'use client';

import { useEffect, useState } from 'react';
import { RetroCard } from '@/components/ui/RetroCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroInput } from '@/components/ui/RetroInput';
import { Timer, Play, Square, Save, BarChart, RefreshCw, Trash2 } from 'lucide-react';
import { useFocusStore } from '@/store/useFocusStore';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FocusPage() {
  const { sessions, isLoading, fetchSessions, addSession, deleteSession } = useFocusStore();
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [subject, setSubject] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSessions();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const handleSessionComplete = async () => {
    if (!subject.trim()) return alert("Please enter a subject name first.");
    await addSession({
      subject,
      duration_minutes: 25 - Math.ceil(timeLeft / 60),
      session_type: 'pomodoro',
      ended_at: new Date().toISOString()
    });
    setTimeLeft(25 * 60);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const chartData = sessions.reduce((acc: any[], session) => {
    const existing = acc.find(x => x.subject === session.subject);
    if (existing) {
      existing.minutes += session.duration_minutes;
    } else {
      acc.push({ subject: session.subject, minutes: session.duration_minutes });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-2xl uppercase tracking-wider text-stone-900">
            Focus Tracker
          </h1>
          <p className="font-bold text-stone-600 mt-1">
            Pomodoro sessions and study logs.
          </p>
        </div>
        <RetroButton 
          onClick={handleRefresh} 
          icon={RefreshCw} 
          label=""
          className={isRefreshing ? 'animate-spin' : ''} 
        />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RetroCard title="Pomodoro Timer" icon={Timer} accentColor="orange">
          <div className="flex flex-col items-center justify-center p-6 space-y-6">
            <RetroInput 
              placeholder="What are you working on?" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-center text-lg"
            />
            
            <div className="text-7xl font-black font-[family-name:var(--font-space-mono)] tracking-widest text-stone-900 drop-shadow-md">
              {formatTime(timeLeft)}
            </div>

            <div className="flex gap-4">
              <RetroButton 
                onClick={toggleTimer} 
                label={isActive ? "Pause" : "Start"} 
                icon={isActive ? Square : Play} 
                variant={isActive ? "stone" : "success"} 
              />
              <RetroButton 
                onClick={resetTimer} 
                label="Reset" 
                variant="danger" 
              />
            </div>
            
            {!isActive && timeLeft < 25 * 60 && (
              <RetroButton 
                onClick={handleSessionComplete} 
                label="Log Partial Session" 
                icon={Save} 
                variant="primary" 
              />
            )}
          </div>
        </RetroCard>

        <RetroCard title="Weekly Summary" icon={BarChart} accentColor="orange">
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d6d3d1" />
                  <XAxis dataKey="subject" tick={{ fontFamily: 'var(--font-space-mono)', fontSize: 12, fill: '#44403c' }} />
                  <YAxis tick={{ fontFamily: 'var(--font-space-mono)', fontSize: 12, fill: '#44403c' }} />
                  <Tooltip contentStyle={{ fontFamily: 'var(--font-space)', fontWeight: 'bold', border: '3px solid #1c1917', borderRadius: '0.5rem', boxShadow: 'inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc' }} />
                  <Bar dataKey="minutes" fill="#fb923c" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg">
                Complete a session to see data.
              </div>
            )}
          </div>
        </RetroCard>
      </div>

      <RetroCard title="Session Log" accentColor="stone">
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {sessions.map(session => (
            <div key={session.id} className="flex justify-between items-center p-3 border-2 border-stone-900 bg-stone-50 rounded" style={{ boxShadow: "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc" }}>
              <div className="flex flex-col">
                <span className="font-bold text-stone-900">{session.subject}</span>
                <span className="text-xs text-stone-500 font-[family-name:var(--font-space-mono)]">{new Date(session.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-black font-[family-name:var(--font-space-mono)] text-orange-600">
                  {session.duration_minutes}m
                </div>
                <button 
                  onClick={() => {
                    if (confirm("Delete this focus session?")) {
                      deleteSession(session.id);
                    }
                  }}
                  className="text-stone-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </RetroCard>
    </div>
  );
}
