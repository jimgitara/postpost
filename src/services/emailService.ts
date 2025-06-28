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
  console.log('Sending email with data:', formData);
  
  try {
    // Check if we're on Netlify production
    const isNetlifyProduction = window.location.hostname.includes('netlify.app') || 
                               window.location.hostname.includes('netlify.com');
    
    if (isNetlifyProduction) {
      console.log('Using Netlify Forms for email');
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "contact",
          ...formData
        })
      });

      if (response.ok) {
        console.log('Netlify email sent successfully');
        return;
      } else {
        console.log('Netlify email failed, trying backup');
        throw new Error('Netlify form submission failed');
      }
    } else {
      console.log('Not on Netlify, using FormSubmit directly');
      throw new Error('Using FormSubmit for local development');
    }
    
  } catch (error) {
    console.log('Using FormSubmit backup service for email');
    
    try {
      const formSubmitResponse = await fetch('https://formsubmit.co/jimgitara@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `RetroPost Contact: ${formData.subject}`,
          _template: 'table',
          _captcha: 'false',
          _next: window.location.origin + '/success',
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (formSubmitResponse.ok) {
        console.log('FormSubmit email backup successful');
        return;
      } else {
        throw new Error('FormSubmit email service failed');
      }
    } catch (backupError) {
      console.error('All email services failed:', backupError);
      throw new Error('Sve email usluge su neuspješne. Molimo pokušajte ponovno.');
    }
  }
};

export const sendPostcard = async (postcardData: PostcardEmailData): Promise<void> => {
  console.log('Sending postcard with data:', postcardData);
  
  // Validate required fields
  if (!postcardData.recipientEmail || !postcardData.senderName) {
    throw new Error('Nedostaju obavezni podaci za slanje razglednice');
  }
  
  try {
    // Check if we're on Netlify production
    const isNetlifyProduction = window.location.hostname.includes('netlify.app') || 
                               window.location.hostname.includes('netlify.com');
    
    if (isNetlifyProduction) {
      console.log('Using Netlify Forms for postcard');
      
      // Try Netlify Forms first
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
        console.log('Netlify postcard sent successfully');
        return;
      } else {
        console.log('Netlify postcard failed, status:', netlifyResponse.status);
        throw new Error('Netlify form submission failed');
      }
    } else {
      console.log('Not on Netlify, using FormSubmit directly');
      throw new Error('Using FormSubmit for local development');
    }
    
  } catch (error) {
    console.log('Using FormSubmit backup service for postcard');
    
    try {
      // Enhanced FormSubmit payload
      const formSubmitPayload = {
        _subject: `Nova razglednica od ${postcardData.senderName} za ${postcardData.recipientName}`,
        _template: 'table',
        _captcha: 'false',
        _next: window.location.origin + '/success',
        _cc: postcardData.recipientEmail, // Send copy to recipient
        sender_name: postcardData.senderName,
        recipient_name: postcardData.recipientName,
        recipient_email: postcardData.recipientEmail,
        message: postcardData.message,
        postcard_type: 'Digital Postcard',
        sent_via: 'RetroPost',
        full_message: `
🌟 DIGITALNA RAZGLEDNICA 🌟

Pozdrav ${postcardData.recipientName}!

Dobili ste prekrasnu digitalnu razglednicu od ${postcardData.senderName}:

"${postcardData.message}"

---
💌 Poslano s ljubavlju putem RetroPost
🌐 https://retropost.netlify.app
        `
      };
      
      console.log('Sending to FormSubmit with payload:', formSubmitPayload);
      
      const formSubmitResponse = await fetch('https://formsubmit.co/jimgitara@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formSubmitPayload)
      });

      console.log('FormSubmit response status:', formSubmitResponse.status);
      
      if (formSubmitResponse.ok) {
        console.log('FormSubmit postcard backup successful');
        return;
      } else {
        const errorText = await formSubmitResponse.text();
        console.error('FormSubmit error response:', errorText);
        throw new Error('FormSubmit service failed');
      }
    } catch (backupError) {
      console.error('FormSubmit backup failed:', backupError);
      
      // Last resort: Try a different approach
      try {
        console.log('Trying alternative FormSubmit approach');
        
        // Create a temporary form and submit it
        const form = document.createElement('form');
        form.action = 'https://formsubmit.co/jimgitara@gmail.com';
        form.method = 'POST';
        form.style.display = 'none';
        
        // Add form fields
        const fields = {
          _subject: `Nova razglednica od ${postcardData.senderName}`,
          _next: window.location.origin,
          _captcha: 'false',
          sender_name: postcardData.senderName,
          recipient_name: postcardData.recipientName,
          recipient_email: postcardData.recipientEmail,
          message: postcardData.message
        };
        
        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        console.log('Alternative FormSubmit approach initiated');
        return;
        
      } catch (finalError) {
        console.error('All postcard sending methods failed:', finalError);
        throw new Error('Sve metode slanja razglednice su neuspješne. Molimo kontaktirajte podršku.');
      }
    }
  }
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
};