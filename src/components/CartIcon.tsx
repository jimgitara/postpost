import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { cartService } from '../services/cartService';

interface CartIconProps {
  onClick: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Initial load
    setItemCount(cartService.getCartItemCount());

    const handleCartUpdate = () => {
      setItemCount(cartService.getCartItemCount());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  return (
    <button
      onClick={onClick}
      className="relative flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-all duration-300"
    >
      <ShoppingCart className="h-5 w-5" />
      <span className="hidden sm:inline">Košarica</span>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;