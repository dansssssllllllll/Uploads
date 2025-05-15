import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://icoyarsbjezlaylalsgq.supabase.co', // Your Supabase project URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb3lhcnNiamV6bGF5bGFsc2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyODEwMjQsImV4cCI6MjA2Mjg1NzAyNH0.UlPtRVqZb-03ZLIYiDgUAPFVDN3yxvMOIwDUhmuqfxM'
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const busboy = require('busboy');
  const bb = busboy({ headers: req.headers });

  let upload = null;
  let code = null;

  bb.on('file', (_, file, info) => {
    const { filename } = info;
    const chunks = [];

    file.on('data', (chunk) => chunks.push(chunk));
    file.on('end', async () => {
      const buffer = Buffer.concat(chunks);
      await supabase.storage
        .from('uploads')
        .upload(`files/${code}/${filename}`, buffer, {
          contentType: info.mimeType,
          upsert: true
        });

      const publicUrl = supabase.storage
        .from('uploads')
        .getPublicUrl(`files/${code}/${filename}`).data.publicUrl;

      // Save file info in Supabase KV-style table (optional)
      await supabase
        .from('file_map')
        .insert([{ code, filename, url: publicUrl }]);

      res.status(200).json({ success: true, code });
    });
  });

  bb.on('field', (name, val) => {
    if (name === 'code') code = val;
  });

  req.pipe(bb);
}
