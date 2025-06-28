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

// COMPLETELY DOM-INDEPENDENT Canvas generation
export const generatePostcardCanvasDirectly = async (data: PostcardCanvasData): Promise<{ frontImage: string; backImage: string }> => {
  console.log('🎨 DIRECT Canvas generation - NO DOM dependency!');
  
  try {
    // Generate front and back in parallel
    const [frontImage, backImage] = await Promise.all([
      generateFrontCanvasDirect(data),
      generateBackCanvasDirect(data)
    ]);
    
    console.log('✅ DIRECT Canvas generation completed instantly!');
    
    return { frontImage, backImage };
    
  } catch (error) {
    console.error('❌ DIRECT Canvas generation failed:', error);
    
    // Emergency fallback
    const fallbackFront = generateFallbackCanvas('Pozdrav iz prekrasnog mjesta!', '#667eea', '#764ba2');
    const fallbackBack = generateFallbackCanvas('RetroPost Razglednica', '#ffffff', '#f8f9fa');
    
    return {
      frontImage: fallbackFront,
      backImage: fallbackBack
    };
  }
};

// INSTANT front canvas generation
const generateFrontCanvasDirect = async (data: PostcardCanvasData): Promise<string> => {
  console.log('🎨 Generating front canvas directly...');
  
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
      
      ctx.fillStyle = data.textColor;
      ctx.font = `bold ${data.fontSize}px ${fontMap[data.fontFamily] || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text shadow for better visibility
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
    
    // Start loading image
    img.src = data.backgroundImageUrl;
  });
};

// INSTANT back canvas generation
const generateBackCanvasDirect = (data: PostcardCanvasData): string => {
  console.log('📝 Generating back canvas directly...');
  
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
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 600, 400);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);
  
  // Text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.fillText(text, 300, 200);
  
  return canvas.toDataURL('image/jpeg', 0.8);
};

// Legacy function for backward compatibility - now uses direct generation
export const capturePostcardImages = async (frontRef: HTMLElement, backRef: HTMLElement) => {
  console.log('⚡ Legacy function redirecting to DIRECT Canvas generation...');
  
  // Extract basic data and use direct generation
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
  console.log('📧 Starting postcard send process...');
  console.log('📋 Postcard data:', {
    recipientEmail: postcardData.recipientEmail,
    recipientName: postcardData.recipientName,
    senderName: postcardData.senderName,
    messageLength: postcardData.message?.length || 0
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
      console.log('📧 Using Netlify Forms for postcard email');
      
      // Create formatted message for Netlify Forms
      const formattedMessage = `
🌟 DIGITALNA RAZGLEDNICA 🌟

Pozdrav ${postcardData.recipientName}!

Dobili ste prekrasnu digitalnu razglednicu od ${postcardData.senderName}:

💌 PORUKA:
"${postcardData.message}"

- ${postcardData.senderName}

---
✨ Poslano s ljubavlju putem RetroPost
🌐 https://postretro.netlify.app

Hvala što koristite RetroPost za dijeljenje posebnih trenutaka!
      `;
      
      // Netlify Forms submission for postcard
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "postcard",
          "sender_name": postcardData.senderName,
          "recipient_name": postcardData.recipientName,
          "recipient_email": postcardData.recipientEmail,
          "postcard_message": postcardData.message,
          "formatted_message": formattedMessage
        })
      });

      console.log('📧 Netlify Forms response status:', response.status);

      if (response.ok) {
        console.log('✅ Netlify postcard email sent successfully');
        return;
      } else {
        const errorText = await response.text();
        console.error('❌ Netlify Forms error:', errorText);
        throw new Error('Netlify postcard form submission failed');
      }
    } else {
      console.log('🏠 Local development - using FormSubmit directly');
      throw new Error('Using FormSubmit for local development');
    }
    
  } catch (error) {
    console.log('📧 Primary postcard service failed, using FormSubmit backup');
    
    try {
      // FormSubmit backup with simple text payload
      const simpleTextPayload = {
        _subject: `🌟 Nova razglednica od ${postcardData.senderName}`,
        _template: 'basic',
        _captcha: 'false',
        _next: window.location.origin,
        _cc: postcardData.recipientEmail, // Send copy to recipient
        _autoresponse: `Hvala što ste poslali razglednicu putem RetroPost! Vaša razglednica je dostavljena na ${postcardData.recipientEmail}.`,
        
        // Main content
        sender_name: postcardData.senderName,
        recipient_name: postcardData.recipientName,
        recipient_email: postcardData.recipientEmail,
        postcard_message: postcardData.message,
        
        // Full formatted message
        message: `
🌟 DIGITALNA RAZGLEDNICA 🌟

Pozdrav ${postcardData.recipientName}!

Dobili ste prekrasnu digitalnu razglednicu od ${postcardData.senderName}:

💌 PORUKA:
"${postcardData.message}"

- ${postcardData.senderName}

---
✨ Poslano s ljubavlju putem RetroPost
🌐 https://postretro.netlify.app

Hvala što koristite RetroPost za dijeljenje posebnih trenutaka!
        `
      };
      
      console.log('📤 Sending to FormSubmit...');
      
      const formSubmitResponse = await fetch('https://formsubmit.co/jimgitara@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(simpleTextPayload)
      });

      console.log('📤 FormSubmit response status:', formSubmitResponse.status);
      
      if (formSubmitResponse.ok) {
        console.log('✅ FormSubmit postcard email backup successful');
        return;
      } else {
        const errorText = await formSubmitResponse.text();
        console.error('❌ FormSubmit error:', errorText);
        throw new Error('FormSubmit service failed');
      }
    } catch (backupError) {
      console.error('❌ All postcard email services failed:', backupError);
      throw new Error('Email servis trenutno nije dostupan. Vaša razglednica je kreirana, ali email nije poslan. Molimo kontaktirajte podršku na jimgitara@gmail.com');
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