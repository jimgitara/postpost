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

interface PostcardCanvasData {
  backgroundImageUrl: string;
  frontText: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  message: string;
  signature: string;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
}

const encode = (data: Record<string, string>) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

// INSTANT Canvas generation - NO DOM dependency
export const generatePostcardCanvasDirectly = async (data: PostcardCanvasData): Promise<{ frontImage: string; backImage: string }> => {
  console.log('🎨 DIRECT Canvas generation starting...');
  
  try {
    // Generate front and back in parallel
    const [frontImage, backImage] = await Promise.all([
      generateFrontCanvasDirect(data),
      generateBackCanvasDirect(data)
    ]);
    
    console.log('✅ DIRECT Canvas generation completed!');
    
    return { frontImage, backImage };
    
  } catch (error) {
    console.error('❌ Canvas generation failed:', error);
    
    // Emergency fallback
    const fallbackFront = generateFallbackCanvas('Pozdrav iz prekrasnog mjesta!', '#667eea', '#764ba2');
    const fallbackBack = generateFallbackCanvas('RetroPost Razglednica', '#ffffff', '#f8f9fa');
    
    return {
      frontImage: fallbackFront,
      backImage: fallbackBack
    };
  }
};

// Generate front canvas
const generateFrontCanvasDirect = async (data: PostcardCanvasData): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Draw background image
      ctx.drawImage(img, 0, 0, 600, 400);
      
      // Add overlay for better text visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, 600, 400);
      
      // Configure text
      const fontMap: Record<string, string> = {
        'serif': 'serif',
        'sans': 'Arial, sans-serif',
        'mono': 'Courier New, monospace',
        'cursive': 'cursive'
      };
      
      ctx.fillStyle = data.textColor;
      ctx.font = `bold ${data.fontSize}px ${fontMap[data.fontFamily] || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Word wrap text
      const words = data.frontText.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > 500 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      
      // Draw text lines
      const lineHeight = data.fontSize * 1.2;
      const startY = 200 - ((lines.length - 1) * lineHeight) / 2;
      
      lines.forEach((line, index) => {
        ctx.fillText(line, 300, startY + index * lineHeight);
      });
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Add branding
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('RetroPost', 580, 380);
      
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    
    img.onerror = () => {
      // Create gradient background as fallback
      const gradient = ctx.createLinearGradient(0, 0, 600, 400);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 400);
      
      // Add text
      ctx.fillStyle = data.textColor;
      ctx.font = `bold ${data.fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      const words = data.frontText.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > 500 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      
      const lineHeight = data.fontSize * 1.2;
      const startY = 200 - ((lines.length - 1) * lineHeight) / 2;
      
      lines.forEach((line, index) => {
        ctx.fillText(line, 300, startY + index * lineHeight);
      });
      
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    
    img.src = data.backgroundImageUrl;
  });
};

// Generate back canvas
const generateBackCanvasDirect = (data: PostcardCanvasData): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;
  
  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 600, 400);
  
  // Border
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, 580, 380);
  
  // Header
  ctx.fillStyle = '#333';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('RetroPost Razglednica', 300, 50);
  
  // Message section
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('PORUKA:', 30, 90);
  
  // Message text with word wrap
  ctx.font = '16px Arial';
  ctx.fillStyle = '#555';
  const messageWords = data.message.split(' ');
  let messageLine = '';
  let messageY = 120;
  
  for (const word of messageWords) {
    const testLine = messageLine + (messageLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > 520 && messageLine) {
      ctx.fillText(messageLine, 30, messageY);
      messageLine = word;
      messageY += 25;
    } else {
      messageLine = testLine;
    }
  }
  if (messageLine) {
    ctx.fillText(messageLine, 30, messageY);
  }
  
  // Signature
  if (data.signature) {
    ctx.font = 'italic 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#667eea';
    ctx.fillText(`- ${data.signature}`, 570, messageY + 40);
  }
  
  // Divider line
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 300);
  ctx.lineTo(570, 300);
  ctx.stroke();
  
  // Address section
  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'left';
  ctx.fillText('PRIMA:', 30, 330);
  
  ctx.font = '14px Arial';
  ctx.fillStyle = '#555';
  ctx.fillText(data.recipientName, 30, 350);
  ctx.font = '12px Arial';
  ctx.fillStyle = '#777';
  ctx.fillText(data.recipientEmail, 30, 370);
  
  // Sender
  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'right';
  ctx.fillText('ŠALJE:', 570, 330);
  
  ctx.font = '14px Arial';
  ctx.fillStyle = '#555';
  ctx.fillText(data.senderName, 570, 350);
  
  // Footer
  ctx.font = '10px Arial';
  ctx.fillStyle = '#999';
  ctx.textAlign = 'center';
  ctx.fillText('RetroPost.com - Digitalne razglednice', 300, 390);
  
  return canvas.toDataURL('image/jpeg', 0.6);
};

