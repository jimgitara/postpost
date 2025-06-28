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

// AGGRESSIVE timeout wrapper - max 3 seconds!
const captureWithTimeout = async (element: HTMLElement, options: any, timeoutMs = 3000) => {
  console.log(`⏱️ Starting capture with ${timeoutMs}ms timeout...`);
  
  return Promise.race([
    import('html2canvas').then(async (module) => {
      const html2canvas = module.default;
      return html2canvas(element, options);
    }),
    new Promise((_, reject) => 
      setTimeout(() => {
        console.log('⏰ Capture timeout reached!');
        reject(new Error('Capture timeout'));
      }, timeoutMs)
    )
  ]) as Promise<HTMLCanvasElement>;
};

// Create fallback image immediately
const createFallbackImage = (text: string, isBack = false) => {
  console.log('🎨 Creating fallback image:', text);
  
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;
  
  if (isBack) {
    // Back side - white background with text
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 600, 400);
    
    // Border
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 580, 380);
    
    // Text
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('RetroPost Razglednica', 300, 60);
    
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Poruka:', 40, 120);
    
    // Message text (wrap it)
    const words = text.split(' ');
    let line = '';
    let y = 150;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > 520 && n > 0) {
        ctx.fillText(line, 40, y);
        line = words[n] + ' ';
        y += 25;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 40, y);
    
    // Footer
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666';
    ctx.fillText('RetroPost.com - Digitalne razglednice', 300, 370);
    
  } else {
    // Front side - gradient background
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Split text into lines
    const words = text.split(' ');
    let line = '';
    let y = 180;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > 500 && n > 0) {
        ctx.fillText(line, 300, y);
        line = words[n] + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 300, y);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Subtitle
    ctx.font = '16px Arial';
    ctx.fillText('RetroPost Razglednica', 300, 350);
  }
  
  return canvas.toDataURL('image/jpeg', 0.8);
};

// SUPER FAST image capture with immediate fallback
export const capturePostcardImages = async (frontRef: HTMLElement, backRef: HTMLElement) => {
  console.log('🚀 FAST capture starting...');
  
  // Get text content immediately for fallbacks
  const frontText = frontRef.querySelector('div[style*="color"]')?.textContent || 'Pozdrav iz prekrasnog mjesta!';
  const backText = backRef.querySelector('div')?.textContent || 'Vaša poruka ovdje...';
  
  try {
    // Try VERY fast capture - only 2 seconds!
    console.log('⚡ Attempting ultra-fast capture...');
    
    const captureOptions = {
      scale: 0.8, // Even smaller scale
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 1000, // 1 second only!
      removeContainer: true,
      foreignObjectRendering: false,
      width: Math.min(frontRef.offsetWidth, 600),
      height: Math.min(frontRef.offsetHeight, 400)
    };
    
    // Race condition - whoever finishes first wins!
    const capturePromise = Promise.all([
      captureWithTimeout(frontRef, captureOptions, 2000), // 2 sec max
      captureWithTimeout(backRef, captureOptions, 2000)   // 2 sec max
    ]);
    
    // Also prepare fallbacks immediately
    const fallbackPromise = new Promise(resolve => {
      setTimeout(() => {
        console.log('🎨 Using fallback images');
        resolve([
          createFallbackImage(frontText, false),
          createFallbackImage(backText, true)
        ]);
      }, 1500); // Fallback after 1.5 seconds
    });
    
    // Race between capture and fallback
    const result = await Promise.race([
      capturePromise.then(([frontCanvas, backCanvas]) => {
        console.log('✅ Real capture succeeded!');
        return {
          frontImage: frontCanvas.toDataURL('image/jpeg', 0.7),
          backImage: backCanvas.toDataURL('image/jpeg', 0.7)
        };
      }),
      fallbackPromise.then(([frontImage, backImage]) => {
        console.log('🎨 Using fallback images');
        return { frontImage, backImage };
      })
    ]);
    
    return result as { frontImage: string; backImage: string };
    
  } catch (error) {
    console.log('❌ All capture methods failed, using emergency fallback');
    
    // Emergency fallback - always works
    return {
      frontImage: createFallbackImage(frontText, false),
      backImage: createFallbackImage(backText, true)
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
  console.log('🚀 FAST postcard send starting...');
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
      // Create SIMPLE HTML email - no complex styling
      const simpleHtmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
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
      
      // SIMPLIFIED FormSubmit payload
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
        html_content: simpleHtmlContent
      };
      
      console.log('📧 Sending FAST postcard via FormSubmit...');
      
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