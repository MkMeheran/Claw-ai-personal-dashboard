import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { messages, systemInstruction } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: authError?.message || 'Invalid token' }, { status: 401 });
    }

    // Fetch user's data for context
    const { data: clips } = await supabase.from('clipboard_items').select('content, type, created_at').eq('user_id', user.id).limit(5);
    const { data: notes } = await supabase.from('notes').select('title, content').eq('user_id', user.id).limit(3);
    const { data: focus } = await supabase.from('focus_sessions').select('subject, duration_minutes, created_at').eq('user_id', user.id).limit(3);

    const contextData = `
    Here is the user's current NEXUS workspace context:
    Recent Clipboard Items: ${JSON.stringify(clips || [])}
    Recent Notes: ${JSON.stringify(notes || [])}
    Recent Focus Sessions: ${JSON.stringify(focus || [])}
    
    Use this context to answer the user's questions intelligently. Do not mention this raw context directly unless relevant.
    `;

    // We use gemini-2.5-flash as specified in the master prompt
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: (systemInstruction || "You are CLAW, a highly capable, concise, and helpful personal AI assistant for the NEXUS dashboard. You help the user manage their clipboard, notes, schedule, and focus. Be concise and direct.") + "\n" + contextData
    });

    // Format previous messages for Gemini
    // Gemini uses "user" and "model" roles
    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