// Fallback canvas generator
const generateFallbackCanvas = (text: string, color1: string, color2: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createLinearGradient(0, 0, 600, 400);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);
  
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.fillText(text, 300, 200);
  
  return canvas.toDataURL('image/jpeg', 0.6);
};

// Legacy function for backward compatibility
export const capturePostcardImages = async (frontRef: HTMLElement, backRef: HTMLElement) => {
  console.log('⚡ Legacy function redirecting to DIRECT Canvas generation...');
  
  return generatePostcardCanvasDirectly({
    backgroundImageUrl: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
    frontText: 'Pozdrav iz prekrasnog mjesta!',
    textColor: '#ffffff',
    fontSize: 24,
    fontFamily: 'serif',
    message: 'Vaša poruka ovdje...',
    signature: '',
    recipientName: 'Ime primatelja',
    recipientEmail: 'email@primjer.com',
    senderName: 'Vaše ime'
  });
};

export const sendEmail = async (formData: EmailData): Promise<void> => {
  console.log('Sending contact email with data:', formData);
  
  try {
    const isNetlifyProduction = window.location.hostname.includes('netlify.app') || 
                               window.location.hostname.includes('netlify.com') ||
                               window.location.hostname === 'postretro.netlify.app';
    
    if (isNetlifyProduction) {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "contact",
          ...formData
        })
      });

      if (response.ok) {
        console.log('Netlify contact email sent successfully');
        return;
      } else {
        throw new Error('Netlify form submission failed');
      }
    } else {
      throw new Error('Using FormSubmit for local development');
    }
    
  } catch (error) {
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

      if (formSubmitResponse.ok) {
        console.log('FormSubmit contact email backup successful');
        return;
      } else {
        throw new Error('FormSubmit service failed');
      }
    } catch (backupError) {
      throw new Error('Sve email usluge su neuspješne. Molimo pokušajte ponovno.');
    }
  }
};

