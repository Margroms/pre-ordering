'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Login() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [otp, setOtp] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const sendOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone
          }
        }
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('OTP sent to your email!')
        setShowOtp(true)
      }
    } catch (error) {
      toast.error('Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otp,
        type: 'email'
      })

      if (error) {
        toast.error(error.message)
      } else if (data.user) {
        toast.success('Login successful!')
        router.push('/menu')
      }
    } catch (error) {
      toast.error('Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-grimpt-brush text-white mb-4">Welcome Back</h1>
          <p className="text-lg font-garet text-gray-300">
            Enter your details to continue
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {!showOtp ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white font-garet mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 font-garet focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white font-garet mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 font-garet focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-white font-garet mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 font-garet focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-transparent border-2 border-white text-white font-grimpt text-xl font-bold py-3 rounded-lg hover:bg-white hover:text-[#eb3e04] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-white font-garet mb-4">
                  We've sent a verification code to
                </p>
                <p className="text-[#eb3e04] font-grimpt font-bold">
                  {formData.email}
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-white font-garet mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 font-garet focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-transparent border-2 border-white text-white font-grimpt text-xl font-bold py-3 rounded-lg hover:bg-white hover:text-[#eb3e04] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                onClick={() => setShowOtp(false)}
                className="w-full text-gray-300 font-garet hover:text-white transition-colors duration-300"
              >
                Back to form
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
