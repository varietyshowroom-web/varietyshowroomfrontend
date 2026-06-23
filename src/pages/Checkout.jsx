// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useStore } from '../store/useStore';
// import { Button } from '../components/ui/Button';
// import { userService } from '../services/userService';
// import { orderService } from '../services/orderService';

// export const Checkout = () => {
//   const { cart, user, token, clearCart, deliveryConfig } = useStore();
//   const navigate = useNavigate();
  
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
  
//   const [addressForm, setAddressForm] = useState({
//     name: user?.name || '',
//     phone: '',
//     street: '',
//     city: '',
//     state: '',
//     pincode: ''
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [paymentComplete, setPaymentComplete] = useState(false);

//   const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
//   const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  
//   const shipping = subtotal > 0 ? (totalQuantity <= 2 ? Number(deliveryConfig.charge_upto_two) : Number(deliveryConfig.charge_more_than_two)) : 0;
//   const totalAmount = subtotal + shipping;

//   useEffect(() => {
//     if (cart.length === 0 && !paymentComplete) {
//       navigate('/cart');
//     }
    
//     if (token) {
//       userService.getAddresses(token)
//         .then(data => {
//           setAddresses(data);
//           const defaultAddress = data.find(a => a.is_default);
//           if (defaultAddress) {
//             setSelectedAddressId(defaultAddress.id);
//           } else if (data.length > 0) {
//             setSelectedAddressId(data[0].id);
//           }
//         })
//         .catch(err => console.error(err));
//     }
//   }, [token, cart.length, navigate, paymentComplete]);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handleCheckout = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     let finalAddress = null;

//     try {
//       if (selectedAddressId && selectedAddressId !== 'new') {
//         finalAddress = addresses.find(a => a.id === selectedAddressId);
//       } else {
//         if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
//           throw new Error('Please fill in all address fields.');
//         }
        
//         finalAddress = {
//           name: addressForm.name,
//           phone: addressForm.phone,
//           address: addressForm.street,
//           city: addressForm.city,
//           state: addressForm.state,
//           pincode: addressForm.pincode
//         };

//         if (token) {
//           await userService.addAddress(token, {
//             ...addressForm,
//             is_default: addresses.length === 0
//           });
//         }
//       }

//       const items = cart.map(item => ({
//         variant: item.variant.id,
//         quantity: item.quantity
//       }));

//       const orderPayload = {
//         name: finalAddress.name,
//         phone: finalAddress.phone,
//         address: finalAddress.street || finalAddress.address,
//         city: finalAddress.city,
//         state: finalAddress.state,
//         pincode: finalAddress.pincode,
//         items: items
//       };

//       const orderData = await orderService.createOrder(orderPayload, token);

//       const res = await loadRazorpayScript();
//       if (!res) {
//         throw new Error('Razorpay SDK failed to load. Are you online?');
//       }

//       const options = {
//         key: orderData.key,
//         amount: orderData.amount,
//         currency: 'INR',
//         name: 'Variety Showroom',
//         description: 'Test Transaction',
//         order_id: orderData.razorpay_order_id,
//         handler: async function (response) {
//           try {
//             const verifyRes = await orderService.verifyPayment({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature
//             }, token);
            
//             setPaymentComplete(true);
//             clearCart();
//             navigate('/order-confirmation', { 
//               state: { 
//                 order_number: verifyRes.order_number || response.razorpay_order_id, 
//                 cart: [...cart], 
//                 totalAmount 
//               } 
//             });
//           } catch (err) {
//             setError(err.message || 'Payment verification failed');
//           }
//         },
//         prefill: {
//           name: finalAddress.name,
//           email: user?.email || '',
//           contact: finalAddress.phone
//         },
//         theme: {
//           color: '#5c1a1b'
//         }
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white-bg pt-24 pb-24">
//       <div className="container mx-auto px-4 max-w-4xl">
//         <h1 className="text-4xl font-serif text-dark-maroon mb-8">Checkout</h1>
        
