import { NextResponse } from 'next/server'
import { testSupabaseConnection } from '@/lib/supabase/test'

export async function GET() {
  const result = await testSupabaseConnection()

  return NextResponse.json(result)
}