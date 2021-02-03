import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Subscription} from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  message = new FormControl('');
  namefc = new FormControl('');
  name: string | undefined;
  messages: string[] = [];
  clients: string[] = [];
  sub: Subscription | undefined;
  sub2: Subscription | undefined;
  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.sub = this.chatService.listenForMessages()
      .subscribe(message => {
        console.log('hellloooo');
        this.messages.push(message);
      });

    this.sub2 = this.chatService.listenForClients()
      .subscribe(clients => {
        this.clients = clients;
      });
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }

  sendMessage(): void {
    console.log(this.message.value);
    this.chatService.sendMessage( moment(Date.now()).toDate() + ' ' + this.namefc.value + ': ' + this.message.value);
  }
  sendName(): void {
    console.log(this.namefc.value);
    this.name = this.namefc.value;
    if (this.name) {
      this.chatService.sendName(this.name);
    }
  }
}
