import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://icoyarsbjezlaylalsgq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb3lhcnNiamV6bGF5bGFsc2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyODEwMjQsImV4cCI6MjA2Mjg1NzAyNH0.UlPtRVqZb-03ZLIYiDgUAPFVDN3yxvMOIwDUhmuqfxM'
);

export default async function handler(req, res) {
  const { code } = req.query;
  const { data, error } = await supabase
    .from('file_map')
    .select('*')
    .eq('code', code)
    .single();

  if (error) return res.status(404).json({ error: 'Not found' });

  res.status(200).json({ filename: data.filename, url: data.url });
    }
