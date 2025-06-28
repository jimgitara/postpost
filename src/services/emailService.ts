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

// INSTANT Canvas-based postcard generation - NO html2canvas!
const generatePostcardCanvas = async (
  backgroundImageUrl: string, 
  frontText: string, 
  textColor: string, 
  fontSize: number, 
  fontFamily: string
): Promise<string> => {
  console.log('🎨 Generating canvas postcard instantly...');
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;
    
    // Create background image
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
      
      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px ${fontMap[fontFamily] || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Word wrap text
      const words = frontText.split(' ');
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
      const lineHeight = fontSize * 1.2;
      const startY = 200 - ((lines.length - 1) * lineHeight) / 2;
      
      lines.forEach((line, index) => {
        ctx.fillText(line, 300, startY + index * lineHeight);
      });
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Add subtle branding
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('RetroPost', 580, 380);
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    img.onerror = () => {
      console.log('🎨 Image failed to load, creating gradient background');
      
      // Create gradient background as fallback
      const gradient = ctx.createLinearGradient(0, 0, 600, 400);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 400);
      
      // Add text with same styling as above
      ctx.fillStyle = textColor;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      const words = frontText.split(' ');
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
      
      const lineHeight = fontSize * 1.2;
      const startY = 200 - ((lines.length - 1) * lineHeight) / 2;
      
      lines.forEach((line, index) => {
        ctx.fillText(line, 300, startY + index * lineHeight);
      });
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    
    // Start loading image
    img.src = backgroundImageUrl;
  });
};

