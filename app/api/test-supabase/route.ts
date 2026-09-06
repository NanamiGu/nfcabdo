import { NextResponse } from 'next/server'
import { testSupabaseConnection } from '@/lib/supabase/test'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await testSupabaseConnection()

  return NextResponse.json(result)
}