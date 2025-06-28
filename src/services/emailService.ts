import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_retropost',
  templateId: 'template_postcard',
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

// Convert canvas to base64 image with better error handling
export const capturePostcardImages = async (frontRef: HTMLElement, backRef: HTMLElement) => {
  try {
    console.log('Starting image capture...');
    
    // Dynamic import to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default;
    
    // Capture front with optimized settings
    console.log('Capturing front image...');
    const frontCanvas = await html2canvas(frontRef, {
      scale: 1.5, // Reduced from 2 for better performance
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false, // Disable logging for cleaner output
      imageTimeout: 15000, // 15 second timeout
      removeContainer: true
    });
    
    // Capture back with optimized settings
    console.log('Capturing back image...');
    const backCanvas = await html2canvas(backRef, {
      scale: 1.5, // Reduced from 2 for better performance
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 15000,
      removeContainer: true
    });
    
    const frontImage = frontCanvas.toDataURL('image/jpeg', 0.8); // JPEG with 80% quality
    const backImage = backCanvas.toDataURL('image/jpeg', 0.8);
    
    console.log('Images captured successfully');
    console.log('Front image size:', Math.round(frontImage.length / 1024), 'KB');
    console.log('Back image size:', Math.round(backImage.length / 1024), 'KB');
    
    return { frontImage, backImage };
  } catch (error) {
    console.error('Error capturing postcard images:', error);
    throw new Error('Greška pri snimanju razglednice. Molimo pokušajte ponovno.');
  }
};

export const sendEmail = async (formData: EmailData): Promise<void> => {
  console.log('Sending contact email with data:', formData);
  
  try {
    // Check deployment environment
    const isNetlifyProduction = window.location.hostname.includes('netlify.app') || 
                               window.location.hostname.includes('netlify.com') ||
                               window.location.hostname === 'postretro.netlify.app';
    
    console.log('Environment check - isNetlifyProduction:', isNetlifyProduction);
    
    if (isNetlifyProduction) {
      console.log('Using Netlify Forms for contact email');
      
      // Netlify Forms submission
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "contact",
          ...formData
        })
      });

      console.log('Netlify Forms response status:', response.status);

      if (response.ok) {
        console.log('Netlify contact email sent successfully');
        return;
      } else {
        const errorText = await response.text();
        console.error('Netlify Forms error:', errorText);
        throw new Error('Netlify form submission failed');
      }
    } else {
      console.log('Local development - using FormSubmit directly');
      throw new Error('Using FormSubmit for local development');
    }
    
  } catch (error) {
    console.log('Primary email service failed, using FormSubmit backup');
    
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
          _next: window.location.origin,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      console.log('FormSubmit response status:', formSubmitResponse.status);

      if (formSubmitResponse.ok) {
        console.log('FormSubmit contact email backup successful');
        return;
      } else {
        const errorText = await formSubmitResponse.text();
        console.error('FormSubmit error:', errorText);
        throw new Error('FormSubmit service failed');
      }
    } catch (backupError) {
      console.error('All contact email services failed:', backupError);
      throw new Error('Sve email usluge su neuspješne. Molimo pokušajte ponovno.');
    }
  }
};

