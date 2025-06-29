import { useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { useApp } from '../contexts/AppContext';

// Custom hook for analytics integration
export const useAnalytics = () => {
  const { language, theme } = useApp();

  useEffect(() => {
    // Track user property changes
    analyticsService.trackUserProperties();
  }, [language, theme]);

  // Track page views
  const trackPageView = (title?: string, location?: string) => {
    analyticsService.trackPageView(title, location);
  };

  // Track custom events
  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    analyticsService.trackEvent({ action, category, label, value });
  };

  // Track postcard interactions
  const trackPostcardCreated = (templateId: string, templateName: string, category: string, price: number) => {
    analyticsService.trackPostcardCreated({
      template_id: templateId,
      template_name: templateName,
      category,
      price,
      language,
      theme
    });
  };

  const trackPostcardSent = (templateId: string, templateName: string, category: string, price: number, recipientEmail?: string) => {
    const recipientDomain = recipientEmail ? recipientEmail.split('@')[1] : undefined;
    analyticsService.trackPostcardSent({
      template_id: templateId,
      template_name: templateName,
      category,
      price,
      language,
      theme,
      recipient_domain: recipientDomain
    });
  };

  // Track template interactions
  const trackTemplateViewed = (templateId: string, templateName: string, category: string) => {
    analyticsService.trackTemplateViewed(templateId, templateName, category);
  };

  const trackTemplateSelected = (templateId: string, templateName: string, category: string, price: number) => {
    analyticsService.trackTemplateSelected(templateId, templateName, category, price);
  };

  // Track e-commerce events
  const trackAddToCart = (templateId: string, templateName: string, price: number, quantity?: number) => {
    analyticsService.trackAddToCart(templateId, templateName, price, quantity);
  };

  const trackPurchase = (orderId: string, items: any[], total: number) => {
    analyticsService.trackPurchase(orderId, items, total);
  };

  // Track user preferences
  const trackLanguageChange = (from: string, to: string) => {
    analyticsService.trackLanguageChange(from, to);
  };

  const trackThemeChange = (from: string, to: string) => {
    analyticsService.trackThemeChange(from, to);
  };

  // Track form submissions
  const trackContactForm = (subject: string) => {
    analyticsService.trackContactFormSubmit(subject);
  };

  // Track errors
  const trackError = (errorType: string, errorMessage: string, location?: string) => {
    analyticsService.trackError(errorType, errorMessage, location);
  };

  // Track performance
  const trackPerformance = (metric: string, value: number, unit?: string) => {
    analyticsService.trackPerformance(metric, value, unit);
  };

  return {
    trackPageView,
    trackEvent,
    trackPostcardCreated,
    trackPostcardSent,
    trackTemplateViewed,
    trackTemplateSelected,
    trackAddToCart,
    trackPurchase,
    trackLanguageChange,
    trackThemeChange,
    trackContactForm,
    trackError,
    trackPerformance
  };
};

// Performance tracking hook
export const usePerformanceTracking = () => {
  useEffect(() => {
    // Track page load performance
    const trackPageLoadPerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          // Track various performance metrics
          analyticsService.trackPerformance('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
          analyticsService.trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
          analyticsService.trackPerformance('first_paint', navigation.responseEnd - navigation.fetchStart);
          
          // Track resource loading
          const resources = performance.getEntriesByType('resource');
          const totalResourceTime = resources.reduce((total, resource) => total + resource.duration, 0);
          analyticsService.trackPerformance('total_resource_load_time', totalResourceTime);
        }
      }
    };

    // Track Core Web Vitals
    const trackCoreWebVitals = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            analyticsService.trackPerformance('largest_contentful_paint', lastEntry.startTime);
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              analyticsService.trackPerformance('first_input_delay', entry.processingStart - entry.startTime);
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift (CLS)
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            analyticsService.trackPerformance('cumulative_layout_shift', clsValue * 1000); // Convert to ms equivalent
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Performance Observer not fully supported:', error);
        }
      }
    };

    // Run performance tracking after page load
    if (document.readyState === 'complete') {
      trackPageLoadPerformance();
      trackCoreWebVitals();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          trackPageLoadPerformance();
          trackCoreWebVitals();
        }, 1000);
      });
    }
  }, []);
};