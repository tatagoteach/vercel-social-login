import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { auth } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signInWithEmail: (email: string, password: string) => Promise<any>
  signUpWithEmail: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signInWithLine: () => Promise<any>
  signOut: () => Promise<any>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 獲取初始會話
    const getInitialSession = async () => {
      try {
        const { data: { user }, error } = await auth.getCurrentUser()
        if (error) {
          console.error('獲取用戶資訊失敗:', error)
          setError(error.message)
        } else {
          setUser(user)
        }
      } catch (err) {
        console.error('認證初始化失敗:', err)
        setError('認證初始化失敗')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 監聽認證狀態變化
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      console.log('認證狀態變化:', event, session?.user?.email)
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      // 清除錯誤狀態（當用戶成功登入時）
      if (session?.user) {
        setError(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 包裝認證方法以提供統一的錯誤處理
  const wrappedSignInWithEmail = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const result = await auth.signInWithEmail(email, password)
      if (result.error) {
        setError(result.error.message)
      }
      return result
    } catch (err) {
      const errorMessage = '登入失敗，請稍後再試'
      setError(errorMessage)
      return { error: { message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }

  const wrappedSignUpWithEmail = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const result = await auth.signUpWithEmail(email, password)
      if (result.error) {
        setError(result.error.message)
      }
      return result
    } catch (err) {
      const errorMessage = '註冊失敗，請稍後再試'
      setError(errorMessage)
      return { error: { message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }

  // 在 AuthContext 中添加更詳細的錯誤處理
  const getOAuthErrorMessage = (error: any) => {
    switch (error?.message) {
      case 'popup_closed_by_user':
        return '登入視窗已關閉，請重試'
      case 'access_denied':
        return '您拒絕了授權請求'
      case 'invalid_request':
        return 'OAuth 配置錯誤，請聯絡管理員'
      default:
        return error?.message || 'OAuth 登入失敗'
    }
  }
  
  const wrappedSignInWithGoogle = async () => {
    setError(null)
    try {
      const result = await auth.signInWithGoogle()
      if (result.error) {
        const errorMessage = getOAuthErrorMessage(result.error)
        setError(errorMessage)
        console.error('Google 登入錯誤:', result.error)
      }
      return result
    } catch (err) {
      const errorMessage = 'Google 登入失敗'
      setError(errorMessage)
      console.error('Google 登入異常:', err)
      return { error: { message: errorMessage } }
    }
  }

  // 在 AuthContext 中添加 Line 特定的錯誤處理
  const getLineErrorMessage = (error: any) => {
    switch (error?.message) {
      case 'popup_closed_by_user':
        return 'Line 登入視窗已關閉，請重試'
      case 'access_denied':
        return '您拒絕了 Line 授權請求'
      case 'invalid_request':
        return 'Line OAuth 配置錯誤，請聯絡管理員'
      case 'server_error':
        return 'Line 伺服器錯誤，請稍後再試'
      default:
        return error?.message || 'Line 登入失敗'
    }
  }
  
  const wrappedSignInWithLine = async () => {
    setError(null)
    try {
      const result = await auth.signInWithLine()
      if (result.error) {
        const errorMessage = getLineErrorMessage(result.error)
        setError(errorMessage)
        console.error('Line 登入錯誤:', result.error)
      }
      return result
    } catch (err) {
      const errorMessage = 'Line 登入失敗'
      setError(errorMessage)
      console.error('Line 登入異常:', err)
      return { error: { message: errorMessage } }
    }
  }

  const wrappedSignOut = async () => {
    setError(null)
    try {
      const result = await auth.signOut()
      if (result.error) {
        setError(result.error.message)
      }
      return result
    } catch (err) {
      const errorMessage = '登出失敗'
      setError(errorMessage)
      return { error: { message: errorMessage } }
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    session,
    loading,
    error,
    signInWithEmail: wrappedSignInWithEmail,
    signUpWithEmail: wrappedSignUpWithEmail,
    signInWithGoogle: wrappedSignInWithGoogle,
    signInWithLine: wrappedSignInWithLine,
    signOut: wrappedSignOut,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 在 AuthContext 中添加更詳細的錯誤處理
const getErrorMessage = (error: any) => {
  switch (error?.message) {
    case 'Invalid login credentials':
      return '電子郵件或密碼錯誤'
    case 'Email not confirmed':
      return '請先確認您的電子郵件'
    case 'Too many requests':
      return '嘗試次數過多，請稍後再試'
    default:
      return error?.message || '登入失敗，請稍後再試'
  }
}