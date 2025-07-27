export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
}

export interface AuthError {
  message: string
  status?: number
}

export interface AuthResponse {
  success: boolean
  error?: AuthError
  data?: any
}

// 添加 Line 用戶資料類型
export interface LineUserMetadata {
  sub: string
  name: string
  picture?: string
  email?: string
}

export interface AuthUser {
  id: string
  email?: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
    provider?: string
    // Line 特定資料
    line_user_id?: string
  }
}