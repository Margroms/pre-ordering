'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin login
    router.push('/admin/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white font-grimpt text-xl">Redirecting to admin login...</div>
    </div>
  )
}
