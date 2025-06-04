import { supabase } from './supabase-client'

// Local storage keys
const SCHEMAS_KEY = 'api_whisper_schemas';
const SUMMARIES_KEY = 'api_whisper_summaries';

export interface LocalSchema {
  id: string;
  title: string;
  schema_content: string;
  created_at: string;
}

export interface LocalSummary {
  id: string;
  schema_id: string;
  summary_content: string;
  created_at: string;
}

export async function saveSchema(title: string, schemaContent: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: null, error: new Error('User not authenticated') }
    }

    const { data, error } = await supabase
      .from('schemas')
      .insert({
        title,
        schema_content: schemaContent,
        user_id: user.id
      })
      .select()
      .single()

    if (error) {
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function saveSummary(schemaId: string, summary: string) {
  try {
    const { data, error } = await supabase
      .from('summaries')
      .insert({
        schema_id: schemaId,
        summary_content: summary
      })
      .select()
      .single()

    if (error) {
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getSchemas() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { data: [], error: new Error('User not authenticated') }
    }

    const { data: schemas, error: schemasError } = await supabase
      .from('schemas')
      .select(`
        *,
        summaries (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (schemasError) {
      return { data: [], error: schemasError }
    }

    return { data: schemas || [], error: null }
  } catch (error) {
    return { data: [], error }
  }
}

export async function deleteSchema(schemaId: string) {
  try {
    const { error } = await supabase
      .from('schemas')
      .delete()
      .eq('id', schemaId)

    return { error }
  } catch (error) {
    return { error }
  }
}