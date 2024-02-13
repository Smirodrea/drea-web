import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import emailjs from '@emailjs/browser';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { WaitingListService } from 'src/app/services/waiting-list.service';
import { WaitingListFormData } from 'src/app/models/WaitingListFormData ';

export interface Message {
  text: string;
  sender: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('waitingListForm') waitingListForm!: NgForm;
  formSubmittedSuccessfully: boolean = false;
  formSubmissionFailed = false; // Track if the submission failed
  isSubmitting = false; // Track submission status for disabling the button
  retries = 0; // Initialize retries
  formModel: WaitingListFormData = new WaitingListFormData(); // Ensure this is declared
  retryAllowed: boolean = true; // Declare and initialize retryAllowed

  ngAfterViewInit(): void {
    this.videoPlayer.nativeElement.oncanplaythrough = () => {
      this.onVideoLoad();
    };

    this.videoPlayer.nativeElement.play().catch((err: Error) => {
      console.error('Error playing video', err);
    });
  }

  videoSource = 'assets/videos/sharing-agent-infin.mp4';
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  videoLoaded = false; // Flag to track if video is loaded
  onVideoLoad(): void {
    this.videoLoaded = true; // Set the flag to true when video is ready
  }
  constructor(
    private elementRef: ElementRef,
    private snackbarService: SnackbarService,
    private chatService: ChatService,
    private renderer: Renderer2,
    private waitingListService: WaitingListService
  ) {}
  public messages: Message[] = [];
  public userMessage: string = '';

  onSubmit(): void {
    if (this.waitingListForm.valid && !this.isSubmitting) {
      this.isSubmitting = true; // Disable the submit button to indicate loading
      if (this.retries === 1) {
        this.retryAllowed = false;
      }
      this.waitingListService
        .sendEmail(this.waitingListForm.value)
        .then((response) => {
          this.formSubmittedSuccessfully = true;
          this.formSubmissionFailed = false;
          localStorage.setItem('formSubmitted', 'true');
          // Reset retries on successful submission
          this.retries = 0;
          localStorage.setItem('retries', this.retries.toString());
        })
        .catch((error) => {
          console.error('Form submission failed', error);
          this.formSubmissionFailed = true;
          this.isSubmitting = false; // Re-enable the submit button for retry
          this.updateRetries();
        });
    } else {
      this.touchAllFields(); // Make sure all fields are touched to show validation errors
    }
  }

  updateRetries(): void {
    this.retries += 1;
    localStorage.setItem('retries', this.retries.toString());
    if (this.retries >= 2) {
      // Limit retries to 1, disable further submissions if retries exceed 1
      this.isSubmitting = true;
    }
  }

  resetForm(): void {
    if (this.retries < 2) {
      this.formSubmissionFailed = false;
      this.isSubmitting = false;
      this.waitingListForm.resetForm();
    }
  }

  checkRetryAllowed(): void {
    this.retryAllowed = this.retries < 2;
  }

  ngOnInit(): void {
    this.retries = parseInt(localStorage.getItem('retries') || '0', 10);
    this.formSubmittedSuccessfully =
      localStorage.getItem('formSubmitted') === 'true';
    this.checkRetryAllowed();

    this.formSubmittedSuccessfully =
      localStorage.getItem('formSubmitted') === 'true';

    this.setupPhoneLink();
    this.setupEmailCopy();
    this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  touchAllFields(): void {
    Object.values(this.waitingListForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  openSnackBar(text: string) {
    this.snackbarService.showSnackbar(text, 'Close', 3000);
  }

  setupEmailCopy(): void {
    const emailTextElement =
      this.elementRef.nativeElement.querySelector('#email-text');
    this.renderer.listen(emailTextElement, 'click', () => {
      this.copyToClipboard(
        'TalkToUs@DreaAI.com',
        'Email address copied to clipboard'
      );
    });
  }

  title = 'Welcome to our Real Estate Negotiation Platform';
  subtitle =
    'Revolutionizing real estate negotiations with our state-of-the-art platform';
  setupPhoneLink(): void {
    // Locate the WhatsApp link element
    const whatsappLink =
      this.elementRef.nativeElement.querySelector('#whatsapp-link');

    if (whatsappLink) {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        // Mobile detected; WhatsApp click-to-chat will work as is.
      } else {
        // Desktop detected; Try to open both the desktop app and WhatsApp Web.
        whatsappLink.addEventListener('click', (event: Event) => {
          event.preventDefault(); // Stop the default WhatsApp redirect action

          // Attempt to open in WhatsApp Web after a delay
          window.open(
            'https://web.whatsapp.com/send?phone=972547802256&text=Hello!%20I%20would%20like%20to%20know%20more%20about%20DreaAI.',
            '_blank'
          );
          // Fallback to open in WhatsApp Desktop
          setTimeout(() => {
            window.open(
              'whatsapp://send?phone=972547802256&text=Hello!%20I%20would%20like%20to%20know%20more%20about%20DreaAI.',
              '_blank'
            );
          }, 1000);
        });
      }
    }
  }

  copyToClipboard(text: string, snackBarText: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.openSnackBar(snackBarText);
      })
      .catch((err) => {
        this.openSnackBar('Could not copy text: ' + err);
      });
  }
}
