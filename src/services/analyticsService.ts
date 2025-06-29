// Google Analytics 4 Integration Service
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface PostcardAnalytics {
  template_id: string;
  template_name: string;
  category: string;
  price: number;
  language: string;
  theme: string;
}

interface UserAnalytics {
  language: string;
  theme: string;
  device_type: string;
  user_agent: string;
}

class AnalyticsService {
  private isInitialized = false;
  private measurementId = 'G-XXXXXXXXXX'; // Replace with your actual GA4 Measurement ID
  private debugMode = process.env.NODE_ENV === 'development';

  // Initialize Google Analytics
  init(measurementId?: string) {
    if (this.isInitialized) return;

    if (measurementId) {
      this.measurementId = measurementId;
    }

    // Skip in development unless explicitly enabled
    if (this.debugMode && !localStorage.getItem('enable_analytics_debug')) {
      console.log('📊 Analytics disabled in development mode');
      return;
    }

    try {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      // Configure GA4
      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        // Enhanced measurement
        enhanced_measurements: true,
        // Page view tracking
        send_page_view: true,
        // Custom parameters
        custom_map: {
          'custom_language': 'language',
          'custom_theme': 'theme',
          'custom_device': 'device_type'
        },
        // Privacy settings
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });

      this.isInitialized = true;
      console.log('📊 Google Analytics initialized successfully');

      // Track initial page load
      this.trackPageView();
      this.trackUserProperties();

    } catch (error) {
      console.error('❌ Failed to initialize Google Analytics:', error);
    }
  }

  // Track page views
  trackPageView(page_title?: string, page_location?: string) {
    if (!this.isInitialized) return;

    try {
      window.gtag('event', 'page_view', {
        page_title: page_title || document.title,
        page_location: page_location || window.location.href,
        language: localStorage.getItem('retropost_language') || 'hr',
        theme: localStorage.getItem('retropost_theme') || 'dark'
      });

      if (this.debugMode) {
        console.log('📊 Page view tracked:', { page_title, page_location });
      }
    } catch (error) {
      console.error('❌ Failed to track page view:', error);
    }
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.isInitialized) return;

    try {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        language: localStorage.getItem('retropost_language') || 'hr',
        theme: localStorage.getItem('retropost_theme') || 'dark',
        ...event.custom_parameters
      });

      if (this.debugMode) {
        console.log('📊 Event tracked:', event);
      }
    } catch (error) {
      console.error('❌ Failed to track event:', error);
    }
  }

  // Track user properties
  trackUserProperties() {
    if (!this.isInitialized) return;

    try {
      const userAgent = navigator.userAgent;
      const deviceType = this.getDeviceType();
      const language = localStorage.getItem('retropost_language') || 'hr';
      const theme = localStorage.getItem('retropost_theme') || 'dark';

      window.gtag('set', 'user_properties', {
        language: language,
        theme: theme,
        device_type: deviceType,
        user_agent: userAgent
      });

      if (this.debugMode) {
        console.log('📊 User properties set:', { language, theme, deviceType });
      }
    } catch (error) {
      console.error('❌ Failed to set user properties:', error);
    }
  }

  // Postcard specific tracking
  trackPostcardCreated(data: PostcardAnalytics) {
    this.trackEvent({
      action: 'postcard_created',
      category: 'postcard',
      label: data.template_name,
      value: data.price,
      custom_parameters: {
        template_id: data.template_id,
        template_category: data.category,
        price: data.price,
        creation_language: data.language,
        creation_theme: data.theme
      }
    });
  }

  trackPostcardSent(data: PostcardAnalytics & { recipient_domain?: string }) {
    this.trackEvent({
      action: 'postcard_sent',
      category: 'postcard',
      label: data.template_name,
      value: data.price,
      custom_parameters: {
        template_id: data.template_id,
        template_category: data.category,
        price: data.price,
        recipient_domain: data.recipient_domain,
        send_language: data.language,
        send_theme: data.theme
      }
    });
  }

  trackTemplateViewed(templateId: string, templateName: string, category: string) {
    this.trackEvent({
      action: 'template_viewed',
      category: 'gallery',
      label: templateName,
      custom_parameters: {
        template_id: templateId,
        template_category: category
      }
    });
  }

  trackTemplateSelected(templateId: string, templateName: string, category: string, price: number) {
    this.trackEvent({
      action: 'template_selected',
      category: 'gallery',
      label: templateName,
      value: price,
      custom_parameters: {
        template_id: templateId,
        template_category: category,
        price: price
      }
    });
  }

  // E-commerce tracking
  trackAddToCart(templateId: string, templateName: string, price: number, quantity: number = 1) {
    this.trackEvent({
      action: 'add_to_cart',
      category: 'ecommerce',
      label: templateName,
      value: price * quantity,
      custom_parameters: {
        currency: 'HRK',
        items: [{
          item_id: templateId,
          item_name: templateName,
          category: 'digital_postcard',
          quantity: quantity,
          price: price
        }]
      }
    });
  }

  trackPurchase(orderId: string, items: any[], total: number) {
    this.trackEvent({
      action: 'purchase',
      category: 'ecommerce',
      value: total,
      custom_parameters: {
        transaction_id: orderId,
        currency: 'HRK',
        items: items.map(item => ({
          item_id: item.template.id,
          item_name: item.template.name,
          category: 'digital_postcard',
          quantity: item.quantity,
          price: item.price
        }))
      }
    });
  }

  // User interaction tracking
  trackLanguageChange(from: string, to: string) {
    this.trackEvent({
      action: 'language_changed',
      category: 'user_preference',
      label: `${from}_to_${to}`,
      custom_parameters: {
        previous_language: from,
        new_language: to
      }
    });
  }

  trackThemeChange(from: string, to: string) {
    this.trackEvent({
      action: 'theme_changed',
      category: 'user_preference',
      label: `${from}_to_${to}`,
      custom_parameters: {
        previous_theme: from,
        new_theme: to
      }
    });
  }

  trackContactFormSubmit(subject: string) {
    this.trackEvent({
      action: 'contact_form_submit',
      category: 'engagement',
      label: subject,
      custom_parameters: {
        form_type: 'contact',
        subject_category: subject
      }
    });
  }

  trackError(errorType: string, errorMessage: string, location?: string) {
    this.trackEvent({
      action: 'error_occurred',
      category: 'error',
      label: errorType,
      custom_parameters: {
        error_message: errorMessage,
        error_location: location || window.location.pathname,
        user_agent: navigator.userAgent
      }
    });
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.trackEvent({
      action: 'performance_metric',
      category: 'performance',
      label: metric,
      value: Math.round(value),
      custom_parameters: {
        metric_name: metric,
        metric_value: value,
        metric_unit: unit
      }
    });
  }

  // Utility methods
  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  // Get analytics data for debugging
  getAnalyticsInfo() {
    return {
      isInitialized: this.isInitialized,
      measurementId: this.measurementId,
      debugMode: this.debugMode,
      language: localStorage.getItem('retropost_language'),
      theme: localStorage.getItem('retropost_theme'),
      deviceType: this.getDeviceType()
    };
  }

  // Enable debug mode
  enableDebugMode() {
    localStorage.setItem('enable_analytics_debug', 'true');
    console.log('📊 Analytics debug mode enabled');
  }

  // Disable debug mode
  disableDebugMode() {
    localStorage.removeItem('enable_analytics_debug');
    console.log('📊 Analytics debug mode disabled');
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// Export types for use in components
export type { AnalyticsEvent, PostcardAnalytics, UserAnalytics };