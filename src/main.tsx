import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { initEmailJS } from './services/emailService.ts';
import './index.css';

// Initialize EmailJS
initEmailJS();

// CRITICAL: Initialize theme IMMEDIATELY before React renders
const initializeTheme = () => {
  console.log('🌙 MAIN: Initializing theme...');
  
  const savedTheme = localStorage.getItem('retropost_theme') || 'dark';
  console.log('🌙 MAIN: Saved theme:', savedTheme);
  
  // Clear all theme classes first
  document.documentElement.classList.remove('dark', 'light');
  
  // Add the saved theme class
  document.documentElement.classList.add(savedTheme);
  
  console.log('🌙 MAIN: Applied classes:', document.documentElement.className);
};

// Initialize theme BEFORE React renders
initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);