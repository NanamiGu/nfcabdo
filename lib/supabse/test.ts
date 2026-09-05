import { createClient } from './server'

export async function testSupabaseConnection() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, slug, type, status')
    .limit(5)

  if (error) {
    console.error('Supabase error:', error)

    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      },
    }
  }

  console.log('Supabase profiles:', data)

  return {
    success: true,
    data,
  }
}