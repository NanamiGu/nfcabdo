import { createClient } from './server'

export async function testSupabaseConnection() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, slug, type, status')
    .limit(5)

  if (error) {
    console.error('Supabase error:', error)
    return null
  }

  console.log('Supabase profiles:', data)

  return data
}