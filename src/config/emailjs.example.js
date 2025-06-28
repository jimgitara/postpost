// EmailJS Configuration Example
// Copy this file to emailjs.js and replace with your actual values

export const EMAILJS_CONFIG = {
  // Get these from https://dashboard.emailjs.com/
  serviceId: 'YOUR_SERVICE_ID',        // e.g., 'service_abc123'
  templateId: 'YOUR_TEMPLATE_ID',      // e.g., 'template_xyz789'
  publicKey: 'YOUR_PUBLIC_KEY',        // e.g., 'user_def456'
};

// EmailJS Template Variables (use these in your template):
// {{from_name}} - Sender's name
// {{from_email}} - Sender's email
// {{subject}} - Email subject
// {{message}} - Message content
// {{to_email}} - Recipient email (jimgitara@gmail.com)

// Setup Instructions:
// 1. Go to https://www.emailjs.com/
// 2. Create a free account
// 3. Add an email service (Gmail, Outlook, etc.)
// 4. Create an email template with the variables above
// 5. Get your Service ID, Template ID, and Public Key
// 6. Replace the values above with your actual credentials
// 7. Rename this file to emailjs.js

// Example template content:
/*
Subject: New Contact Form Message - {{subject}}

Hello,

You have received a new message from your RetroPost contact form:

Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from RetroPost contact form.
*/