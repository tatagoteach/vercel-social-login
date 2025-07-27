import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  CalendarIcon, 
  ClockIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BellIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export const Dashboard: React.FC = () => {
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('登出失敗:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // 獲取用戶顯示資訊
  const getUserDisplayInfo = (user: any) => {
    const metadata = user?.user_metadata || {}
    
    return {
      name: metadata.full_name || metadata.name || user?.email?.split('@')[0] || '用戶',
      avatar: metadata.avatar_url || metadata.picture,
      provider: metadata.provider || 'email',
      email: user?.email,
      emailVerified: user?.email_confirmed_at ? true : false
    }
  }
  
  const userInfo = getUserDisplayInfo(user)

  // 獲取登入方式顯示文字
  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case 'line':
        return 'Line'
      case 'google':
        return 'Google'
      case 'email':
        return 'Email'
      default:
        return provider
    }
  }

  // 獲取登入方式顏色
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'line':
        return 'bg-green-100 text-green-800'
      case 'google':
        return 'bg-red-100 text-red-800'
      case 'email':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 導航欄 */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo 和標題 */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">儀表板</h1>
              </div>
              
              {/* 響應式用戶操作區 */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* 隱藏小螢幕上的通知和設定按鈕 */}
                <div className="hidden sm:flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <BellIcon className="h-6 w-6" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <Cog6ToothIcon className="h-6 w-6" />
                  </button>
                </div>
                
                {/* 用戶頭像 */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {userInfo.avatar ? (
                    <img 
                      src={userInfo.avatar} 
                      alt="用戶頭像" 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ring-2 ring-gray-200"
                    />
                  ) : (
                    <UserCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  )}
                  <span className="text-xs sm:text-sm font-medium text-gray-700 hidden md:block">
                    {userInfo.name}
                  </span>
                </div>
                
                {/* 登出按鈕 */}
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isSigningOut ? (
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                  ) : (
                    <ArrowRightOnRectangleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">{isSigningOut ? '登出中...' : '登出'}</span>
                  <span className="sm:hidden">出</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </nav>
      
      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* 歡迎區域 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg mb-6 sm:mb-8">
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {userInfo.avatar ? (
                <img 
                  src={userInfo.avatar} 
                  alt="用戶頭像" 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ring-white/20"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              )}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  歡迎回來，{userInfo.name}！
                </h2>
                <p className="text-blue-100 mb-3 text-sm sm:text-base">
                  很高興再次見到您。這是您的個人儀表板。
                </p>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getProviderColor(userInfo.provider)}`}>
                    透過 {getProviderDisplayName(userInfo.provider)} 登入
                  </span>
                  {userInfo.emailVerified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ 已驗證
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 統計卡片 - 改進響應式網格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg sm:rounded-xl border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">總項目</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow-sm rounded-lg sm:rounded-xl border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">完成率</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">85%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow-sm rounded-lg sm:rounded-xl border border-gray-200 sm:col-span-2 lg:col-span-1">
            <div className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">本週活動</p>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 用戶詳細資訊 */}
        <div className="bg-white shadow-sm rounded-lg sm:rounded-xl border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">帳戶資訊</h3>
            <p className="text-sm text-gray-500">您的個人帳戶詳細資訊</p>
          </div>
          <div className="px-4 sm:px-6 py-6">
            <dl className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              <div className="flex items-start space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500">電子郵件</dt>
                  <dd className="mt-1 text-sm text-gray-900 break-all">{userInfo.email || 'N/A'}</dd>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <UserCircleIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500">用戶 ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono break-all">
                    {user?.id ? `${user.id.substring(0, 8)}...` : 'N/A'}
                  </dd>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500">註冊時間</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-TW', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </dd>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500">最後登入</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('zh-TW', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </dd>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 mt-1 flex-shrink-0">
                  {userInfo.provider === 'google' && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {userInfo.provider === 'line' && (
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      <path fill="#00C300" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                      </svg>
                    )}
                    {userInfo.provider === 'email' && (
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">登入方式</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {getProviderDisplayName(userInfo.provider)}
                    </dd>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 mt-1">
                    {userInfo.emailVerified ? (
                      <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="h-5 w-5 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">驗證狀態</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userInfo.emailVerified ? '已驗證' : '待驗證'}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}