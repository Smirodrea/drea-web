import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CookieService } from 'src/app/services/cookie.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-cookie-notice',
  templateUrl: './cookie-notice.component.html',
  styleUrls: ['./cookie-notice.component.scss'],
})
export class CookieNoticeComponent {
  showCookieBanner = false;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private googleAnalytics: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.checkForGPC();
    const consent = this.cookieService.getConsent();
    if (!consent) {
      this.showCookieBanner = true;
    }
  }

  checkForGPC() {
    const gpc = (navigator as any).globalPrivacyControl;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects === '/cookie-policy') {
          this.showCookieBanner = false;
        } else {
          const consent = localStorage.getItem('cookiesConsent');
          if (!consent) {
            this.showCookieBanner = true;
          }
        }
      });
  }
  declineCookies() {
    this.showCookieBanner = false;
    this.cookieService.setConsent('false');
    this.cookieService.deleteAllCookies();
  }

  acceptCookies() {
    this.cookieService.setConsent('true');
    this.showCookieBanner = false;
    this.googleAnalytics.consentGiven();
  }
}
