export interface PostcardTemplate {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  price?: number; // Dodana cijena
}

export interface PostcardCustomization {
  frontText: string;
  frontTextColor: string;
  frontTextSize: number;
  frontTextFont: string;
  message: string;
  signature: string;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  scheduledDate?: string;
}

export interface EmailData {
  to: string;
  subject: string;
  template: PostcardTemplate;
  customization: PostcardCustomization;
}

// Novi tipovi za e-commerce
export interface CartItem {
  id: string;
  template: PostcardTemplate;
  customization: PostcardCustomization;
  quantity: number;
  price: number;
  frontImageData?: string;
  backImageData?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}