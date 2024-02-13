import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  @Output() sectionRequested = new EventEmitter<string>();

  closeMenu() {
    const checkbox = document.getElementById(
      'menu-toggle-checkbox'
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  }

  handleNavClick(sectionId: string) {
    this.scrollToSection(sectionId);
  }

  scrollToSection(sectionId: string) {
    this.sectionRequested.emit(sectionId);
  }
}
