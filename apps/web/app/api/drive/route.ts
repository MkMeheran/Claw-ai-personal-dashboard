import { NextResponse } from 'next/server';
import { getDriveClient } from '@/lib/drive';
import { Readable } from 'stream';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const token = formData.get('token') as string;
    
    if (!file || !token) {
      return NextResponse.json({ error: 'Missing file or token' }, { status: 400 });
    }

    const drive = getDriveClient(token);
    const buffer = Buffer.from(await file.arrayBuffer());

    const res = await drive.files.create({
      requestBody: {
        name: file.name,
        mimeType: file.type,
        // We'd add parents: [folderId] if we dynamically fetch/create /NEXUS/media
      },
      media: {
        mimeType: file.type,
        body: Readable.from(buffer),
      },
      fields: 'id, webViewLink, thumbnailLink'
    });

    return NextResponse.json({ 
      id: res.data.id,
      url: res.data.webViewLink,
      thumbnail: res.data.thumbnailLink
    });
  } catch (error: any) {
    console.error('Drive upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
