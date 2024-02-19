import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss'],
})
export class LoadingButtonComponent {
  buttonState: '' | 'pending' | 'success' | 'fail' = '';

  // Updated method signature to include 'pending'
  triggerAnimation(state: '' | 'pending' | 'success' | 'fail'): void {
    if (state === 'pending') {
      this.buttonState = 'pending';
      // You might want to handle the pending state differently, for example,
      // by not setting a timeout here to automatically switch to another state.
    } else {
      // Proceed to set to pending, then to the desired end state after a delay.
      this.buttonState = 'pending';
      setTimeout(() => {
        this.buttonState = state;
        setTimeout(() => (this.buttonState = ''), 1500); // Reset state after animation
      }, 1500);
    }
  }
}
