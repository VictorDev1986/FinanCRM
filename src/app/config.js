export const appConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'FinanCRM',
  apiBaseUrl: import.meta.env.VITE_APPS_SCRIPT_URL || '',
  apiKey: import.meta.env.VITE_API_KEY || '',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
}
