# RetroPost - Futuristic Digital Postcards

A cyberpunk-themed digital postcard application built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Cyberpunk Design**: Futuristic UI with neon colors and animations
- **Template Gallery**: Choose from various cyberpunk-themed templates
- **Custom Upload**: Upload your own photos for personalized postcards
- **Real-time Editor**: Live preview with text customization
- **Email Integration**: Dual email system (Netlify Forms + EmailJS)
- **Responsive Design**: Works perfectly on all devices
- **Performance Optimized**: Fast loading with modern web technologies

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Email**: Netlify Forms (primary), EmailJS (backup)
- **Deployment**: Netlify
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/retropost.git
cd retropost
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🔧 Configuration

### EmailJS Setup (Optional)

1. Go to [EmailJS](https://www.emailjs.com/)
2. Create an account and service
3. Create a template with these variables:
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{subject}}`
   - `{{message}}`
   - `{{to_email}}`
4. Copy `src/config/emailjs.example.js` to `src/config/emailjs.js`
5. Replace the placeholder values with your actual EmailJS credentials

### Netlify Forms

Netlify Forms work automatically when deployed to Netlify. No additional configuration needed.

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to your hosting provider

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Gallery.tsx
│   ├── Contact.tsx
│   ├── PostcardEditor.tsx
│   ├── PhotoUpload.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorBoundary.tsx
├── services/           # Service functions
│   └── emailService.ts
├── config/            # Configuration files
│   └── emailjs.example.js
├── types/             # TypeScript types
│   └── index.ts
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 🎨 Customization

### Colors

The cyberpunk color scheme is defined in `tailwind.config.js`:

- **Neon Blue**: `#00d4ff`
- **Neon Pink**: `#ff0080`
- **Neon Green**: `#00ff88`
- **Neon Purple**: `#8b5cf6`

### Fonts

- **Cyber Font**: Orbitron (headings)
- **Tech Font**: Rajdhani (body text)
- **Sans Font**: Inter (fallback)

### Animations

Custom animations include:
- `glow`: Neon glow effect
- `pulse-neon`: Cyberpunk pulsing
- `float`: Floating elements
- `cyber-grid`: Animated background grid

## 📧 Contact

For questions or support, contact: jimgitara@gmail.com

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🔮 Future Features

- [ ] User authentication
- [ ] Postcard history
- [ ] Social media sharing
- [ ] Advanced templates
- [ ] Animation effects
- [ ] Multi-language support

---

Built with ❤️ and ⚡ by the RetroPost team