//         {error && (
//           <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         <div className="flex flex-col md:flex-row gap-8">
//           <div className="md:w-2/3">
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-beige/30 mb-6">
//               <h3 className="text-xl font-serif font-bold text-dark-maroon mb-6">Shipping Address</h3>
              
//               {addresses.length > 0 && (
//                 <div className="mb-6 space-y-3">
//                   {addresses.map(addr => (
//                     <div 
//                       key={addr.id} 
//                       className={`p-4 border rounded-lg cursor-pointer ${selectedAddressId === addr.id ? 'border-maroon-light bg-maroon-light/5' : 'border-cream-beige'}`}
//                       onClick={() => setSelectedAddressId(addr.id)}
//                     >
//                       <div className="flex items-center gap-2">
//                         <input type="radio" checked={selectedAddressId === addr.id} readOnly className="text-maroon-light focus:ring-maroon-light" />
//                         <span className="font-bold text-dark-maroon">{addr.name}</span>
//                         {addr.is_default && <span className="text-xs bg-maroon-light text-white px-2 py-0.5 rounded">Default</span>}
//                       </div>
//                       <p className="text-sm text-muted-maroon ml-6 mt-1">{addr.street}, {addr.city}, {addr.state} {addr.pincode}</p>
//                     </div>
//                   ))}
                  
//                   <div 
//                     className={`p-4 border rounded-lg cursor-pointer ${selectedAddressId === 'new' ? 'border-maroon-light bg-maroon-light/5' : 'border-cream-beige'}`}
//                     onClick={() => setSelectedAddressId('new')}
//                   >
//                     <div className="flex items-center gap-2">
//                       <input type="radio" checked={selectedAddressId === 'new'} readOnly className="text-maroon-light focus:ring-maroon-light" />
//                       <span className="font-bold text-dark-maroon">Add New Address</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {(!addresses.length || selectedAddressId === 'new') && (
//                 <form className="space-y-4">
//                   {/* Row 1: Full Name & Phone */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm text-dark-maroon mb-1">Full Name</label>
//                       <input required type="text" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-dark-maroon mb-1">Phone</label>
//                       <input required type="text" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                     </div>
//                   </div>

//                   {/* Row 2: Street Address */}
//                   <div>
//                     <label className="block text-sm text-dark-maroon mb-1">Street Address</label>
//                     <input required type="text" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                   </div>

//                   {/* Row 3: City */}
//                   <div>
//                     <label className="block text-sm text-dark-maroon mb-1">City</label>
//                     <input required type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                   </div>

//                   {/* Row 4: State & PIN Code */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm text-dark-maroon mb-1">State</label>
//                       <input required type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-dark-maroon mb-1">PIN Code</label>
//                       <input required type="text" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                     </div>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>

//           <div className="md:w-1/3">
//             <div className="bg-white p-6 rounded-2xl border border-cream-beige/50 shadow-sm sticky top-24">
//               <h3 className="text-xl font-serif font-bold text-dark-maroon mb-6 border-b border-cream-beige/50 pb-4">Order Summary</h3>
              
//               <div className="space-y-4 mb-6 text-dark-maroon">
//                 <div className="flex justify-between">
//                   <span className="text-muted-maroon">Subtotal</span>
//                   <span className="font-medium">₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-maroon">Shipping Estimate</span>
//                   <span className="font-medium">₹{shipping}</span>
//                 </div>
//                 <div className="border-t border-cream-beige/50 pt-4 flex justify-between items-center">
//                   <span className="text-lg font-bold">Total</span>
//                   <span className="text-2xl font-bold text-maroon-light">₹{totalAmount}</span>
//                 </div>
//               </div>

//               <Button 
//                 variant="accent" 
//                 className="w-full h-14 text-lg" 
//                 onClick={handleCheckout} 
//                 disabled={loading}
//               >
//                 {loading ? 'Processing...' : 'Pay Now'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useStore } from '../store/useStore';
// import { Button } from '../components/ui/Button';
// import { userService } from '../services/userService';
// import { orderService } from '../services/orderService';

