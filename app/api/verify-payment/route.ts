import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentId, signature, visitTime, items, userDetails } = await request.json()

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      )
    }

    // Verify the payment signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Save the order to your database
    // 2. Send confirmation email to user
    // 3. Notify the restaurant
    // 4. Update inventory, etc.

    // For now, we'll just return success
    const orderData = {
      orderId,
      paymentId,
      visitTime,
      items,
      userDetails,
      status: 'confirmed',
      advancePaid: true,
      remainingAmount: items.reduce((total: number, item: any) => {
        const price = parseFloat(item.price.replace('₹', ''))
        return total + (price * item.quantity * 0.5) // 50% remaining
      }, 0),
      createdAt: new Date().toISOString(),
    }

    // TODO: Save to database
    console.log('Order confirmed:', orderData)

    return NextResponse.json({
      success: true,
      orderId,
      paymentId,
      message: 'Payment verified successfully',
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
