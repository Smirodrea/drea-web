import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter } from 'rxjs';
import { environment } from 'src/environments/environment';

declare let gtag: Function;
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Service for integrating Google Analytics into Angular applications.
 * Handles conditional loading based on user consent and efficient tracking of page navigations.
 *
 * Usage Guide:
 * 1. Ensure Google Analytics tracking ID is set in the environment configuration:
 *    - Add `googleAnalyticsTrackingId: 'UA-XXXXX-Y'` to your `environment.ts` and `environment.prod.ts`.
 *    - Optionally, add `requireConsent: true` in environments where user consent is required before tracking.
 *
 * 2. Inject this service in the root component (AppComponent) of your Angular application:
 *    - The service initialization is automatically handled through its constructor.
 *
 * 3. For applications requiring user consent (e.g., to comply with GDPR):
 *    - Ensure `requireConsent` is set to `true` in the respective environment file.
 *    - *********Call `consentGiven()` method from the component handling consent acceptance (e.g., a cookie consent banner):
 *      constructor(private gaService: GoogleAnalyticsService) {}
 *
 *      acceptConsent() {
 *        this.gaService.consentGiven();
 *      }
 *      ********* - The consent status is stored in `localStorage` under the key `cookiesConsent`. This key is used to check if consent has been given in previous sessions.
 *
 * 4. The service automatically listens to router events and tracks page navigations once injected/initialized.
 *    - No further action is required for page view tracking.
 *
 * 5. Ensure appropriate measures are in place for managing and storing user consent.
 *
 * Notes:
 * - The service checks for previous consent stored in `localStorage`. If consent is already given,
 *   or if the application does not require consent (`requireConsent: false`), Google Analytics is initialized automatically.
 * - Use the `consentGiven()` method to manually initialize tracking after receiving user consent in consent-required applications.
 */
@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  private initialized = false;
  private requireConsent = environment.requireConsent;

  constructor(private router: Router) {
    // irrelevant for our actual one page app...
    // this.handlePageViews();
    // Check consent and initialize analytics accordingly
    this.initializeBasedOnConsent();
  }

  /**
   * Handles automatic page view tracking for single page applications.
   */
  private handlePageViews(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        debounceTime(1000)
      )
      .subscribe((event: NavigationEnd) => {
        if (this.initialized) {
          this.trackPage(event.urlAfterRedirects);
        }
      });
  }

  /**
   * Initializes Google Analytics based on user consent and the environment setting.
   * This method checks if consent is required and whether it has been given before initializing analytics.
   */
  private initializeBasedOnConsent(): void {
    try {
      if (this.requireConsent) {
        const consentGiven = localStorage.getItem('cookiesConsent') === 'true';
        if (consentGiven) {
          this.initAnalytics();
        }
      } else {
        this.initAnalytics();
      }
    } catch (error) {
      console.error('Error accessing localStorage', error);
    }
  }

  /**
   * Initializes Google Analytics with the provided tracking ID from environment.
   * Call this method directly only if your site does not require user consent for analytics.
   */
  initAnalytics(): void {
    if (
      !environment.production ||
      this.initialized ||
      !environment.googleAnalyticsTrackingId
    )
      return;

    this.loadGA(environment.googleAnalyticsTrackingId);
    this.initialized = true;
  }

  /**
   * Should be called when the user gives consent for analytics tracking.
   * This can be tied to a consent banner's accept action.
   * It also ensures analytics are initialized if not already done.
   */
  consentGiven(): void {
    try {
      localStorage.setItem('cookiesConsent', 'true');
      if (!this.initialized) {
        this.initAnalytics();
      }
    } catch (error) {
      console.error('Error setting item in localStorage', error);
    }
  }

  /**
   * Loads the Google Analytics script into the document head.
   * @param {string} trackingId - The Google Analytics tracking ID.
   */
  private loadGA(trackingId: string): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    script.onerror = () =>
      console.error('Failed to load Google Analytics script.');
    document.head.appendChild(script);

    window['dataLayer'] = window['dataLayer'] || [];
    window['gtag'] = function () {
      window.dataLayer.push(arguments);
    };
    gtag('js', new Date());
    gtag('config', trackingId, { anonymize_ip: true });
  }

  /**
   * Tracks page navigations after the GA script has been initialized.
   * @param {string} path - The path of the navigated page.
   */
  private trackPage(path: string): void {
    if (!this.initialized) return;
    gtag('config', environment.googleAnalyticsTrackingId, { page_path: path });
  }

  // Method to track custom events
  trackEvent(eventName: string, params: any = {}): void {
    if (!this.initialized) return;
    gtag('event', eventName, params);
  }

  // Method to track virtual page views
  trackVirtualPageView(pageUrl: string): void {
    if (!this.initialized) return;
    gtag('config', environment.googleAnalyticsTrackingId, {
      page_path: pageUrl,
    });
  }
}
