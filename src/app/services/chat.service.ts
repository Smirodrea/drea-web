import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private _messages = new BehaviorSubject<Message[]>([]);
  public messages$ = this._messages.asObservable();

  constructor(private http: HttpClient) {}

  addMessage(message: Message) {
    const currentMessages = this._messages.getValue();
    this._messages.next([...currentMessages, message]);
  }

  async sendMessage(userMessage: string) {
    // try {
    //   // Call the backend API to get the chatbot response
    //   const response = await this.http
    //     .post<{ message: Message }>('https://localhost:7187/api/Chat', {
    //       text: userMessage,
    //       sender: 'user',
    //     })
    //     .toPromise();
    //   // Add user's message to chat
    //   this.addMessage({ text: userMessage, sender: 'user' });
    //   // Add chatbot's response to chat
    //   if (response) this.addMessage(response.message);
    // } catch (error) {
    //   console.error('Error in sending message:', error);
    // }
  }
}

export interface Message {
  text: string;
  sender: string;
}
