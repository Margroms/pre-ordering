import Razorpay from 'razorpay';

// Razorpay configuration
export const razorpayConfig = {
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
};

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: razorpayConfig.key_id,
  key_secret: razorpayConfig.key_secret,
});

// Razorpay options for frontend
export const getRazorpayOptions = (amount: number, orderId: string, userDetails: any) => ({
  key: razorpayConfig.key_id,
  amount: amount * 100, // Convert to paise
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
  handler: function (response: any) {
    console.log('Payment successful:', response);
    return response;
  },
  modal: {
    ondismiss: function() {
      console.log('Payment modal dismissed');
    }
  }
});
