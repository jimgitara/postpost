import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_retropost', // Replace with your EmailJS service ID
  templateId: 'template_contact', // Replace with your EmailJS template ID
  publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS public key
};

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface PostcardEmailData {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  message: string;
  postcardImageUrl?: string;
}

const encode = (data: Record<string, string>) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

export const sendEmail = async (formData: EmailData): Promise<void> => {
  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": "contact",
        ...formData
      })
    });

    if (!response.ok) {
      throw new Error('Netlify form submission failed');
    }

    return;
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendPostcard = async (postcardData: PostcardEmailData): Promise<void> => {
  try {
    // Create a proper form submission for postcard
    const formData = new FormData();
    formData.append('form-name', 'postcard');
    formData.append('recipient_name', postcardData.recipientName);
    formData.append('recipient_email', postcardData.recipientEmail);
    formData.append('sender_name', postcardData.senderName);
    formData.append('message', postcardData.message);
    
    const response = await fetch("/", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      // Fallback to FormSubmit if Netlify fails
      const fallbackResponse = await fetch('https://formsubmit.co/jimgitara@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Nova razglednica od ${postcardData.senderName}`,
          _template: 'table',
          _captcha: 'false',
          sender_name: postcardData.senderName,
          recipient_name: postcardData.recipientName,
          recipient_email: postcardData.recipientEmail,
          message: postcardData.message,
          full_message: `
Pozdrav ${postcardData.recipientName}!

Dobili ste digitalnu razglednicu od ${postcardData.senderName}:

"${postcardData.message}"

---
Poslano putem RetroPost - Digitalne Razglednice
          `
        })
      });

      if (!fallbackResponse.ok) {
        throw new Error('Both Netlify and FormSubmit failed');
      }
    }

    return;
    
  } catch (error) {
    console.error('Error sending postcard:', error);
    throw error;
  }
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
};