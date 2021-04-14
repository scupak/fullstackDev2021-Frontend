import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import {NgxsModule} from '@ngxs/store';
import {StockState} from './state/stock.state';


@NgModule({
  declarations: [StockComponent],
  imports: [
    CommonModule,
    StockRoutingModule,
    NgxsModule.forFeature([StockState])
  ]
})
export class StockModule { }
