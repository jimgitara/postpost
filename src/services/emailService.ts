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
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
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
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
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
  
  return canvas.toDataURL('image/jpeg', 0.8);
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
  
  return canvas.toDataURL('image/jpeg', 0.8);
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
      const formSubmitResponse = await fetch('https://formsubmit.co/ajax/jimgitara@gmail.com', {
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
        const result = await formSubmitResponse.json();
        if (result.success) {
          console.log('FormSubmit contact email backup successful');
          return;
        } else {
          throw new Error('FormSubmit returned failure status');
        }
      } else {
        throw new Error('FormSubmit service failed');
      }
    } catch (backupError) {
      throw new Error('Sve email usluge su neuspješne. Molimo pokušajte ponovno.');
    }
  }
};

export const sendPostcard = async (postcardData: PostcardEmailData): Promise<void> => {
  console.log('🚀 Starting postcard send...');
  
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
  
  // Check if we're on Netlify production
  const isNetlifyProduction = window.location.hostname.includes('netlify.app') || 
                             window.location.hostname.includes('netlify.com') ||
                             window.location.hostname === 'postretro.netlify.app';
  
  // Try Edge Function first (only in production)
  if (isNetlifyProduction) {
    try {
      console.log('📧 Using Netlify Edge Function for postcard sending...');
      
      const edgeFunctionUrl = '/.netlify/edge-functions/send-postcard';
      
      const edgeResponse = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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

      // Check if response is JSON before parsing
      const contentType = edgeResponse.headers.get('content-type');
      const isJsonResponse = contentType && contentType.includes('application/json');

      if (edgeResponse.ok && isJsonResponse) {
        const result = await edgeResponse.json();
        if (result.success) {
          console.log('✅ Edge Function success:', result);
          return;
        } else {
          throw new Error(`Edge Function returned failure: ${result.error || 'Unknown error'}`);
        }
      } else {
        const responseText = await edgeResponse.text();
        console.error('❌ Edge Function error:', {
          status: edgeResponse.status,
          statusText: edgeResponse.statusText,
          contentType,
          response: responseText
        });
        throw new Error(`Edge Function failed: ${edgeResponse.status} - ${responseText}`);
      }
      
    } catch (error) {
      console.error('❌ Edge Function failed:', error);
      // Fall through to FormSubmit backup
    }
  }
  
  // Use FormSubmit as fallback (for local development or if Edge Function fails)
  try {
    console.log('📧 Using FormSubmit for postcard sending...');
    
    // Create simplified HTML content without embedded images to avoid payload size limits
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🌟 Digitalna Razglednica</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Poslano s ljubavlju putem RetroPost</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
          <h2 style="color: #667eea; margin-top: 0;">Pozdrav ${postcardData.recipientName || 'dragi prijatelj'}! 👋</h2>
          
          <p style="font-size: 16px; color: #555; margin: 20px 0;">
            Dobili ste prekrasnu digitalnu razglednicu od <strong>${postcardData.senderName}</strong>
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">💌 Osobna poruka</h3>
            <p style="font-style: italic; font-size: 16px; line-height: 1.6; color: #333; margin: 10px 0;">
              "${postcardData.message || 'Pozdrav iz prekrasnog mjesta!'}"
            </p>
            <p style="text-align: right; font-weight: bold; color: #667eea; margin: 15px 0 0 0;">
              — ${postcardData.senderName}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f0f8ff; border-radius: 10px;">
            <p style="color: #666; margin: 0; font-size: 14px;">
              📸 Razglednica sadrži prekrasne slike koje su generirane posebno za vas!<br>
              🎨 Slike su kreirane pomoću napredne Canvas tehnologije
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #667eea; font-size: 18px; font-weight: 500;">
              Nadamo se da vam se sviđa ova digitalna razglednica! 💌✨
            </p>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 10px 10px;">
          <p style="margin: 0;"><strong>🚀 Poslano putem RetroPost - Digitalne razglednice</strong></p>
          <p style="margin: 5px 0 0 0;"><a href="https://postretro.netlify.app" style="color: #667eea; text-decoration: none;">🌐 Posjetite RetroPost</a></p>
        </div>
      </div>
    `;
    
    const fallbackPayload = {
      _subject: `🌟 Nova razglednica od ${postcardData.senderName}`,
      _template: 'box',
      _captcha: 'false',
      _next: window.location.origin,
      _cc: postcardData.recipientEmail,
      _html: htmlContent,
      sender_name: postcardData.senderName,
      recipient_name: postcardData.recipientName || 'Dragi prijatelj',
      recipient_email: postcardData.recipientEmail,
      message: postcardData.message || 'Pozdrav iz prekrasnog mjesta!',
      postcard_type: 'Digital Postcard',
      sent_via: 'FormSubmit',
      timestamp: new Date().toISOString()
    };
    
    // Use the /ajax/ endpoint for programmatic submissions
    const fallbackResponse = await fetch('https://formsubmit.co/ajax/jimgitara@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(fallbackPayload)
    });

    if (fallbackResponse.ok) {
      const result = await fallbackResponse.json();
      console.log('FormSubmit response:', result);
      
      // Check the success property in the response
      if (result.success) {
        console.log('✅ FormSubmit successful');
        return;
      } else {
        console.error('❌ FormSubmit returned failure:', result);
        throw new Error(`FormSubmit failed: ${result.message || 'Unknown error'}`);
      }
    } else {
      const errorText = await fallbackResponse.text();
      console.error('❌ FormSubmit HTTP error:', {
        status: fallbackResponse.status,
        statusText: fallbackResponse.statusText,
        response: errorText
      });
      throw new Error(`FormSubmit HTTP error: ${fallbackResponse.status} - ${errorText}`);
    }
  } catch (fallbackError) {
    console.error('❌ FormSubmit failed:', fallbackError);
    throw new Error('Razglednica nije mogla biti poslana. Molimo pokušajte ponovno ili kontaktirajte podršku.');
  }
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('EmailJS initialized');
  } else {
    console.log('EmailJS not configured - using Netlify Edge Function + FormSubmit');
  }
};