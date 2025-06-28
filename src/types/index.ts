export interface PostcardTemplate {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
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