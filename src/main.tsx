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

// Initialize theme on app start
const savedTheme = localStorage.getItem('retropost_theme') || 'dark';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
} else {
  document.documentElement.classList.add('light');
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);