import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ListenForClients, StopListeningForClients, UpdateClients } from './chat.actions';
import {Subscription} from 'rxjs';
import {ChatClient} from '../shared/chat-client.model';
import {ChatService} from '../shared/chat.service';

export interface ChatStateModel {
  chatClients: ChatClient[];
}

@State<ChatStateModel>({
  name: 'chat',
  defaults: {
    chatClients: []
  }
})
@Injectable()
export class ChatState {
  initSub: Subscription | undefined;

  constructor(private chatService: ChatService) {
  }

  @Selector()
  static clients(state: ChatStateModel): ChatClient[] {
    return state.chatClients;
  }

  @Action(ListenForClients)
  getClients(ctx: StateContext<ChatStateModel>): void {
    this.initSub = this.chatService.listenForClients()
      .subscribe(clients => {
        ctx.dispatch(new UpdateClients(clients));
      });
  }

  @Action(StopListeningForClients)
  stopListeningForClients(ctx: StateContext<ChatStateModel>): void {
    if (this.initSub) {
      this.initSub.unsubscribe();
    }
  }

  @Action(UpdateClients)
  updateClients(ctx: StateContext<ChatStateModel>, action: UpdateClients): void {
    const state = ctx.getState();
    const newState: ChatStateModel = {
      ...state,
      chatClients: action.clients
    };
    ctx.setState(newState);
  }
}
