// Simplified mock Supabase client to avoid WebSocket import issues

export interface MockUser {
  id: string;
  email: string;
  created_at: string;
}

export interface MockSession {
  user: MockUser;
  access_token: string;
}

class MockSupabaseClient {
  private currentUser: MockUser | null = null;
  private currentSession: MockSession | null = null;
  private listeners: Array<(event: string, session: MockSession | null) => void> = [];

  constructor() {
    // Try to restore session from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('supabase_session');
      if (stored) {
        try {
          const session = JSON.parse(stored);
          this.currentSession = session;
          this.currentUser = session.user;
        } catch (e) {
          // Ignore invalid session data
        }
      }
    }
  }

  auth = {
    getUser: async () => {
      return {
        data: { user: this.currentUser, session: this.currentSession },
        error: null
      };
    },

    getSession: async () => {
      return {
        data: { user: this.currentUser, session: this.currentSession },
        error: null
      };
    },

    signUp: async ({ email, password }: { email: string; password: string }) => {
      const user: MockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        created_at: new Date().toISOString()
      };
      
      const session: MockSession = {
        user,
        access_token: 'mock_token_' + Math.random().toString(36).substr(2, 9)
      };

      this.currentUser = user;
      this.currentSession = session;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('supabase_session', JSON.stringify(session));
      }

      // Notify listeners
      this.listeners.forEach(listener => listener('SIGNED_IN', session));

      return {
        data: { user, session },
        error: null
      };
    },

    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const user: MockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        created_at: new Date().toISOString()
      };
      
      const session: MockSession = {
        user,
        access_token: 'mock_token_' + Math.random().toString(36).substr(2, 9)
      };

      this.currentUser = user;
      this.currentSession = session;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('supabase_session', JSON.stringify(session));
      }

      // Notify listeners
      this.listeners.forEach(listener => listener('SIGNED_IN', session));

      return {
        data: { user, session },
        error: null
      };
    },

    signOut: async () => {
      this.currentUser = null;
      this.currentSession = null;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase_session');
      }

      // Notify listeners
      this.listeners.forEach(listener => listener('SIGNED_OUT', null));

      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: MockSession | null) => void) => {
      this.listeners.push(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const index = this.listeners.indexOf(callback);
              if (index > -1) {
                this.listeners.splice(index, 1);
              }
            }
          }
        }
      };
    }
  };

  from = (table: string) => {
    return {
      insert: (data: any) => {
        return {
          select: () => {
            return {
              single: async () => {
                const id = Math.random().toString(36).substr(2, 9);
                const record = { 
                  ...data, 
                  id, 
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                
                // Store in localStorage
                if (typeof window !== 'undefined') {
                  const existing = JSON.parse(localStorage.getItem(`supabase_${table}`) || '[]');
                  existing.push(record);
                  localStorage.setItem(`supabase_${table}`, JSON.stringify(existing));
                }
                
                return { data: record, error: null };
              }
            };
          }
        };
      },

      select: (columns?: string) => {
        return {
          eq: (column: string, value: any) => {
            return {
              order: (orderColumn: string, options?: any) => {
                return Promise.resolve({
                  data: [],
                  error: null
                });
              }
            };
          }
        };
      },

      delete: () => {
        return {
          eq: (column: string, value: any) => {
            return Promise.resolve({ error: null });
          }
        };
      }
    };
  };
}

export const supabase = new MockSupabaseClient(); 