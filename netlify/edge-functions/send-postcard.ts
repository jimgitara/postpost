import { Context } from "https://edge.netlify.com/";

interface PostcardRequest {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  message: string;
  frontImageData: string; // base64 string
  backImageData: string;  // base64 string
}

export default async (request: Request, context: Context) => {
  // Handle CORS
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

    // Validate required fields
    if (!recipientEmail || !senderName || !frontImageData || !backImageData) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create HTML email with embedded images
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🌟 Digitalna Razglednica od ${senderName}</title>
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
              Pozdrav <strong>${recipientName}</strong>! 👋
            </div>
            
            <p>Dobili ste prekrasnu digitalnu razglednicu od <strong>${senderName}</strong>:</p>
            
            <div class="postcard-container">
              <div class="postcard-title">🖼️ Prednja strana razglednice:</div>
              <img src="${frontImageData}" alt="Prednja strana razglednice" class="postcard-image">
              
              <div class="postcard-title">📝 Stražnja strana razglednice:</div>
              <img src="${backImageData}" alt="Stražnja strana razglednice" class="postcard-image">
            </div>
            
            <div class="message-box">
              <h3>💌 Osobna poruka:</h3>
              <div class="message-text">"${message}"</div>
              <div class="signature">- ${senderName}</div>
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

    // Send email using FormSubmit with proper HTML content
    const emailPayload = {
      _subject: `🌟 Nova razglednica od ${senderName}`,
      _template: 'box',
      _captcha: 'false',
      _cc: recipientEmail,
      _html: htmlContent,
      sender_name: senderName,
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      message: message,
      postcard_type: 'Digital Postcard with Images'
    };

    const emailResponse = await fetch('https://formsubmit.co/jimgitara@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    if (!emailResponse.ok) {
      throw new Error(`Email service failed: ${emailResponse.status}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Postcard sent successfully with images!' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error sending postcard:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send postcard', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

export const config = {
  path: "/.netlify/functions/send-postcard"
};