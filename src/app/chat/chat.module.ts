import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxsModule} from '@ngxs/store';
import {ChatState} from './state/chat.state';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    ReactiveFormsModule, NgxsModule.forFeature([ChatState])
  ]
})
export class ChatModule { }
