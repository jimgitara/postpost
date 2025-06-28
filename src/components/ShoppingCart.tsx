import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Mail, Phone, User } from 'lucide-react';
import { CartItem, Order } from '../types';
import { cartService } from '../services/cartService';
import { sendOrderConfirmation } from '../services/emailService';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (isOpen) {
      setCartItems(cartService.getCartItems());
    }

    const handleCartUpdate = (event: CustomEvent) => {
      setCartItems(event.detail);
    };

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
  }, [isOpen]);

  const updateQuantity = (itemId: string, quantity: number) => {
    cartService.updateQuantity(itemId, quantity);
  };

  const removeItem = (itemId: string) => {
    cartService.removeFromCart(itemId);
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      alert('Molimo unesite ime i email adresu');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Kreiraj narudžbu
      const order = cartService.createOrder(customerInfo);
      
      // Pošalji potvrdu narudžbe na email
      await sendOrderConfirmation(order);
      
      setOrderComplete(order);
      setShowCheckout(false);
      
      // Reset customer info
      setCustomerInfo({ name: '', email: '', phone: '' });
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Greška pri obradi narudžbe. Molimo pokušajte ponovno.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <ShoppingBag className="h-6 w-6 mr-2 text-blue-500" />
              Košarica ({cartItems.reduce((count, item) => count + item.quantity, 0)})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Order Complete */}
          {orderComplete && (
            <div className="p-6 bg-green-50 border-b border-green-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Narudžba uspješno poslana!
                </h3>
                <p className="text-green-600 text-sm mb-2">
                  Broj narudžbe: <strong>{orderComplete.id}</strong>
                </p>
                <p className="text-green-600 text-sm">
                  Potvrda je poslana na {orderComplete.customerInfo.email}
                </p>
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Vaša košarica je prazna</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={item.template.image}
                        alt={item.template.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.template.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          "{item.customization.frontText}"
                        </p>
                        <p className="text-sm text-gray-500">
                          Za: {item.customization.recipientName || 'Nepoznato'}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold text-blue-600">
                            {item.price} kn
                          </span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 hover:bg-red-100 text-red-500 rounded ml-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Form */}
          {showCheckout && cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Podaci za narudžbu</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline h-4 w-4 mr-1" />
                    Ime i prezime *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Vaše ime"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email adresa *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="vas@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Telefon (opcionalno)
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+385 xx xxx xxxx"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Ukupno:</span>
                <span className="text-2xl font-bold text-blue-600">{total} kn</span>
              </div>
              
              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Nastavi s narudžbom</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing || !customerInfo.name || !customerInfo.email}
                    className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Obrađuje se...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5" />
                        <span>Potvrdi narudžbu</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-300 transition-all"
                  >
                    Natrag
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;