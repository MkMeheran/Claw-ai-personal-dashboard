'use client';

import { useEffect, useState } from 'react';
import { RetroCard } from '@/components/ui/RetroCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroInput } from '@/components/ui/RetroInput';
import { RetroBadge } from '@/components/ui/RetroBadge';
import { BookOpen, Plus, Tag as TagIcon, Trash2, Edit3, X, Search, RefreshCw } from 'lucide-react';
import { useNotesStore, Note, Tag } from '@/store/useNotesStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { RetroModal } from '@/components/ui/RetroModal';

export default function NotesPage() {
  const { notes, tags, isLoading, fetchNotes, fetchTags, addNote, updateNote, deleteNote, addTag } = useNotesStore();
  const [search, setSearch] = useState('');
  
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#84cc16'); // default lime
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchTags(), fetchNotes()]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    fetchTags();
    fetchNotes();
  }, []);

  const handleSaveNote = async () => {
    if (!editContent.trim()) return;
    if (activeNote) {
      await updateNote(activeNote.id, { title: editTitle || null, content: editContent }, editTags);
    } else {
      await addNote(editTitle || null, editContent, editTags);
    }
    setEditTitle('');
    setEditContent('');
    setEditTags([]);
    setIsEditing(false);
    setActiveNote(null);
  };

  const openEditor = (note?: Note) => {
    if (note) {
      setActiveNote(note);
      setEditTitle(note.title || '');
      setEditContent(note.content);
      setEditTags(note.tags?.map(t => t.id) || []);
    } else {
      setActiveNote(null);
      setEditTitle('');
      setEditContent('');
      setEditTags([]);
    }
    setIsEditing(true);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    await addTag(newTagName, newTagColor);
    setNewTagName('');
    setIsTagModalOpen(false);
  };

  const filteredNotes = notes.filter(note => {
    const s = search.toLowerCase();
    const inTitle = note.title?.toLowerCase().includes(s);
    const inContent = note.content.toLowerCase().includes(s);
    const inTags = note.tags?.some(t => t.name.toLowerCase().includes(s));
    return inTitle || inContent || inTags;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-2xl uppercase tracking-wider text-stone-900">
            Second Brain
          </h1>
          <p className="font-bold text-stone-600 mt-1">
            Knowledge base and quick capture notes.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <RetroButton 
            onClick={handleRefresh} 
            icon={RefreshCw} 
            label=""
            className={isRefreshing ? 'animate-spin' : ''} 
          />
          <RetroButton onClick={() => setIsTagModalOpen(true)} label="Tags" icon={TagIcon} variant="stone" />
          <RetroButton onClick={() => openEditor()} label="New Note" icon={Plus} variant="success" />
        </div>
      </header>

      {/* Editor / Quick Capture Area */}
      {isEditing && (
        <RetroCard title={activeNote ? "Edit Note" : "Quick Capture"} icon={Edit3} accentColor="lime" className="border-lime-500">
          <div className="space-y-4">
            <RetroInput 
              placeholder="Note Title (Optional)" 
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              className="w-full min-h-[200px] px-3 py-2 text-sm font-bold text-stone-900 bg-stone-50 border-2 border-stone-900 rounded focus:outline-none focus:border-amber-500 font-[family-name:var(--font-space)] resize-y"
              style={{ boxShadow: "inset 2px 2px 0px #6b6b6b, inset -1px -1px 0px #e0d8cc" }}
              placeholder="Start typing in Markdown..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-stone-600">Tags:</span>
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    if (editTags.includes(tag.id)) {
                      setEditTags(editTags.filter(id => id !== tag.id));
                    } else {
                      setEditTags([...editTags, tag.id]);
                    }
                  }}
                  className={cn(
                    "px-2 py-1 text-xs font-bold border-2 rounded active:translate-y-0.5 transition-transform",
                    editTags.includes(tag.id) ? "border-stone-900 bg-stone-200" : "border-transparent bg-stone-100 hover:border-stone-300"
                  )}
                  style={{ color: tag.color }}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <RetroButton onClick={() => setIsEditing(false)} label="Cancel" variant="stone" />
              <RetroButton onClick={handleSaveNote} label="Save Note" variant="success" />
            </div>
          </div>
        </RetroCard>
      )}

      {/* Search and Notes List */}
      {!isEditing && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <RetroInput 
              className="pl-10"
              placeholder="Search notes, content, or tags..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {isLoading ? (
               <div className="col-span-full h-32 flex items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg">
                 Syncing second brain...
               </div>
            ) : filteredNotes.length === 0 ? (
               <div className="col-span-full h-32 flex items-center justify-center text-stone-500 font-bold border-4 border-dashed border-stone-300 rounded-lg">
                 {search ? "No notes found matching your search." : "Your second brain is empty. Capture something!"}
               </div>
            ) : (
              filteredNotes.map(note => (
                <div 
                  key={note.id}
                  className="bg-stone-50 border-[3px] border-stone-900 rounded-lg p-4 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 cursor-pointer"
                  style={{ boxShadow: "inset -3px -3px 0px #6b6b6b, inset 3px 3px 0px #e0d8cc" }}
                  onClick={() => openEditor(note)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-[family-name:var(--font-space-mono)] font-black text-lg text-stone-900 line-clamp-1">
                      {note.title || "Untitled Note"}
                    </h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {note.tags.map(tag => (
                        <span 
                          key={tag.id} 
                          className="text-[10px] px-1.5 py-0.5 rounded border border-stone-900 font-black uppercase tracking-wider"
                          style={{ backgroundColor: tag.color + '40', color: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="prose prose-sm prose-stone max-w-none line-clamp-4 font-[family-name:var(--font-space)] overflow-hidden">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {note.content}
                    </ReactMarkdown>
                  </div>

                  <div className="mt-auto pt-2 text-xs font-bold text-stone-400 border-t-2 border-stone-200">
                    {new Date(note.updated_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <RetroModal isOpen={isTagModalOpen} onClose={() => setIsTagModalOpen(false)} title="Manage Tags" accentColor="lime">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map(tag => (
              <div key={tag.id} className="flex items-center gap-2 px-2 py-1 border-2 border-stone-900 bg-stone-50 rounded">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                <span className="text-sm font-bold">{tag.name}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-stone-900 pt-4 space-y-3">
            <h4 className="font-[family-name:var(--font-space-mono)] font-black uppercase text-xs text-stone-500">Create New Tag</h4>
            <RetroInput 
              placeholder="Tag Name (e.g. ideas)" 
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-10 h-10 border-2 border-stone-900 rounded cursor-pointer"
              />
              <RetroButton onClick={handleCreateTag} label="Add Tag" variant="success" className="flex-1" />
            </div>
          </div>
        </div>
      </RetroModal>
    </div>
  );
}