// INSTANT back side generation
const generateBackCanvas = (
  message: string, 
  signature: string, 
  recipientName: string, 
  recipientEmail: string, 
  senderName: string
): string => {
  console.log('📝 Generating back canvas instantly...');
  
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
  const messageWords = message.split(' ');
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
  if (signature) {
    ctx.font = 'italic 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#667eea';
    ctx.fillText(`- ${signature}`, 570, messageY + 40);
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
  ctx.fillText(recipientName || 'Ime primatelja', 30, 350);
  ctx.font = '12px Arial';
  ctx.fillStyle = '#777';
  ctx.fillText(recipientEmail, 30, 370);
  
  // Sender
  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'right';
  ctx.fillText('ŠALJE:', 570, 330);
  
  ctx.font = '14px Arial';
  ctx.fillStyle = '#555';
  ctx.fillText(senderName, 570, 350);
  
  // Footer
  ctx.font = '10px Arial';
  ctx.fillStyle = '#999';
  ctx.textAlign = 'center';
  ctx.fillText('RetroPost.com - Digitalne razglednice', 300, 390);
  
  return canvas.toDataURL('image/jpeg', 0.8);
};

// SUPER FAST postcard generation - NO html2canvas dependency!
export const capturePostcardImages = async (frontRef: HTMLElement, backRef: HTMLElement) => {
  console.log('⚡ INSTANT Canvas generation starting...');
  
  try {
    // Extract data from DOM elements
    const frontTextElement = frontRef.querySelector('div[style*="color"]') as HTMLElement;
    const frontText = frontTextElement?.textContent || 'Pozdrav iz prekrasnog mjesta!';
    
    // Extract styling
    const computedStyle = frontTextElement ? window.getComputedStyle(frontTextElement) : null;
    const textColor = computedStyle?.color || '#ffffff';
    const fontSize = parseInt(computedStyle?.fontSize || '24') || 24;
    const fontFamily = computedStyle?.fontFamily?.includes('serif') ? 'serif' : 
                      computedStyle?.fontFamily?.includes('mono') ? 'mono' :
                      computedStyle?.fontFamily?.includes('cursive') ? 'cursive' : 'sans';
    
    // Get background image
    const imgElement = frontRef.querySelector('img') as HTMLImageElement;
    const backgroundImageUrl = imgElement?.src || 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800';
    
    // Extract back side data
    const messageElements = backRef.querySelectorAll('div');
    let message = 'Vaša poruka ovdje...';
    let signature = '';
    let recipientName = 'Ime primatelja';
    let recipientEmail = 'email@primjer.com';
    let senderName = 'Vaše ime';
    
    // Try to extract actual data from back side
    messageElements.forEach(el => {
      const text = el.textContent || '';
      if (text.includes('Ovdje će biti vaša osobna poruka') || text.length > 20) {
        message = text.replace('Ovdje će biti vaša osobna poruka...', '').trim() || message;
      }
      if (text.includes('Ime primatelja') && text !== 'Ime primatelja') {
        recipientName = text;
      }
      if (text.includes('@')) {
        recipientEmail = text;
      }
      if (text.includes('Vaše ime') && text !== 'Vaše ime') {
        senderName = text;
      }
    });
    
    console.log('📊 Extracted data:', { frontText, textColor, fontSize, fontFamily, message, recipientName, senderName });
    
    // Generate both images in parallel using Canvas API
    const [frontImage, backImage] = await Promise.all([
      generatePostcardCanvas(backgroundImageUrl, frontText, textColor, fontSize, fontFamily),
      Promise.resolve(generateBackCanvas(message, signature, recipientName, recipientEmail, senderName))
    ]);
    
    console.log('✅ Canvas generation completed instantly!');
    
    return {
      frontImage,
      backImage
    };
    
  } catch (error) {
    console.error('❌ Canvas generation failed:', error);
    
    // Emergency fallback - simple colored rectangles with text
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;
    
    // Front fallback
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Pozdrav iz prekrasnog mjesta!', 300, 200);
    
    const frontFallback = canvas.toDataURL('image/jpeg', 0.8);
    
    // Back fallback
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('RetroPost Razglednica', 300, 200);
    
    const backFallback = canvas.toDataURL('image/jpeg', 0.8);
    
    return {
      frontImage: frontFallback,
      backImage: backFallback
    };
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
  console.log('⚡ INSTANT postcard send starting...');
  console.log('📋 Postcard data:', {
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
    
    console.log('🌐 Environment check - isNetlifyProduction:', isNetlifyProduction);
    
    if (isNetlifyProduction) {
      console.log('📝 Attempting Netlify Forms for postcard...');
      
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

      console.log('📤 Netlify Forms response status:', netlifyResponse.status);

      if (netlifyResponse.ok) {
        console.log('✅ Netlify postcard sent successfully');
        return;
      } else {
        const errorText = await netlifyResponse.text();
        console.error('❌ Netlify Forms postcard error:', errorText);
        throw new Error('Netlify form submission failed');
      }
    } else {
      console.log('🏠 Local development - using FormSubmit directly');
      throw new Error('Using FormSubmit for local development');
    }
    
  } catch (error) {
    console.log('🔄 Primary postcard service failed, using FormSubmit backup...');
    
    try {
      // Create OPTIMIZED HTML email
      const optimizedHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🌟 Digitalna Razglednica 🌟</h1>
            <p style="margin: 10px 0 0 0;">Poslano putem RetroPost</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Pozdrav ${postcardData.recipientName}! 👋</h2>
            
            <p style="color: #555; font-size: 16px;">
              Dobili ste prekrasnu digitalnu razglednicu od <strong>${postcardData.senderName}</strong>:
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">💌 Osobna poruka:</h3>
              <p style="color: #555; font-style: italic; font-size: 16px; line-height: 1.6;">
                "${postcardData.message}"
              </p>
              <p style="text-align: right; color: #667eea; font-weight: bold; margin-bottom: 0;">
                - ${postcardData.senderName}
              </p>
            </div>
            
            ${postcardData.frontImageData ? `
              <div style="text-align: center; margin: 20px 0;">
                <h3 style="color: #333;">📮 Prednja strana razglednice:</h3>
                <img src="${postcardData.frontImageData}" alt="Prednja strana" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              </div>
            ` : ''}
            
            ${postcardData.backImageData ? `
              <div style="text-align: center; margin: 20px 0;">
                <h3 style="color: #333;">✉️ Stražnja strana razglednice:</h3>
                <img src="${postcardData.backImageData}" alt="Stražnja strana" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #667eea; font-size: 16px; margin: 0;">
                Nadamo se da vam se sviđa ova digitalna razglednica! 💝
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
            <p style="margin: 0;"><strong>Poslano putem RetroPost</strong> - Digitalne razglednice</p>
            <p style="margin: 5px 0 0 0;"><a href="https://postretro.netlify.app" style="color: #667eea;">🌐 postretro.netlify.app</a></p>
          </div>
        </div>
      `;
      
      // STREAMLINED FormSubmit payload
      const formSubmitPayload = {
        _subject: `🌟 Nova razglednica od ${postcardData.senderName}`,
        _template: 'box',
        _captcha: 'false',
        _next: window.location.origin,
        _cc: postcardData.recipientEmail,
        _autoresponse: `Hvala što ste poslali razglednicu putem RetroPost! Vaša razglednica je dostavljena na ${postcardData.recipientEmail}.`,
        sender_name: postcardData.senderName,
        recipient_name: postcardData.recipientName,
        recipient_email: postcardData.recipientEmail,
        message: postcardData.message,
        html_content: optimizedHtmlContent
      };
      
      console.log('📧 Sending INSTANT postcard via FormSubmit...');
      
      const formSubmitResponse = await fetch('https://formsubmit.co/jimgitara@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formSubmitPayload)
      });

      console.log('📤 FormSubmit response status:', formSubmitResponse.status);
      
      if (formSubmitResponse.ok) {
        console.log('✅ FormSubmit postcard sent successfully');
        return;
      } else {
        const errorText = await formSubmitResponse.text();
        console.error('❌ FormSubmit error response:', errorText);
        throw new Error(`FormSubmit service failed: ${formSubmitResponse.status}`);
      }
    } catch (backupError) {
      console.error('❌ FormSubmit backup failed:', backupError);
      
      // FINAL EMERGENCY FALLBACK - text-only email
      try {
        console.log('📧 Emergency text-only email...');
        
        const textOnlyPayload = {
          _subject: `Razglednica od ${postcardData.senderName}`,
          _template: 'basic',
          _captcha: 'false',
          _next: window.location.origin,
          _cc: postcardData.recipientEmail,
          message: `
Pozdrav ${postcardData.recipientName}!

Dobili ste razglednicu od ${postcardData.senderName}:

"${postcardData.message}"

- ${postcardData.senderName}

---
Poslano putem RetroPost
https://postretro.netlify.app
          `
        };
        
        const emergencyResponse = await fetch('https://formsubmit.co/jimgitara@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(textOnlyPayload)
        });
        
        if (emergencyResponse.ok) {
          console.log('✅ Emergency text email sent');
          return;
        }
      } catch (emergencyError) {
        console.error('❌ Emergency email failed:', emergencyError);
      }
      
      throw new Error('Razglednica je kreirana, ali email servis trenutno nije dostupan. Molimo kontaktirajte podršku na jimgitara@gmail.com');
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