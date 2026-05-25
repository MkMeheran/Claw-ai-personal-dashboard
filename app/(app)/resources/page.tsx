'use client';

import { useEffect, useState } from 'react';
import { RetroCard } from '@/components/ui/RetroCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroInput } from '@/components/ui/RetroInput';
import { Link2, BookOpen, ExternalLink, Trash2, Plus, RefreshCw } from 'lucide-react';
import { useResourcesStore } from '@/store/useResourcesStore';
import { cn } from '@/lib/utils';

export default function ResourcesPage() {
  const { links, courses, isLoading, fetchLinks, fetchCourses, addLink, deleteLink, addCourse, updateCourseProgress, deleteCourse } = useResourcesStore();
  
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  
  const [newCourseName, setNewCourseName] = useState('');
  const [newCoursePlatform, setNewCoursePlatform] = useState('');

  useEffect(() => {
    fetchLinks();
    fetchCourses();
  }, []);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    await addLink({ url: newUrl, title: newTitle, category: newCategory });
    setNewUrl('');
    setNewTitle('');
    setNewCategory('');
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName) return;
    await addCourse({ name: newCourseName, platform: newCoursePlatform, progress_pct: 0 });
    setNewCourseName('');
    setNewCoursePlatform('');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-2xl uppercase tracking-wider text-stone-900">
            Resource Library
          </h1>
          <p className="font-bold text-stone-600 mt-1">
            Saved links, courses, and Drive integration.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Links Section */}
        <div className="space-y-4">
          <RetroCard title="Add Link" icon={Plus} accentColor="sky">
            <form onSubmit={handleAddLink} className="space-y-3">
              <RetroInput placeholder="URL (required)" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
              <RetroInput placeholder="Title (optional)" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              <div className="flex gap-2">
                <RetroInput placeholder="Category (e.g. Design)" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                <RetroButton type="submit" label="Save" variant="primary" />
              </div>
            </form>
          </RetroCard>

          <RetroCard title="Saved Links" icon={Link2} accentColor="sky">
            {isLoading ? (
              <div className="p-4 text-center font-bold text-stone-500">Loading...</div>
            ) : links.length === 0 ? (
              <div className="p-4 text-center font-bold text-stone-500 border-2 border-dashed border-stone-300 rounded">No saved links.</div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {links.map(link => (
                  <div key={link.id} className="p-3 bg-stone-50 border-2 border-stone-900 rounded flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {link.category && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-sky-200 text-sky-900 border border-stone-900 rounded">
                            {link.category}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-stone-900 truncate">{link.title || link.url}</h4>
                      <p className="text-xs font-[family-name:var(--font-space-mono)] text-stone-500 truncate">{link.url}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a href={link.url} target="_blank" rel="noreferrer" className="p-1.5 bg-stone-200 border-2 border-stone-900 rounded hover:bg-sky-400 active:translate-y-0.5">
                        <ExternalLink size={14} />
                      </a>
                      <button onClick={() => deleteLink(link.id)} className="p-1.5 bg-red-400 border-2 border-stone-900 rounded hover:bg-red-500 active:translate-y-0.5">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </RetroCard>
        </div>

        {/* Courses Section */}
        <div className="space-y-4">
          <RetroCard title="Add Course" icon={Plus} accentColor="lime">
            <form onSubmit={handleAddCourse} className="space-y-3">
              <RetroInput placeholder="Course Name (required)" value={newCourseName} onChange={e => setNewCourseName(e.target.value)} />
              <div className="flex gap-2">
                <RetroInput placeholder="Platform (e.g. Udemy)" value={newCoursePlatform} onChange={e => setNewCoursePlatform(e.target.value)} />
                <RetroButton type="submit" label="Add" variant="success" />
              </div>
            </form>
          </RetroCard>

          <RetroCard title="Course Tracker" icon={BookOpen} accentColor="lime">
            {courses.length === 0 ? (
              <div className="p-4 text-center font-bold text-stone-500 border-2 border-dashed border-stone-300 rounded">No courses tracked.</div>
            ) : (
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="p-3 bg-stone-50 border-[3px] border-stone-900 rounded" style={{ boxShadow: "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc" }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-stone-900 font-[family-name:var(--font-space-mono)] uppercase text-sm">{course.name}</h4>
                        <p className="text-xs text-stone-500 font-bold">{course.platform}</p>
                      </div>
                      <button onClick={() => deleteCourse(course.id)} className="text-stone-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-4 border-2 border-stone-900 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full bg-lime-400 border-r-2 border-stone-900 transition-all duration-300" style={{ width: `${course.progress_pct}%` }} />
                      </div>
                      <span className="font-black text-sm w-10 text-right">{course.progress_pct}%</span>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <button onClick={() => updateCourseProgress(course.id, Math.max(0, course.progress_pct - 10))} className="text-xs font-black border-2 border-stone-900 bg-stone-200 px-2 py-0.5 rounded active:translate-y-0.5">-10%</button>
                      <button onClick={() => updateCourseProgress(course.id, Math.min(100, course.progress_pct + 10))} className="text-xs font-black border-2 border-stone-900 bg-lime-400 px-2 py-0.5 rounded active:translate-y-0.5">+10%</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </RetroCard>
        </div>
      </div>
    </div>
  );
}