// export const Checkout = () => {
//   const { cart, user, token, clearCart, deliveryConfig } = useStore();
//   const navigate = useNavigate();
  
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
  
//   const [addressForm, setAddressForm] = useState({
//     name: user?.name || '',
//     phone: '',
//     street: '',
//     city: '',
//     state: '',
//     pincode: ''
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [paymentComplete, setPaymentComplete] = useState(false);

//   const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
//   const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  
//   const shipping = subtotal > 0 ? (totalQuantity <= 2 ? Number(deliveryConfig.charge_upto_two) : Number(deliveryConfig.charge_more_than_two)) : 0;
//   const totalAmount = subtotal + shipping;

//   useEffect(() => {
//     if (cart.length === 0 && !paymentComplete) {
//       navigate('/cart');
//     }
    
//     if (token) {
//       userService.getAddresses(token)
//         .then(data => {
//           setAddresses(data);
//           const defaultAddress = data.find(a => a.is_default);
//           if (defaultAddress) {
//             setSelectedAddressId(defaultAddress.id);
//           } else if (data.length > 0) {
//             setSelectedAddressId(data[0].id);
//           }
//         })
//         .catch(err => console.error(err));
//     }
//   }, [token, cart.length, navigate, paymentComplete]);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handleCheckout = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     let finalAddress = null;

//     try {
//       if (selectedAddressId && selectedAddressId !== 'new') {
//         finalAddress = addresses.find(a => a.id === selectedAddressId);
//       } else {
//         if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
//           throw new Error('Please fill in all address fields.');
//         }
        
//         finalAddress = {
//           name: addressForm.name,
//           phone: addressForm.phone,
//           address: addressForm.street,
//           city: addressForm.city,
//           state: addressForm.state,
//           pincode: addressForm.pincode
//         };

//         if (token) {
//           await userService.addAddress(token, {
//             ...addressForm,
//             is_default: addresses.length === 0
//           });
//         }
//       }

//       const items = cart.map(item => ({
//         variant: item.variant.id,
//         quantity: item.quantity
//       }));

//       const orderPayload = {
//         name: finalAddress.name,
//         phone: finalAddress.phone,
//         address: finalAddress.street || finalAddress.address,
//         city: finalAddress.city,
//         state: finalAddress.state,
//         pincode: finalAddress.pincode,
//         items: items
//       };

//       const orderData = await orderService.createOrder(orderPayload, token);

//       const res = await loadRazorpayScript();
//       if (!res) {
//         throw new Error('Razorpay SDK failed to load. Are you online?');
//       }

//       const options = {
//         key: orderData.key,
//         amount: orderData.amount,
//         currency: 'INR',
//         name: 'Variety Showroom',
//         description: 'Test Transaction',
//         order_id: orderData.razorpay_order_id,
//         handler: async function (response) {
//           try {
//             const verifyRes = await orderService.verifyPayment({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature
//             }, token);
            
//             setPaymentComplete(true);
//             clearCart();
//             navigate('/order-confirmation', { 
//               state: { 
//                 order_number: verifyRes.order_number || response.razorpay_order_id, 
//                 cart: [...cart], 
//                 totalAmount 
//               } 
//             });
//           } catch (err) {
//             setError(err.message || 'Payment verification failed');
//           }
//         },
//         prefill: {
//           name: finalAddress.name,
//           email: user?.email || '',
//           contact: finalAddress.phone
//         },
//         theme: {
//           color: '#5c1a1b'
//         }
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white-bg pt-24 pb-24">
//       <div className="container mx-auto px-4 max-w-5xl">
//         <h1 className="text-4xl font-serif text-dark-maroon mb-8">Checkout</h1>
        