export const sendPostcard = async (postcardData: PostcardEmailData): Promise<void> => {
  console.log('Starting postcard send process...');
  console.log('Postcard data:', {
    recipientEmail: postcardData.recipientEmail,
    recipientName: postcardData.recipientName,
    senderName: postcardData.senderName,
    messageLength: postcardData.message?.length || 0,
    hasFrontImage: !!postcardData.frontImageData,
    hasBackImage: !!postcardData.backImageData
  });
  
  // Validate required fields
  if (!postcardData.recipientEmail || !postcardData.senderName) {
    throw new Error('Nedostaju obavezni podaci za slanje razglednice');
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(postcardData.recipientEmail)) {
    throw new Error('Neispravna email adresa primatelja');
  }
  
  try {
    // Check deployment environment
    const isNetlifyProduction = window.location.hostname.includes('netlify.app') || 
                               window.location.hostname.includes('netlify.com') ||
                               window.location.hostname === 'postretro.netlify.app';
    
    console.log('Environment check - isNetlifyProduction:', isNetlifyProduction);
    
    if (isNetlifyProduction) {
      console.log('Attempting Netlify Forms for postcard...');
      
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

      console.log('Netlify Forms response status:', netlifyResponse.status);

      if (netlifyResponse.ok) {
        console.log('Netlify postcard sent successfully');
        return;
      } else {
        const errorText = await netlifyResponse.text();
        console.error('Netlify Forms postcard error:', errorText);
        throw new Error('Netlify form submission failed');
      }
    } else {
      console.log('Local development - using FormSubmit directly');
      throw new Error('Using FormSubmit for local development');
    }
    
  } catch (error) {
    console.log('Primary postcard service failed, using FormSubmit backup...');
    
    try {
      // Create enhanced HTML email with better formatting
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="hr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Digitalna Razglednica od ${postcardData.senderName}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 15px; 
              overflow: hidden; 
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 30px; 
              text-align: center; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px; 
              font-weight: 300; 
            }
            .content { 
              padding: 40px 30px; 
            }
            .greeting { 
              font-size: 18px; 
              color: #333; 
              margin-bottom: 20px; 
            }
            .postcard-container { 
              margin: 30px 0; 
              text-align: center; 
            }
            .postcard-title { 
              font-size: 16px; 
              font-weight: 600; 
              color: #555; 
              margin: 20px 0 10px 0; 
            }
            .postcard-image { 
              max-width: 100%; 
              height: auto; 
              border-radius: 10px; 
              box-shadow: 0 5px 15px rgba(0,0,0,0.15); 
              margin: 10px 0; 
              border: 3px solid #f0f0f0;
            }
            .message-box { 
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
              padding: 25px; 
              border-radius: 10px; 
              margin: 25px 0; 
              border-left: 5px solid #667eea; 
            }
            .message-title { 
              font-size: 16px; 
              font-weight: 600; 
              color: #333; 
              margin-bottom: 15px; 
            }
            .message-text { 
              font-size: 16px; 
              line-height: 1.6; 
              color: #555; 
              font-style: italic; 
            }
            .signature { 
              text-align: right; 
              font-weight: 600; 
              margin-top: 20px; 
              color: #667eea; 
              font-size: 16px; 
            }
            .footer { 
              background: #f8f9fa; 
              padding: 25px; 
              text-align: center; 
              color: #666; 
              font-size: 14px; 
            }
            .footer a { 
              color: #667eea; 
              text-decoration: none; 
            }
            .divider { 
              height: 2px; 
              background: linear-gradient(90deg, transparent, #667eea, transparent); 
              margin: 20px 0; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌟 Digitalna Razglednica 🌟</h1>
              <p>Poslano s ljubavlju putem RetroPost</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Pozdrav <strong>${postcardData.recipientName}</strong>! 👋
              </div>
              
              <p>Dobili ste prekrasnu digitalnu razglednicu od <strong>${postcardData.senderName}</strong>:</p>
              
              <div class="divider"></div>
              
              <div class="postcard-container">
                <div class="postcard-title">📮 Prednja strana razglednice:</div>
                ${postcardData.frontImageData ? 
                  `<img src="${postcardData.frontImageData}" alt="Prednja strana razglednice" class="postcard-image">` : 
                  '<p style="color: #999; font-style: italic;">Slika razglednice nije dostupna</p>'
                }
                
                <div class="postcard-title">✉️ Stražnja strana razglednice:</div>
                ${postcardData.backImageData ? 
                  `<img src="${postcardData.backImageData}" alt="Stražnja strana razglednice" class="postcard-image">` : 
                  '<p style="color: #999; font-style: italic;">Slika razglednice nije dostupna</p>'
                }
              </div>
              
              <div class="message-box">
                <div class="message-title">💌 Osobna poruka:</div>
                <div class="message-text">"${postcardData.message}"</div>
                <div class="signature">- ${postcardData.senderName}</div>
              </div>
              
              <div class="divider"></div>
              
              <p style="text-align: center; color: #667eea; font-size: 16px;">
                Nadamo se da vam se sviđa ova digitalna razglednica! 💝
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Poslano putem RetroPost</strong> - Digitalne razglednice</p>
              <p><a href="https://postretro.netlify.app">🌐 postretro.netlify.app</a></p>
              <p style="margin-top: 15px; font-size: 12px; color: #999;">
                Ova razglednica je kreirana i poslana putem RetroPost platforme
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Enhanced FormSubmit payload
      const formSubmitPayload = {
        _subject: `🌟 Nova razglednica od ${postcardData.senderName}`,
        _template: 'box',
        _captcha: 'false',
        _next: window.location.origin,
        _cc: postcardData.recipientEmail, // Send copy to recipient
        _autoresponse: `Hvala vam što ste poslali razglednicu putem RetroPost! Vaša razglednica je uspješno dostavljena na ${postcardData.recipientEmail}.`,
        sender_name: postcardData.senderName,
        recipient_name: postcardData.recipientName,
        recipient_email: postcardData.recipientEmail,
        message: postcardData.message,
        postcard_html: htmlContent, // Include full HTML
        _format: 'html'
      };
      
      console.log('Sending enhanced postcard via FormSubmit...');
      
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
        console.log('FormSubmit postcard sent successfully');
        return;
      } else {
        const errorText = await formSubmitResponse.text();
        console.error('FormSubmit error response:', errorText);
        throw new Error(`FormSubmit service failed: ${formSubmitResponse.status}`);
      }
    } catch (backupError) {
      console.error('FormSubmit backup failed:', backupError);
      
      // Final fallback: Try EmailJS if configured
      try {
        console.log('Trying EmailJS as final backup...');
        
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
        } else {
          console.log('EmailJS not configured, skipping...');
        }
      } catch (emailJSError) {
        console.error('EmailJS backup failed:', emailJSError);
      }
      
      throw new Error('Sve metode slanja razglednice su neuspješne. Molimo kontaktirajte podršku na jimgitara@gmail.com');
    }
  }
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('EmailJS initialized');
  } else {
    console.log('EmailJS not configured - using Netlify Forms and FormSubmit');
  }
};