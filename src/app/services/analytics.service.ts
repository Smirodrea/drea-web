import { Injectable } from '@angular/core';

interface Navigator {
  globalPrivacyControl?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  showCookieBanner = false;
  ngOnInit(): void {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      this.showCookieBanner = true;
    }
  }
  constructor() {}

  loadScript() {
    // const gpc = (navigator as any).globalPrivacyControl;
    // const consent = localStorage.getItem('cookieConsent');

    // if ((gpc && gpc === true) || consent === 'false') {
    //   return; // Don't load scripts
    // }

    // if (consent === 'true') {
    //   const script1 = document.createElement('script');
    //   script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-DVGVD7TCL2';
    //   script1.async = true;
    //   document.head.appendChild(script1);

    //   const script2 = document.createElement('script');
    //   script2.innerHTML = `
    //     window.dataLayer = window.dataLayer || [];
    //     function gtag() {
    //       dataLayer.push(arguments);
    //     }
    //     gtag("js", new Date());
    //     gtag("config", "G-DVGVD7TCL2");
    //   `;
    //   document.head.appendChild(script2);
    // }
    // Remove existing scripts
    const existingScript1 = document.querySelector(
      'script[src="https://www.googletagmanager.com/gtag/js?id=G-DVGVD7TCL2"]'
    );
    if (existingScript1) existingScript1.remove();

    const existingScript2 = document.querySelector(
      'script[data-script="google-analytics"]'
    );
    if (existingScript2) existingScript2.remove();

    const gpc = (navigator as any).globalPrivacyControl;
    const consent = localStorage.getItem('cookieConsent');

    if ((gpc && gpc === true) || consent === 'false') {
      return;
    }

    if (consent === 'true') {
      const script1 = document.createElement('script');
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-DVGVD7TCL2';
      script1.async = true;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-DVGVD7TCL2");
    `;
      script2.setAttribute('data-script', 'google-analytics');
      document.head.appendChild(script2);
    }
  }
}
