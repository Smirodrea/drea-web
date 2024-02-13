import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { CookieService } from 'src/app/services/cookie.service';

@Component({
  selector: 'app-cookie-notice',
  templateUrl: './cookie-notice.component.html',
  styleUrls: ['./cookie-notice.component.scss'],
})
export class CookieNoticeComponent {
  showCookieBanner = false;

  constructor(
    private analyticsService: AnalyticsService,
    private router: Router,
    private cookieService: CookieService // inject the new service
  ) {}

  ngOnInit(): void {
    this.checkForGPC();
    const consent = this.cookieService.getConsent(); // use the new service method
    if (!consent) {
      this.showCookieBanner = true;
    }
  }

  checkForGPC() {
    const gpc = (navigator as any).globalPrivacyControl;
    // if (gpc && gpc === true) {
    //   localStorage.setItem('cookieConsent', 'false');
    //   this.showCookieBanner = false;
    // }
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects === '/cookie-policy') {
          this.showCookieBanner = false;
        } else {
          const consent = localStorage.getItem('cookieConsent');
          if (!consent) {
            this.showCookieBanner = true;
          }
        }
      });
  }
  declineCookies() {
    this.showCookieBanner = false;
    this.cookieService.setConsent('false'); // use the new service method
    this.cookieService.deleteAllCookies(); // use the new service method
  }

  acceptCookies() {
    this.cookieService.setConsent('true'); // use the new service method
    this.showCookieBanner = false;
    this.analyticsService.loadScript();
  }
}
