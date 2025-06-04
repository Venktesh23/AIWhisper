export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      schemas: {
        Row: {
          id: string
          user_id: string
          title: string
          schema_content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          schema_content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          schema_content?: string
          created_at?: string
          updated_at?: string
        }
      }
      summaries: {
        Row: {
          id: string
          schema_id: string
          summary_content: string
          created_at: string
        }
        Insert: {
          id?: string
          schema_id: string
          summary_content: string
          created_at?: string
        }
        Update: {
          id?: string
          schema_id?: string
          summary_content?: string
          created_at?: string
        }
      }
    }
  }
}