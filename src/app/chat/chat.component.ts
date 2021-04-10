import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, take, takeUntil} from 'rxjs/operators';
import {ChatClient} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';
import {DatePipe} from '@angular/common';
import {ChatState} from './state/chat.state';
import {Select, Store} from '@ngxs/store';
import {ListenForClients, StopListeningForClients} from "./state/chat.actions";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  message = new FormControl('');
  nickNameFc = new FormControl('');
  messages: ChatMessage[] = [];
  unsubscribe$ = new Subject();
  @Select(ChatState.clients)
  clients$: Observable<ChatClient[]> | undefined;
  typingClients$: Observable<ChatClient[]> | undefined;
  chatClient: ChatClient | undefined;
  public error: string | undefined;
  constructor(private chatService: ChatService, private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ListenForClients());
    this.typingClients$ = this.chatService.listenForTyping();
    this.chatService.listenForMessages()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(message => {
        console.log('hellloooo');
        this.messages.push(message);
      });

    this.chatService.listenForError()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(error => {
        console.log(error);
        this.error = error;
      });

    this.chatService.listenForWelcome()
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(welcome => {
      this.messages = welcome.messages;
      this.chatClient = this.chatService.chatClient = welcome.client;

    });
    if (this.chatService.chatClient){
      this.chatService.sendNickName(this.chatService.chatClient.nickname);
    }

    this.message.valueChanges
      .pipe(takeUntil(this.unsubscribe$)
      ).subscribe( (value) => {
        if (value.length > 0){
          this.chatService.typingEvent(true);
          console.log('typing');
        }
        else{
          this.chatService.typingEvent(false);
          console.log('not typing');
        }
    });

    /*
    this.chatService.getAllMessages()
      .pipe(
        take(1)
      )
      .subscribe(messages => {
        console.log('hellloooo');
        this.messages = messages;
      });

     */
    // this.chatService.connect();
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.store.dispatch(new StopListeningForClients());
    // this.chatService.disconnect();
  }

  sendMessage(): void {
    console.log(this.message.value);
    this.chatService.sendMessage({message: this.message.value, date: Date.now() } );
    this.message.patchValue('');
  }

  sendNickName(): void {
    if (this.nickNameFc.value) {


      this.chatService.sendNickName(this.nickNameFc.value);
    }
  }
}