//         {error && (
//           <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Shipping Address Inputs */}
//           <div className="lg:col-span-2">
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-beige/30 mb-6">
//               <h3 className="text-xl font-serif font-bold text-dark-maroon mb-6">Shipping Address</h3>
              
//               {addresses.length > 0 && (
//                 <div className="mb-6 space-y-3">
//                   {addresses.map(addr => (
//                     <div 
//                       key={addr.id} 
//                       className={`p-4 border rounded-lg cursor-pointer ${selectedAddressId === addr.id ? 'border-maroon-light bg-maroon-light/5' : 'border-cream-beige'}`}
//                       onClick={() => setSelectedAddressId(addr.id)}
//                     >
//                       <div className="flex items-center gap-2">
//                         <input type="radio" checked={selectedAddressId === addr.id} readOnly className="text-maroon-light focus:ring-maroon-light" />
//                         <span className="font-bold text-dark-maroon">{addr.name}</span>
//                         {addr.is_default && <span className="text-xs bg-maroon-light text-white px-2 py-0.5 rounded">Default</span>}
//                       </div>
//                       <p className="text-sm text-muted-maroon ml-6 mt-1">{addr.street}, {addr.city}, {addr.state} {addr.pincode}</p>
//                     </div>
//                   ))}
                  
//                   <div 
//                     className={`p-4 border rounded-lg cursor-pointer ${selectedAddressId === 'new' ? 'border-maroon-light bg-maroon-light/5' : 'border-cream-beige'}`}
//                     onClick={() => setSelectedAddressId('new')}
//                   >
//                     <div className="flex items-center gap-2">
//                       <input type="radio" checked={selectedAddressId === 'new'} readOnly className="text-maroon-light focus:ring-maroon-light" />
//                       <span className="font-bold text-dark-maroon">Add New Address</span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {(!addresses.length || selectedAddressId === 'new') && (
//                 <form className="space-y-4">
//                   {/* Row 1: Full Name & Phone */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm text-dark-maroon mb-1">Full Name</label>
//                       <input required type="text" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-dark-maroon mb-1">Phone</label>
//                       <input required type="text" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                     </div>
//                   </div>

//                   {/* Row 2: Street Address */}
//                   <div>
//                     <label className="block text-sm text-dark-maroon mb-1">Street Address</label>
//                     <input required type="text" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                   </div>

//                   {/* Row 3: City */}
//                   <div>
//                     <label className="block text-sm text-dark-maroon mb-1">City</label>
//                     <input required type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                   </div>

//                   {/* Row 4: State & PIN Code */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm text-dark-maroon mb-1">State</label>
//                       <input required type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-dark-maroon mb-1">PIN Code</label>
//                       <input required type="text" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
//                     </div>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>

//           {/* Detailed Order Summary Box with Products */}
//           <div className="lg:col-span-1">
//             <div className="bg-white p-6 rounded-2xl border border-cream-beige/50 shadow-sm sticky top-24">
//               <h3 className="text-xl font-serif font-bold text-dark-maroon mb-4 border-b border-cream-beige/50 pb-4">Order Summary</h3>
              
//               {/* Product items loop */}
//               <div className="max-h-64 overflow-y-auto mb-6 divide-y divide-cream-beige/30 pr-1">
//                 {cart.map((item) => (
//                   <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-3 py-3 first:pt-0 last:pb-0">
//                     <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
//                       <img 
//                         src={item.variant?.image || item.product.images?.[0]?.image || 'https://via.placeholder.com/100x133'} 
//                         alt={item.product.name} 
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="flex-grow flex flex-col justify-between min-w-0">
//                       <div>
//                         <h4 className="text-sm font-medium text-dark-maroon truncate">{item.product.name}</h4>
//                         <div className="text-xs text-muted-maroon mt-0.5 space-y-0.5">
//                           {item.variant.color && <p>Color: {item.variant.color.name}</p>}
//                           {item.product.has_sizes && item.variant.size && <p>Size: {item.variant.size}</p>}
//                         </div>
//                       </div>
//                       <div className="flex justify-between items-end text-xs">
//                         <span className="text-muted-maroon">Qty: {item.quantity}</span>
//                         <span className="font-semibold text-dark-maroon">₹{item.product.price * item.quantity}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Pricing breakdowns */}
//               <div className="space-y-4 mb-6 text-dark-maroon border-t border-cream-beige/50 pt-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-maroon">Subtotal</span>
//                   <span className="font-medium">₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-muted-maroon">Shipping Estimate</span>
//                   <span className="font-medium">₹{shipping}</span>
//                 </div>
//                 <div className="border-t border-cream-beige/50 pt-4 flex justify-between items-center">
//                   <span className="text-base font-bold">Total</span>
//                   <span className="text-xl font-bold text-maroon-light">₹{totalAmount}</span>
//                 </div>
//               </div>

