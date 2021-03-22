import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {ChatClient} from './chat-client.model';
import {ChatMessage} from './chat-message.model';
import {MessageDTO} from './MessageDTO';
import {WelcomeDto} from './WelcomeDto';
import {ChatSocket} from '../../app.module';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatClient: ChatClient | undefined;

  constructor(private chatSocket: ChatSocket) { }

  sendMessage(msg: MessageDTO): void {
    this.chatSocket.emit('message', msg);
  }

  listenForMessages(): Observable<ChatMessage> {
    return this.chatSocket
      .fromEvent<ChatMessage>('newMessage');
  }

  listenForClients(): Observable<ChatClient[]> {
    return this.chatSocket
      .fromEvent<ChatClient[]>('clients');
  }
  listenForWelcome(): Observable<WelcomeDto> {
    return this.chatSocket
      .fromEvent<WelcomeDto>('welcome');
  }
  listenForTyping(): Observable<ChatClient[]> {
    return this.chatSocket
      .fromEvent<ChatClient[]>('typing');

  }
  listenForError(): Observable<string> {
    return this.chatSocket
      .fromEvent<string>('error');

  }

  getAllMessages(): Observable<ChatMessage[]> {
    return this.chatSocket
      .fromEvent<ChatMessage[]>('allMessages');
  }
  sendNickName(nickname: string): void {
    this.chatSocket.emit('nickname', nickname);
  }
  disconnect(): void {
    this.chatSocket.disconnect();
  }
  connect(): void {
    this.chatSocket.connect();
  }

  typingEvent(typing: boolean): void {

    this.chatSocket.emit('typing', typing);


  }






}
