'use client'

import React, { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'
import { useCart } from './CartContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface PaymentContextType {
  isProcessing: boolean
  visitTime: string
  setVisitTime: (time: string) => void
  processPayment: () => Promise<void>
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const { userDetails } = useAuth()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [visitTime, setVisitTime] = useState('')
  const router = useRouter()

  const processPayment = async () => {
    if (!visitTime) {
      toast.error('Please select your visit time')
      return
    }

    if (!userDetails) {
      toast.error('User details not found')
      return
    }

    setIsProcessing(true)

    try {
      // Calculate 50% advance payment
      const totalAmount = getCartTotal()
      const advanceAmount = totalAmount * 0.5

      // Create order on your backend (you'll need to implement this)
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: advanceAmount,
          currency: 'INR',
          items: cartItems,
          visitTime,
          userDetails,
        }),
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const { orderId } = await orderResponse.json()

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: advanceAmount * 100, // Convert to paise
          currency: 'INR',
          name: "Harvey's Cafe",
          description: 'Advance Payment for Pre-Order',
          order_id: orderId,
          prefill: {
            name: userDetails.name,
            email: userDetails.email,
            contact: userDetails.phone,
          },
          theme: {
            color: '#eb3e04',
          },
          handler: async function (response: any) {
            try {
              // Verify payment on your backend
              const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  visitTime,
                  items: cartItems,
                  userDetails,
                }),
              })

              if (verifyResponse.ok) {
                const result = await verifyResponse.json()
                toast.success(`Payment successful! Invoice #${result.invoiceNumber} generated.`, {
                  duration: 5000,
                  icon: '🎉',
                })
                await clearCart()
                // Redirect to invoices page to show the new invoice
                setTimeout(() => {
                  router.push('/invoices')
                }, 2000)
              } else {
                throw new Error('Payment verification failed')
              }
            } catch (error) {
              console.error('Payment verification error:', error)
              toast.error('Payment verification failed')
            }
          },
          modal: {
            ondismiss: function() {
              toast.error('Payment cancelled')
            }
          }
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
      script.onerror = () => {
        toast.error('Failed to load payment gateway')
        setIsProcessing(false)
      }
      document.body.appendChild(script)

    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const value = {
    isProcessing,
    visitTime,
    setVisitTime,
    processPayment,
  }

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider')
  }
  return context
}
