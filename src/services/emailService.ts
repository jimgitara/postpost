import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_retropost',
  templateId: 'template_contact',
  publicKey: 'YOUR_PUBLIC_KEY',
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
  console.log('Sending postcard with data:', postcardData);
  
  try {
    // Primary: Try Netlify Forms
    const netlifyResponse = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": "postcard",
        recipient_name: postcardData.recipientName,
        recipient_email: postcardData.recipientEmail,
        sender_name: postcardData.senderName,
        message: postcardData.message
      })
    });

    if (netlifyResponse.ok) {
      console.log('Netlify form submission successful');
      return;
    } else {
      console.log('Netlify failed, trying FormSubmit backup');
      throw new Error('Netlify form submission failed');
    }
    
  } catch (error) {
    console.log('Using FormSubmit backup service');
    
    try {
      // Backup: FormSubmit.co
      const formSubmitResponse = await fetch('https://formsubmit.co/jimgitara@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Nova razglednica od ${postcardData.senderName}`,
          _template: 'table',
          _captcha: 'false',
          _next: 'https://retropost.netlify.app/success',
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

      if (formSubmitResponse.ok) {
        console.log('FormSubmit backup successful');
        return;
      } else {
        throw new Error('FormSubmit service failed');
      }
    } catch (backupError) {
      console.error('All email services failed:', backupError);
      throw new Error('Sve email usluge su neuspješne. Molimo pokušajte ponovno.');
    }
  }
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
};