import { Component, HostListener } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import * as AOS from 'aos';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { GoogleAnalyticsService } from './services/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  scrollToSection(sectionId: string) {
    // Timeout to allow for navigation and DOM updates
    debugger;
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.googleAnalytics.trackVirtualPageView(`/${section}`);
      }
    }, 0);
  }

  title = 'drea-website';
  isScrolledToTop = false;
  isMenuOpen = false;
  showScrollTopIcon = true;
  pendingScroll: string | null = null;
  isHomeRoute = true;

  handleMenuClick(event: Event) {
    event.stopPropagation();
  }
  closeMenu() {
    this.isMenuOpen = false;
    this.isNavbarVisible = true;
    document.body.style.overflow = '';
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
      // opacity when the menu is open
      const menu = document.querySelector('.menu') as HTMLElement | null;
      if (menu) {
        menu.style.opacity = '0.98';
      }
    } else {
      document.body.style.overflow = '';
    }
  }
  showMenu() {
    this.isNavbarVisible = true;
  }
  hideMenu() {
    this.isNavbarVisible = false;
  }

  handleLinkClick(elementId: string) {
    debugger;
    if (this.isHomeRoute) {
      this.scrollToElement(elementId);
    } else {
      this.pendingScroll = elementId;

      this.router.navigate(['/']).then(() => {
        this.scrollToElement(elementId);
      });
    }
  }
  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
    private googleAnalytics: GoogleAnalyticsService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.pendingScroll) {
          setTimeout(() => {
            if (this.pendingScroll) this.scrollToElement(this.pendingScroll);
            this.pendingScroll = null;
          }, 100); // Give it a small delay
        }
        this.isHomeRoute =
          this.router.url === '/' || this.router.url === '/home';
      });
  }

  checkForGPC() {
    const gpc = (navigator as any).globalPrivacyControl;
    if (gpc && gpc === true) {
      localStorage.setItem('cookiesConsent', 'false');
    }
  }

  ngOnInit() {
    this.checkForGPC();
    AOS.init({
      duration: 1000, // This will control the duration of the animation
      startEvent: 'DOMContentLoaded', // Name of the event dispatched on the document, that AOS should initialize on
      initClassName: 'aos-init', // Class applied after initialization
      animatedClassName: 'aos-animate', // Class applied on animation
      useClassNames: false, // If true, will add content of `data-aos` as classes on scroll
      disable: false, // Disable animations on devices that match the following CSS media query, i.e., `(max-width: 1024px)`
      offset: 120, // Offset (in px) from the original trigger point
      delay: 0, // Values from 0 to 3000, with step 50ms
      easing: 'ease', // Easing function to use
      once: false, // Whether animation should happen only once - while scrolling down
      mirror: false, // Whether elements should animate out while scrolling past them
      anchorPlacement: 'top-bottom', // Defines which position of the element regarding to window should trigger the animation
    });
  }
  scrollToElement(id: string): void {
    const offset = 133;
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = this.getElementPosition(element);

      if (this.isHomeRoute) {
        this.viewportScroller.scrollToPosition([0, elementPosition - offset]);
        this.highlightSection(id);
      } else {
        this.pendingScroll = id;

        this.router.navigate(['/']).then(() => {
          this.viewportScroller.scrollToPosition([0, elementPosition - offset]);
          this.highlightSection(id);
        });
      }
    }
  }
  private getElementPosition(element: HTMLElement): number {
    return element.getBoundingClientRect().top + window.pageYOffset;
  }
  highlightSection(id: string) {
    const element = document.getElementById(id);
    if (element === null) return; // If element is not found, return

    // Save the original background color.
    const originalBgColor = window.getComputedStyle(element).backgroundColor;

    // Calculate the new background color. (This is where you can get creative.)
    const highlightColor = 'rgb(1 38 79 / 13%)';

    // Apply the highlight color.
    element.style.backgroundColor = highlightColor;

    // After a set period, fade out to original color
    setTimeout(() => {
      element.style.transition = 'background-color 1s ease-in-out';
      element.style.backgroundColor = originalBgColor;
    }, 13);

    // After transition, remove added styles so it returns to its original state
    setTimeout(() => {
      element.style.transition = '';
      element.style.backgroundColor = '';
      element.style.color = '';
    }, 1000);
  }

  isNavbarVisible = true;
  lastScrollTop = 0;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const proximityThreshold = 100; // Distance in pixels to consider as "near"

    if (event.clientY < proximityThreshold) {
      this.showMenu(); // Function to show the menu
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const yOffset = window.pageYOffset;
    const scrollTop = document.documentElement.scrollTop;

    this.showScrollTopIcon = (yOffset || scrollTop) > window.innerHeight;
    this.closeMenu();
    var menu = document.querySelector('.menu') as HTMLElement | null;
    var menuBorder = document.querySelector(
      '.menu-border'
    ) as HTMLElement | null;
    this.showScrollTopIcon = window.pageYOffset > 400;
    let currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    if (currentScrollTop > this.lastScrollTop) {
      // Scroll down
      this.isNavbarVisible = false;
      if (menu) {
        menu.style.opacity = '0.1';
      }
      if (menuBorder) {
        menuBorder.style.opacity = '0.1';
      }
    } else {
      // Scroll up
      this.isNavbarVisible = true;

      if (menu) {
        if (currentScrollTop === 0) {
          menu.style.opacity = '1';
          menu.style.top = '-108px';
        } else {
          menu.style.opacity = '0.93';
          menu.style.top = '-113px';
        }
      }
    }
    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }
}
