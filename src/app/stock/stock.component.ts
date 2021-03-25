import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ChatClient} from '../chat/shared/chat-client.model';
import {Stock} from './shared/stock.model';
import {StockService} from './shared/stock.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit , OnDestroy{
  stocks: Stock[] | undefined;
  unsubscribe$ = new Subject();

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.stockService.ListenForAllStocks().pipe(takeUntil(this.unsubscribe$)
    ).subscribe(stocksArray => { this.stocks = stocksArray; } );

    this.stockService.listenForUpdate()
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(stock => {
        if(this.stocks !== undefined) {
          const index = this.stocks?.findIndex(arrayStock => arrayStock.id === stock.id);


          this.stocks[index] = stock;
        }
    } );

  }
  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    //this.chatService.disconnect();
  }

}
