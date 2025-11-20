import React, { useState, useEffect } from 'react';
import { cartService } from '../../services/cartService';
import { productService } from '../../services/productService';
import { authService } from '../../services/authService';
import { orderService } from '../../services/orderService';
import type { CartItem, Product, PaymentMethod } from '../../types';
import { Icon } from '../../components/Icon';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<'details' | 'payment' | 'verification'>('details');
  const [cartItems, setCartItems] = useState<{product: Product, quantity: number, prescription?: any}[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState('');
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Auth Check
      const session = await authService.getSession();
      if (!session) {
          alert("Please login to proceed to checkout.");
          onNavigate('user/login');
          return;
      }
      const user = await authService.getUser();
      if(user) {
          setEmail(user.email || '');
          const profile = await authService.getProfileForCurrentUser();
          if(profile?.full_name) setFullName(profile.full_name);
      }

      // Load Cart
      const items = cartService.getCart();
      if (items.length === 0) {
          onNavigate('user/cart');
          return;
      }
      
      const productIds = items.map(item => item.productId);
      const products = await productService.getProductsByIds(productIds);
      
      const detailedItems = items.map(item => {
          const product = products.find(p => p.id === item.productId);
          return product ? { product, quantity: item.quantity, prescription: item.prescription } : null;
      }).filter(item => item !== null) as {product: Product, quantity: number, prescription?: any}[];
      
      setCartItems(detailedItems);
      const total = detailedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      setTotalAmount(total);
      setIsLoading(false);
    };
    
    loadData();
  }, [onNavigate]);

  useEffect(() => {
    let interval: number;
    if (timerActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      alert("Payment timer expired. Please restart the process.");
      setStep('payment');
      setTimeLeft(300);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setProofFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target && typeof event.target.result === 'string') {
                setPaymentProof(event.target.result);
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (!address || !fullName) {
        alert("Please fill in all shipping details.");
        return;
    }

    // Strict Address Validation
    // Format: Street, City, Pincode
    const addressParts = address.split(',').map(p => p.trim());
    const hasValidParts = addressParts.length === 3 && addressParts[0].length > 0 && addressParts[1].length > 0;
    // Basic check if the last part looks like a pincode (digits)
    const hasValidPincode = addressParts[2] && /^\d+$/.test(addressParts[2]);

    if (!hasValidParts || !hasValidPincode) {
        alert("Invalid Address Format.\nPlease strictly use the format: Street, City, Pincode\nExample: MG Road, Mumbai, 400001");
        return;
    }

    setStep('payment');
  };

  const handlePaymentSelect = () => {
    if (paymentMethod === 'cod') {
        if (totalAmount >= 500) {
            alert("Cash on Delivery is only available for orders under ₹500.");
            return;
        }
        placeOrder();
    } else {
        // Advance or Instant payment
        setStep('verification');
        setTimerActive(true);
    }
  };

  const placeOrder = async () => {
    setIsLoading(true);
    try {
        const user = await authService.getUser();
        if (!user) throw new Error("User not authenticated");

        const orderData = {
            user_id: user.id,
            full_name: fullName,
            email: email,
            address: address,
            total_amount: totalAmount,
            payment_method: paymentMethod,
            payment_proof_url: paymentProof || undefined,
            items: cartItems.map(item => ({
                product_id: item.product.id,
                product_name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                prescription_data: item.prescription ? item.prescription.data : undefined
            }))
        };

        await orderService.createOrder(orderData);
        cartService.clearCart();
        alert(paymentMethod === 'cod' ? "Order placed successfully!" : "Order placed! Waiting for admin verification.");
        onNavigate('user/orders');
    } catch (error) {
        console.error(error);
        alert("Failed to place order. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Step Indicator */}
        <div className="flex border-b">
            <div className={`flex-1 py-4 text-center ${step === 'details' ? 'bg-primary text-white font-bold' : 'bg-gray-50 text-gray-500'}`}>1. Details</div>
            <div className={`flex-1 py-4 text-center ${step === 'payment' ? 'bg-primary text-white font-bold' : 'bg-gray-50 text-gray-500'}`}>2. Payment</div>
            <div className={`flex-1 py-4 text-center ${step === 'verification' ? 'bg-primary text-white font-bold' : 'bg-gray-50 text-gray-500'}`}>3. Verify</div>
        </div>

        <div className="p-8">
            {/* Step 1: Shipping Details */}
            {step === 'details' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-dark">Shipping Information</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 input-style w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 input-style w-full" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                        <textarea 
                            value={address} 
                            onChange={e => setAddress(e.target.value)} 
                            rows={3} 
                            className="mt-1 input-style w-full" 
                            placeholder="Street, City, Pincode"
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">Format: Street, City, Pincode</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                         <h3 className="font-semibold mb-2">Order Summary</h3>
                         <div className="flex justify-between text-lg font-bold">
                             <span>Total</span>
                             <span>{formatCurrency(totalAmount)}</span>
                         </div>
                    </div>
                    <button onClick={handleNext} className="w-full btn-primary">Proceed to Payment</button>
                </div>
            )}

            {/* Step 2: Payment Selection */}
            {step === 'payment' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-dark">Select Payment Method</h2>
                    
                    <div className="space-y-4">
                        {/* COD Option */}
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-blue-50' : 'border-gray-200'} ${totalAmount >= 500 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} disabled={totalAmount >= 500} className="form-radio text-primary" />
                            <div className="ml-4">
                                <span className="block font-bold text-gray-800">Cash on Delivery (COD)</span>
                                <span className="block text-sm text-gray-500">Available for orders under ₹500 only.</span>
                                {totalAmount >= 500 && <span className="block text-xs text-red-500 mt-1">Order value exceeds limit for COD.</span>}
                            </div>
                        </label>

                        {/* Advance Payment */}
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'advance' ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                            <input type="radio" name="payment" value="advance" checked={paymentMethod === 'advance'} onChange={() => setPaymentMethod('advance')} className="form-radio text-primary" />
                            <div className="ml-4">
                                <span className="block font-bold text-gray-800">Advance Payment</span>
                                <span className="block text-sm text-gray-500">Scan QR, pay via UPI, and upload screenshot.</span>
                            </div>
                        </label>

                        {/* Instant Payment */}
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'instant' ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                            <input type="radio" name="payment" value="instant" checked={paymentMethod === 'instant'} onChange={() => setPaymentMethod('instant')} className="form-radio text-primary" />
                            <div className="ml-4">
                                <span className="block font-bold text-gray-800">Instant Transfer</span>
                                <span className="block text-sm text-gray-500">Direct bank transfer (Verification required).</span>
                            </div>
                        </label>
                    </div>
                    
                    <div className="flex gap-4 mt-6">
                        <button onClick={() => setStep('details')} className="flex-1 bg-gray-200 text-dark font-bold py-3 rounded-lg hover:bg-gray-300">Back</button>
                        <button onClick={handlePaymentSelect} className="flex-1 btn-primary">Continue</button>
                    </div>
                </div>
            )}

            {/* Step 3: Verification (QR & Upload) */}
            {step === 'verification' && (
                <div className="text-center space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-yellow-800 mb-2">Complete Payment in {formatTime(timeLeft)}</h3>
                        <p className="text-sm text-yellow-700">Please scan the QR code below and pay <strong>{formatCurrency(totalAmount)}</strong>.</p>
                    </div>

                    <div className="flex justify-center">
                         {/* Placeholder QR Code - using a generator for the prototype */}
                         <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=merchant@upi&pn=MeenaEyecare&am=${totalAmount}&cu=INR`} 
                            alt="Payment QR Code" 
                            className="border-4 border-white shadow-lg rounded-lg"
                         />
                    </div>
                    <p className="text-xs text-gray-500">UPI ID: merchant@upi</p>

                    <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
                        <h4 className="font-semibold mb-4">Upload Payment Screenshot</h4>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" />
                        {proofFileName && <p className="mt-2 text-sm text-green-600 font-medium">Selected: {proofFileName}</p>}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setStep('payment')} className="flex-1 bg-gray-200 text-dark font-bold py-3 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button onClick={placeOrder} disabled={!paymentProof} className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                            Submit Payment Proof
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};