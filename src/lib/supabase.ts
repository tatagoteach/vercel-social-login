import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // 增強安全性
  }
})

// 認證相關的輔助函數
// 添加調試日誌
export const auth = {
  // Email 登入
  signInWithEmail: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },

  // Email 註冊
  signUpWithEmail: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password })
  },

  // 增強的 Google 登入
  signInWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: 'email profile'
      }
    })
  },

  // 增強的 Line 登入
  signInWithLine: async () => {
    console.log('開始 Line OAuth 登入')
    try {
      const result = await supabase.auth.signInWithOAuth({
        provider: 'line',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          scopes: 'profile openid email'
        }
      })
      console.log('Line OAuth 結果:', result)
      return result
    } catch (error) {
      console.error('Line OAuth 錯誤:', error)
      throw error
    }
  }
}

  // 登出
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  // 獲取當前用戶
  getCurrentUser: () => {
    return supabase.auth.getUser()
  },

  // 監聽認證狀態變化
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}