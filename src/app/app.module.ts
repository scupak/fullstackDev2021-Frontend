import {Injectable, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {Socket, SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxsModule } from '@ngxs/store';
import {environment} from '../environments/environment';
import {ChatState} from "./chat/state/chat.state";



@Injectable()
export class ChatSocket extends Socket {

  constructor() {
    super({ url: 'http://localhost:3000', options: {} });
  }

}

@Injectable()
export class StockSocket extends Socket {

  constructor() {
    super({ url: 'http://localhost:3001', options: {} });
  }

}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule,
    NgbModule,
    NgxsModule.forRoot([ChatState], {
      developmentMode: !environment.production
    })
  ],
  providers: [ChatSocket, StockSocket],
  bootstrap: [AppComponent]
})
export class AppModule { }
