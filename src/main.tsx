import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { initEmailJS } from './services/emailService.ts';
import './index.css';

// CRITICAL: Initialize theme IMMEDIATELY before React renders
const initializeTheme = () => {
  console.log('🌙 MAIN: Initializing theme system...');
  
  try {
    // Get saved theme or detect system preference
    let savedTheme = localStorage.getItem('retropost_theme');
    
    if (!savedTheme) {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      savedTheme = prefersDark ? 'dark' : 'light';
      localStorage.setItem('retropost_theme', savedTheme);
      console.log('🌙 MAIN: No saved theme, detected system preference:', savedTheme);
    } else {
      console.log('🌙 MAIN: Found saved theme:', savedTheme);
    }
    
    // Clear all theme classes first
    document.documentElement.classList.remove('dark', 'light');
    
    // Add the theme class to html element
    document.documentElement.classList.add(savedTheme);
    
    // Set data attribute for additional styling
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    console.log('🌙 MAIN: Theme applied successfully');
    console.log('🌙 MAIN: HTML classes:', document.documentElement.className);
    console.log('🌙 MAIN: Data theme:', document.documentElement.getAttribute('data-theme'));
    
  } catch (error) {
    console.error('❌ MAIN: Theme initialization failed:', error);
    // Fallback to dark theme
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }
};

// Initialize theme BEFORE React renders
initializeTheme();

// Initialize EmailJS
initEmailJS();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);