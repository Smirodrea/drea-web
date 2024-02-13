import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { BenefitsComponent } from './components/benefits/benefits.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';

import { MatStepperModule } from '@angular/material/stepper';
import { AlgorithmComponent } from './components/algorithm/algorithm.component';
import { CookieNoticeComponent } from './components/cookie-notice/cookie-notice.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './components/nav/nav.component';
import { Home2Component } from './components/home2/home2.component';
import { Home3Component } from './components/home3/home3.component';
import { Home4Component } from './components/home4/home4.component';
import { LoadingButtonComponent } from './components/loading-button/loading-button.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HowItWorksComponent,
    BenefitsComponent,
    PricingComponent,
    ContactUsComponent,
    AlgorithmComponent,
    CookieNoticeComponent,
    CookiePolicyComponent,
    NavComponent,
    Home2Component,
    Home3Component,
    Home4Component,
    LoadingButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MatStepperModule,
    ScrollingModule,
    MatSnackBarModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
