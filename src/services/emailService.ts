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
  frontImageData?: string;
  backImageData?: string;
}

const encode = (data: Record<string, string>) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

// Convert canvas to base64 image
export const capturePostcardImages = async (frontRef: HTMLElement, backRef: HTMLElement) => {
  const html2canvas = (await import('html2canvas')).default;
  
  try {
    const frontCanvas = await html2canvas(frontRef, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    const backCanvas = await html2canvas(backRef, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    return {
      frontImage: frontCanvas.toDataURL('image/png'),
      backImage: backCanvas.toDataURL('image/png')
    };
  } catch (error) {
    console.error('Error capturing postcard images:', error);
    throw new Error('Greška pri snimanju razglednice');
  }
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
          message: postcardData.message,
          front_image: postcardData.frontImageData || '',
          back_image: postcardData.backImageData || ''
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
      // Create beautiful HTML email with embedded images
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Digitalna Razglednica</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .postcard-container { margin: 20px 0; text-align: center; }
            .postcard-image { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); margin: 10px 0; }
            .message-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .signature { text-align: right; font-style: italic; margin-top: 15px; color: #555; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Digitalna Razglednica 🌟</h1>
              <p>Poslano s ljubavlju putem RetroPost</p>
            </div>
            
            <div class="content">
              <h2>Pozdrav ${postcardData.recipientName}!</h2>
              <p>Dobili ste prekrasnu digitalnu razglednicu od <strong>${postcardData.senderName}</strong>:</p>
              
              <div class="postcard-container">
                <h3>Prednja strana razglednice:</h3>
                ${postcardData.frontImageData ? `<img src="${postcardData.frontImageData}" alt="Prednja strana razglednice" class="postcard-image">` : '<p>Slika razglednice nije dostupna</p>'}
                
                <h3>Stražnja strana razglednice:</h3>
                ${postcardData.backImageData ? `<img src="${postcardData.backImageData}" alt="Stražnja strana razglednice" class="postcard-image">` : '<p>Slika razglednice nije dostupna</p>'}
              </div>
              
              <div class="message-box">
                <h3>Osobna poruka:</h3>
                <p>"${postcardData.message}"</p>
                <div class="signature">- ${postcardData.senderName}</div>
              </div>
              
              <p>Nadamo se da vam se sviđa ova digitalna razglednica! 💌</p>
            </div>
            
            <div class="footer">
              <p>Poslano putem RetroPost - Digitalne razglednice</p>
              <p><a href="https://retropost.netlify.app">https://retropost.netlify.app</a></p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Enhanced FormSubmit payload with HTML content
      const formSubmitPayload = {
        _subject: `🌟 Nova razglednica od ${postcardData.senderName} za ${postcardData.recipientName}`,
        _template: 'box',
        _captcha: 'false',
        _next: window.location.origin + '/success',
        _cc: postcardData.recipientEmail, // Send copy to recipient
        _format: 'html', // Enable HTML format
        sender_name: postcardData.senderName,
        recipient_name: postcardData.recipientName,
        recipient_email: postcardData.recipientEmail,
        message: postcardData.message,
        postcard_type: 'Digital Postcard',
        sent_via: 'RetroPost',
        _html: htmlContent, // Include HTML content
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
      
      console.log('Sending to FormSubmit with HTML payload');
      
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
      
      // Last resort: Try EmailJS if configured
      try {
        console.log('Trying EmailJS as final backup');
        
        if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
          const emailJSPayload = {
            to_email: postcardData.recipientEmail,
            to_name: postcardData.recipientName,
            from_name: postcardData.senderName,
            message: postcardData.message,
            subject: `Digitalna razglednica od ${postcardData.senderName}`,
            front_image: postcardData.frontImageData,
            back_image: postcardData.backImageData
          };
          
          await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            emailJSPayload,
            EMAILJS_CONFIG.publicKey
          );
          
          console.log('EmailJS backup successful');
          return;
        }
      } catch (emailJSError) {
        console.error('EmailJS backup failed:', emailJSError);
      }
      
      throw new Error('Sve metode slanja razglednice su neuspješne. Molimo kontaktirajte podršku.');
    }
  }
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
};