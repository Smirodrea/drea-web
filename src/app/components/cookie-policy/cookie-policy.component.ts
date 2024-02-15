import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'src/app/services/cookie.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss'],
})
export class CookiePolicyComponent {
  public cookieStatus = 'Unknown';

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private googleAnalytics: GoogleAnalyticsService
  ) {}
  ngOnInit() {
    this.updateStatus();
  }

  getCookieStatusClass() {
    return this.cookieStatus.toLowerCase();
  }
  acceptCookies() {
    this.cookieService.setConsent('true');
    this.updateStatus();
    this.router.navigate(['/']);
  }

  declineCookies() {
    this.cookieService.setConsent('false');
    this.cookieService.deleteAllCookies();
    this.updateStatus();
    this.router.navigate(['/']);
  }

  updateStatus() {
    const consent = this.cookieService.getConsent();
    this.cookieStatus = consent === 'true' ? 'Accepted' : 'Declined';
    this.googleAnalytics.consentGiven();
  }
}
