import { Context } from "https://edge.netlify.com/";

interface PostcardRequest {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  message: string;
  frontImageData: string;
  backImageData: string;
}

export default async (request: Request, context: Context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientName, senderName, message, frontImageData, backImageData }: PostcardRequest = await request.json();

    console.log('📧 Edge Function: Processing postcard request');

    // Validate required fields
    if (!recipientEmail || !senderName || !frontImageData || !backImageData) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create beautiful HTML email with embedded base64 images
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="hr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🌟 Digitalna Razglednica od ${senderName}</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            line-height: 1.6;
          }
          .container { 
            max-width: 700px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
          }
          .content { 
            padding: 40px; 
          }
          .greeting {
            font-size: 22px;
            color: #333;
            margin-bottom: 25px;
            text-align: center;
          }
          .intro {
            font-size: 18px;
            color: #555;
            text-align: center;
            margin-bottom: 30px;
          }
          .postcard-container { 
            margin: 40px 0; 
            text-align: center; 
          }
          .postcard-image { 
            max-width: 100%; 
            width: 500px;
            height: auto; 
            border-radius: 15px; 
            box-shadow: 0 15px 35px rgba(0,0,0,0.2); 
            margin: 20px auto; 
            border: 4px solid #f8f9fa;
            display: block;
            transition: transform 0.3s ease;
          }
          .postcard-title {
            font-size: 20px;
            font-weight: bold;
            color: #667eea;
            margin: 30px 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .message-box { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
            padding: 30px; 
            border-radius: 20px; 
            margin: 30px 0; 
            border-left: 6px solid #667eea; 
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          .message-box h3 {
            color: #667eea;
            margin-top: 0;
            font-size: 20px;
            margin-bottom: 15px;
          }
          .message-text {
            font-size: 18px;
            line-height: 1.7;
            color: #333;
            font-style: italic;
            background: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #e9ecef;
          }
          .signature { 
            text-align: right; 
            font-weight: bold; 
            margin-top: 20px; 
            color: #667eea; 
            font-size: 18px;
            font-style: normal;
          }
          .closing {
            text-align: center;
            font-size: 20px;
            color: #667eea;
            margin: 40px 0;
            font-weight: 500;
          }
          .footer { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
            padding: 30px; 
            text-align: center; 
            color: #666; 
            font-size: 14px; 
          }
          .footer a {
            color: #667eea;
            text-decoration: none;
            font-weight: bold;
          }
          .footer a:hover {
            text-decoration: underline;
          }
          .emoji {
            font-size: 28px;
            margin-bottom: 10px;
            display: block;
          }
          .divider {
            height: 3px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 30px 0;
            border-radius: 2px;
          }
          @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 15px; }
            .content { padding: 25px; }
            .header { padding: 30px 20px; }
            .postcard-image { width: 100%; max-width: 400px; }
            .header h1 { font-size: 26px; }
            .greeting { font-size: 20px; }
            .intro { font-size: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="emoji">🌟</span>
            <h1>Digitalna Razglednica</h1>
            <p>Poslano s ljubavlju putem RetroPost</p>
          </div>
          
          <div class="content">
            <div class="greeting">
              Pozdrav <strong>${recipientName || 'dragi prijatelj'}</strong>! 👋
            </div>
            
            <div class="intro">
              Dobili ste prekrasnu digitalnu razglednicu od <strong>${senderName}</strong>
            </div>
            
            <div class="divider"></div>
            
            <div class="postcard-container">
              <div class="postcard-title">🖼️ Prednja strana razglednice</div>
              <img src="${frontImageData}" alt="Prednja strana razglednice" class="postcard-image">
              
              <div class="postcard-title">📝 Stražnja strana razglednice</div>
              <img src="${backImageData}" alt="Stražnja strana razglednice" class="postcard-image">
            </div>
            
            <div class="divider"></div>
            
            <div class="message-box">
              <h3>💌 Osobna poruka</h3>
              <div class="message-text">"${message || 'Pozdrav iz prekrasnog mjesta!'}"</div>
              <div class="signature">— ${senderName}</div>
            </div>
            
            <div class="closing">
              Nadamo se da vam se sviđa ova digitalna razglednica! 💌✨
            </div>
          </div>
          
          <div class="footer">
            <p><strong>🚀 Poslano putem RetroPost - Digitalne razglednice</strong></p>
            <p><a href="https://postretro.netlify.app">🌐 Posjetite RetroPost</a></p>
            <p style="margin-top: 15px; font-size: 12px; color: #999;">
              Ova razglednica je kreirana pomoću napredne Canvas tehnologije za instant generiranje slika.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('📧 Sending email with FormSubmit...');

    // Use FormSubmit with enhanced payload
    const emailPayload = {
      _subject: `🌟 Nova razglednica od ${senderName} za ${recipientName || 'vas'}`,
      _template: 'box',
      _captcha: 'false',
      _next: 'https://postretro.netlify.app/success',
      _cc: recipientEmail, // Send copy to recipient
      _html: htmlContent, // Rich HTML content with embedded images
      
      // Form fields for backup/logging
      sender_name: senderName,
      recipient_name: recipientName || 'Dragi prijatelj',
      recipient_email: recipientEmail,
      message: message || 'Pozdrav iz prekrasnog mjesta!',
      postcard_type: 'Digital Postcard with Embedded Images',
      sent_via: 'Netlify Edge Function + FormSubmit',
      timestamp: new Date().toISOString(),
      
      // Additional metadata
      _format: 'html',
      _autoresponse: `Hvala vam što ste koristili RetroPost! Vaša razglednica je uspješno poslana na ${recipientEmail}.`
    };

    const emailResponse = await fetch('https://formsubmit.co/jimgitara@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'RetroPost/1.0 (Netlify Edge Function)'
      },
      body: JSON.stringify(emailPayload)
    });

    console.log('📧 FormSubmit response status:', emailResponse.status);

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('📧 FormSubmit error:', errorText);
      throw new Error(`Email service failed: ${emailResponse.status} - ${errorText}`);
    }

    const responseData = await emailResponse.json();
    console.log('📧 FormSubmit success:', responseData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Razglednica je uspješno poslana s ugrađenim slikama!',
        recipient: recipientEmail,
        sender: senderName
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Edge Function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Greška pri slanju razglednice', 
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

export const config = {
  path: "/send-postcard"
};