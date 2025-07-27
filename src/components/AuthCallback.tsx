import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    // 檢查 URL 中的認證參數
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const error = urlParams.get('error')
      const errorDescription = urlParams.get('error_description')

      if (error) {
        console.error('OAuth 錯誤:', error, errorDescription)
        navigate('/login?error=' + encodeURIComponent(errorDescription || error))
        return
      }

      // 如果用戶已登入，重定向到 dashboard
      if (user) {
        navigate('/dashboard', { replace: true })
      }
    }

    handleAuthCallback()
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-sm sm:text-base text-gray-600">正在處理登入...</p>
      </div>
    </div>
  )
}