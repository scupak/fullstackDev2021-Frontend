import { Injectable } from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {WelcomeDto} from '../shared/WelcomeDto';
import {ChatClient} from '../shared/chat-client.model';
import {GetClients} from './chat.actions';

export interface ChatStateModel{
  chatClients: ChatClient[];
  chatClient: ChatClient;
}
@State<any>({
  name: 'chat',
  defaults: {
    chatClients: [],
    chatClient: {id: '2', nickname: 'd'}

  }
})
@Injectable()
export class ChatState {
  @Selector()
  static clients(state: ChatStateModel ): ChatClient[]{
  return state.chatClients;
  }

  @Action(GetClients)
  getClients(ctx: StateContext<ChatStateModel>): void {
    // old state Object...
    // {
    // chatClient: {id: '2', nickname: 'd'}
    // }

    const state = ctx.getState();

    const newState: ChatStateModel =
      {
        ...state,
        chatClients: [{id: '22', nickname: 'dd'}]
      };

    ctx.setState(newState);

  }
}
