'use client';

import { useState, useRef, useEffect } from 'react';
import { RetroCard } from '@/components/ui/RetroCard';
import { RetroInput } from '@/components/ui/RetroInput';
import { RetroButton } from '@/components/ui/RetroButton';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ClawPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hello! I'm Claw, your personal AI companion. How can I help you organize your life today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session?.access_token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.response 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: `Error: ${error.message || 'Failed to connect to Claw.'}` 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto space-y-4">
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-400 border-[3px] border-stone-900 rounded flex items-center justify-center shadow-[2px_2px_0px_#1c1917]">
          <Bot size={24} className="text-stone-900" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-2xl uppercase tracking-wider text-stone-900">
            Claw AI
          </h1>
          <p className="font-bold text-stone-600 text-sm">
            Your personal context-aware companion.
          </p>
        </div>
      </header>

      <RetroCard className="flex-1 flex flex-col overflow-hidden bg-stone-100" accentColor="emerald">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={cn(
                "flex w-full gap-3",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 shrink-0 bg-emerald-400 border-2 border-stone-900 rounded flex items-center justify-center mt-1">
                  <Bot size={16} className="text-stone-900" />
                </div>
              )}
              
              <div 
                className={cn(
                  "max-w-[80%] p-3 border-2 border-stone-900 rounded-lg font-[family-name:var(--font-space)] font-bold text-sm",
                  msg.role === 'user' 
                    ? "bg-amber-300 text-stone-900 rounded-tr-none" 
                    : "bg-white text-stone-800 rounded-tl-none"
                )}
                style={{ boxShadow: "inset 2px 2px 0px rgba(255,255,255,0.4), inset -1px -1px 0px rgba(0,0,0,0.1)" }}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 shrink-0 bg-amber-400 border-2 border-stone-900 rounded flex items-center justify-center mt-1">
                  <User size={16} className="text-stone-900" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex w-full gap-3 justify-start">
              <div className="w-8 h-8 shrink-0 bg-emerald-400 border-2 border-stone-900 rounded flex items-center justify-center mt-1">
                <Bot size={16} className="text-stone-900" />
              </div>
              <div className="p-3 bg-white border-2 border-stone-900 rounded-lg rounded-tl-none flex items-center gap-1">
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 bg-stone-200 border-t-[3px] border-stone-900">
          <form onSubmit={handleSend} className="flex gap-2">
            <RetroInput 
              placeholder="Ask Claw anything..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-white"
            />
            <RetroButton type="submit" label="Send" icon={Send} variant="success" />
          </form>
        </div>
      </RetroCard>
    </div>
  );
}
