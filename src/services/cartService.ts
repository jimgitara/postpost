import { CartItem, Order, PostcardTemplate, PostcardCustomization } from '../types';

class CartService {
  private storageKey = 'retropost_cart';
  private orderStorageKey = 'retropost_orders';

  // Dobij sve stavke iz košarice
  getCartItems(): CartItem[] {
    try {
      const items = localStorage.getItem(this.storageKey);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  }

  // Dodaj stavku u košaricu
  addToCart(template: PostcardTemplate, customization: PostcardCustomization, frontImageData?: string, backImageData?: string): CartItem {
    const cartItems = this.getCartItems();
    const price = template.price || 15; // Default cijena 15 kn
    
    const newItem: CartItem = {
      id: `${template.id}_${Date.now()}`,
      template,
      customization,
      quantity: 1,
      price,
      frontImageData,
      backImageData
    };

    cartItems.push(newItem);
    this.saveCart(cartItems);
    
    // Trigger cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cartItems }));
    
    return newItem;
  }

  // Ukloni stavku iz košarice
  removeFromCart(itemId: string): void {
    const cartItems = this.getCartItems().filter(item => item.id !== itemId);
    this.saveCart(cartItems);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cartItems }));
  }

  // Ažuriraj količinu
  updateQuantity(itemId: string, quantity: number): void {
    const cartItems = this.getCartItems();
    const item = cartItems.find(item => item.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
        this.saveCart(cartItems);
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cartItems }));
      }
    }
  }

  // Očisti košaricu
  clearCart(): void {
    localStorage.removeItem(this.storageKey);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
  }

  // Izračunaj ukupnu cijenu
  getCartTotal(): number {
    return this.getCartItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Dobij broj stavki u košarici
  getCartItemCount(): number {
    return this.getCartItems().reduce((count, item) => count + item.quantity, 0);
  }

  // Spremi košaricu
  private saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  // Kreiraj narudžbu
  createOrder(customerInfo: { name: string; email: string; phone?: string }): Order {
    const cartItems = this.getCartItems();
    
    if (cartItems.length === 0) {
      throw new Error('Košarica je prazna');
    }

    const order: Order = {
      id: `ORDER_${Date.now()}`,
      items: cartItems,
      total: this.getCartTotal(),
      customerInfo,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Spremi narudžbu
    this.saveOrder(order);
    
    // Očisti košaricu nakon narudžbe
    this.clearCart();
    
    return order;
  }

  // Spremi narudžbu
  private saveOrder(order: Order): void {
    try {
      const orders = this.getOrders();
      orders.push(order);
      localStorage.setItem(this.orderStorageKey, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order:', error);
    }
  }

  // Dobij sve narudžbe
  getOrders(): Order[] {
    try {
      const orders = localStorage.getItem(this.orderStorageKey);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  }

  // Dobij narudžbu po ID-u
  getOrder(orderId: string): Order | null {
    return this.getOrders().find(order => order.id === orderId) || null;
  }
}

export const cartService = new CartService();