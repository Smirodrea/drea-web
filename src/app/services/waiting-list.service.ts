import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root',
})
export class WaitingListService {
  constructor() {
    emailjs.init(environment.emailjsPublicKey);
  }

  sendEmail(templateParams: any) {
    if (environment.production) {
      return emailjs.send(
        environment.emailjsServiceId,
        environment.emailjsTemplateId,
        templateParams
      );
    } else {
      alert('Something Went Wrong!');
      return Promise.resolve({ status: 200, text: 'OK' });
    }
  }
}