export const sendPostcard = async (postcardData: PostcardEmailData): Promise<void> => {
  console.log('📧 Starting postcard send with PROPER BACKEND...');
  
  // Validate required fields
  if (!postcardData.recipientEmail || !postcardData.senderName) {
    throw new Error('Nedostaju obavezni podaci za slanje razglednice');
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(postcardData.recipientEmail)) {
    throw new Error('Neispravna email adresa primatelja');
  }

  // Validate that we have image data
  if (!postcardData.frontImageData || !postcardData.backImageData) {
    throw new Error('Nedostaju slike razglednice');
  }
  
  try {
    // Check if we're on Netlify (has edge functions)
    const isNetlifyProduction = window.location.hostname.includes('netlify.app') || 
                               window.location.hostname.includes('netlify.com') ||
                               window.location.hostname === 'postretro.netlify.app';
    
    if (isNetlifyProduction) {
      console.log('📧 Using Netlify Edge Function for postcard with images');
      
      // Use Netlify Edge Function
      const response = await fetch('/.netlify/functions/send-postcard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: postcardData.recipientEmail,
          recipientName: postcardData.recipientName || 'Dragi prijatelj',
          senderName: postcardData.senderName,
          message: postcardData.message || 'Pozdrav iz prekrasnog mjesta!',
          frontImageData: postcardData.frontImageData,
          backImageData: postcardData.backImageData
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Netlify Edge Function success:', result);
        return;
      } else {
        const error = await response.json();
        console.error('❌ Netlify Edge Function error:', error);
        throw new Error(error.error || 'Netlify function failed');
      }
    } else {
      console.log('🏠 Local development - using direct FormSubmit');
      throw new Error('Using FormSubmit for local development');
    }
    
  } catch (error) {
    console.log('📧 Backend failed, using FormSubmit with embedded images');
    
    try {
      // Create HTML email with embedded base64 images
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>🌟 Digitalna Razglednica od ${postcardData.senderName}</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container { 
              max-width: 700px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 20px; 
              overflow: hidden; 
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
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
              font-weight: bold;
            }
            .content { 
              padding: 40px; 
            }
            .greeting {
              font-size: 20px;
              color: #333;
              margin-bottom: 20px;
            }
            .postcard-container { 
              margin: 30px 0; 
              text-align: center; 
            }
            .postcard-image { 
              max-width: 100%; 
              height: auto; 
              border-radius: 15px; 
              box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
              margin: 15px 0; 
              border: 3px solid #f8f9fa;
              display: block;
              margin-left: auto;
              margin-right: auto;
            }
            .postcard-title {
              font-size: 18px;
              font-weight: bold;
              color: #667eea;
              margin: 20px 0 10px 0;
            }
            .message-box { 
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
              padding: 25px; 
              border-radius: 15px; 
              margin: 25px 0; 
              border-left: 5px solid #667eea; 
              box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .message-box h3 {
              color: #667eea;
              margin-top: 0;
              font-size: 18px;
            }
            .message-text {
              font-size: 16px;
              line-height: 1.6;
              color: #333;
              font-style: italic;
            }
            .signature { 
              text-align: right; 
              font-weight: bold; 
              margin-top: 15px; 
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
              font-weight: bold;
            }
            .emoji {
              font-size: 24px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="emoji">🌟</div>
              <h1>Digitalna Razglednica</h1>
              <p>Poslano s ljubavlju putem RetroPost</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Pozdrav <strong>${postcardData.recipientName || 'dragi prijatelj'}</strong>! 👋
              </div>
              
              <p>Dobili ste prekrasnu digitalnu razglednicu od <strong>${postcardData.senderName}</strong>:</p>
              
              <div class="postcard-container">
                <div class="postcard-title">🖼️ Prednja strana razglednice:</div>
                <img src="${postcardData.frontImageData}" alt="Prednja strana razglednice" class="postcard-image">
                
                <div class="postcard-title">📝 Stražnja strana razglednice:</div>
                <img src="${postcardData.backImageData}" alt="Stražnja strana razglednice" class="postcard-image">
              </div>
              
              <div class="message-box">
                <h3>💌 Osobna poruka:</h3>
                <div class="message-text">"${postcardData.message}"</div>
                <div class="signature">- ${postcardData.senderName}</div>
              </div>
              
              <p style="text-align: center; color: #667eea; font-size: 18px;">
                Nadamo se da vam se sviđa ova digitalna razglednica! 💌
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Poslano putem RetroPost - Digitalne razglednice</strong></p>
              <p><a href="https://postretro.netlify.app">🌐 https://postretro.netlify.app</a></p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Send via FormSubmit with embedded images
      const formSubmitPayload = {
        _subject: `🌟 Nova razglednica od ${postcardData.senderName}`,
        _template: 'box',
        _captcha: 'false',
        _next: window.location.origin,
        _cc: postcardData.recipientEmail,
        _html: htmlContent,
        sender_name: postcardData.senderName,
        recipient_name: postcardData.recipientName || 'Dragi prijatelj',
        recipient_email: postcardData.recipientEmail,
        message: postcardData.message,
        postcard_type: 'Digital Postcard with Embedded Images'
      };
      
      const formSubmitResponse = await fetch('https://formsubmit.co/jimgitara@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formSubmitPayload)
      });

      if (formSubmitResponse.ok) {
        console.log('✅ FormSubmit with embedded images successful');
        return;
      } else {
        const errorText = await formSubmitResponse.text();
        console.error('❌ FormSubmit error:', errorText);
        throw new Error('FormSubmit service failed');
      }
    } catch (backupError) {
      console.error('❌ All postcard services failed:', backupError);
      throw new Error('Email servis trenutno nije dostupan. Molimo kontaktirajte podršku na jimgitara@gmail.com');
    }
  }
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('EmailJS initialized');
  } else {
    console.log('EmailJS not configured - using Netlify Edge Functions and FormSubmit');
  }
};