//               <Button 
//                 variant="accent" 
//                 className="w-full h-14 text-lg" 
//                 onClick={handleCheckout} 
//                 disabled={loading}
//               >
//                 {loading ? 'Processing...' : 'Buy Now'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';

export const Checkout = () => {
  const { cart, user, token, clearCart, deliveryConfig } = useStore();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to read passed state
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  const [addressForm, setAddressForm] = useState({
    name: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);

  // 1. Determine active checkout items (Buy Now single item VS Full Cart)
  const checkoutItems = location.state?.buyNowItem ? [location.state.buyNowItem] : cart;

  // 2. Compute calculations based on active checkout items only
  const subtotal = checkoutItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const totalQuantity = checkoutItems.reduce((total, item) => total + item.quantity, 0);
  
  const shipping = subtotal > 0 ? (totalQuantity <= 2 ? Number(deliveryConfig.charge_upto_two) : Number(deliveryConfig.charge_more_than_two)) : 0;
  const totalAmount = subtotal + shipping;

  useEffect(() => {
    // Redirect if there is neither a buy now item nor items in the cart
    if (checkoutItems.length === 0 && !paymentComplete) {
      navigate('/cart');
    }
    
    if (token) {
      userService.getAddresses(token)
        .then(data => {
          setAddresses(data);
          const defaultAddress = data.find(a => a.is_default);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else if (data.length > 0) {
            setSelectedAddressId(data[0].id);
          }
        })
        .catch(err => console.error(err));
    }
  }, [token, checkoutItems.length, navigate, paymentComplete]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let finalAddress = null;

    try {
      if (selectedAddressId && selectedAddressId !== 'new') {
        finalAddress = addresses.find(a => a.id === selectedAddressId);
      } else {
        if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
          throw new Error('Please fill in all address fields.');
        }
        
        finalAddress = {
          name: addressForm.name,
          phone: addressForm.phone,
          address: addressForm.street,
          city: addressForm.city,
          state: addressForm.state,
          pincode: addressForm.pincode
        };

        if (token) {
          await userService.addAddress(token, {
            ...addressForm,
            is_default: addresses.length === 0
          });
        }
      }

      // 3. Map items from checkoutItems instead of global cart
      const items = checkoutItems.map(item => ({
        variant: item.variant.id,
        quantity: item.quantity
      }));

      const orderPayload = {
        name: finalAddress.name,
        phone: finalAddress.phone,
        address: finalAddress.street || finalAddress.address,
        city: finalAddress.city,
        state: finalAddress.state,
        pincode: finalAddress.pincode,
        items: items
      };

      const orderData = await orderService.createOrder(orderPayload, token);

      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Variety Showroom',
        description: 'Test Transaction',
        order_id: orderData.razorpay_order_id,
        handler: async function (response) {
          try {
            const verifyRes = await orderService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, token);
            
            setPaymentComplete(true);
            
            // Only clear the cart if it was a normal cart checkout
            if (!location.state?.buyNowItem) {
              clearCart();
            }
            
            navigate('/order-confirmation', { 
              state: { 
                order_number: verifyRes.order_number || response.razorpay_order_id, 
                cart: [...checkoutItems], 
                totalAmount 
              } 
            });
          } catch (err) {
            setError(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: finalAddress.name,
          email: user?.email || '',
          contact: finalAddress.phone
        },
        theme: {
          color: '#5c1a1b'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white-bg pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-serif text-dark-maroon mb-8">Checkout</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Address Inputs */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-cream-beige/30 mb-6">
              <h3 className="text-xl font-serif font-bold text-dark-maroon mb-6">Shipping Address</h3>
              
              {addresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  {addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      className={`p-4 border rounded-lg cursor-pointer ${selectedAddressId === addr.id ? 'border-maroon-light bg-maroon-light/5' : 'border-cream-beige'}`}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      <div className="flex items-center gap-2">
                        <input type="radio" checked={selectedAddressId === addr.id} readOnly className="text-maroon-light focus:ring-maroon-light" />
                        <span className="font-bold text-dark-maroon">{addr.name}</span>
                        {addr.is_default && <span className="text-xs bg-maroon-light text-white px-2 py-0.5 rounded">Default</span>}
                      </div>
                      <p className="text-sm text-muted-maroon ml-6 mt-1">{addr.street}, {addr.city}, {addr.state} {addr.pincode}</p>
                    </div>
                  ))}
                  
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer ${selectedAddressId === 'new' ? 'border-maroon-light bg-maroon-light/5' : 'border-cream-beige'}`}
                    onClick={() => setSelectedAddressId('new')}
                  >
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={selectedAddressId === 'new'} readOnly className="text-maroon-light focus:ring-maroon-light" />
                      <span className="font-bold text-dark-maroon">Add New Address</span>
                    </div>
                  </div>
                </div>
              )}

              {(!addresses.length || selectedAddressId === 'new') && (
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-dark-maroon mb-1">Full Name</label>
                      <input required type="text" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm text-dark-maroon mb-1">Phone</label>
                      <input required type="text" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-dark-maroon mb-1">Street Address</label>
                    <input required type="text" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block text-sm text-dark-maroon mb-1">City</label>
                    <input required type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-dark-maroon mb-1">State</label>
                      <input required type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm text-dark-maroon mb-1">PIN Code</label>
                      <input required type="text" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Detailed Order Summary Box (renders checkoutItems) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-cream-beige/50 shadow-sm sticky top-24">
              <h3 className="text-xl font-serif font-bold text-dark-maroon mb-4 border-b border-cream-beige/50 pb-4">Order Summary</h3>
              
              <div className="max-h-64 overflow-y-auto mb-6 divide-y divide-cream-beige/30 pr-1">
                {checkoutItems.map((item) => (
                  <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.variant?.image || item.product.images?.[0]?.image || 'https://via.placeholder.com/100x133'} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between min-w-0">
                      <div>
                        <h4 className="text-sm font-medium text-dark-maroon truncate">{item.product.name}</h4>
                        <div className="text-xs text-muted-maroon mt-0.5 space-y-0.5">
                          {item.variant.color && <p>Color: {item.variant.color.name}</p>}
                          {item.product.has_sizes && item.variant.size && <p>Size: {item.variant.size}</p>}
                        </div>
                      </div>
                      <div className="flex justify-between items-end text-xs">
                        <span className="text-muted-maroon">Qty: {item.quantity}</span>
                        <span className="font-semibold text-dark-maroon">₹{item.product.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6 text-dark-maroon border-t border-cream-beige/50 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-maroon">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-maroon">Shipping Estimate</span>
                  <span className="font-medium">₹{shipping}</span>
                </div>
                <div className="border-t border-cream-beige/50 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-xl font-bold text-maroon-light">₹{totalAmount}</span>
                </div>
              </div>

              <Button 
                variant="accent" 
                className="w-full h-14 text-lg" 
                onClick={handleCheckout} 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
