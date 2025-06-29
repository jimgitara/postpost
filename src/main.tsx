import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { initEmailJS } from './services/emailService.ts';
import { analyticsService } from './services/analyticsService.ts';
import './index.css';

// Initialize EmailJS
initEmailJS();

// Initialize Google Analytics with your actual Measurement ID
analyticsService.init('G-7JG4GB7BCX');

// Initialize theme on app start - CRITICAL FIX
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('retropost_theme') || 'dark';
  console.log('🌙 Initializing theme:', savedTheme);
  
  // Clear all theme classes first
  document.documentElement.classList.remove('dark', 'light');
  
  // Add the saved theme class
  document.documentElement.classList.add(savedTheme);
  
  console.log('🌙 Initial document classes:', document.documentElement.className);
};

// Initialize theme immediately
initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);