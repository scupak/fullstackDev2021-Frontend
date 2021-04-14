import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ChatClient} from '../chat/shared/chat-client.model';
import {Stock} from './shared/stock.model';
import {StockService} from './shared/stock.service';
import {takeUntil} from 'rxjs/operators';
import {Select, Store} from '@ngxs/store';
import {StockState} from './state/stock.state';
import {ListenForStocks, StopListeningForStocks, UpdateStocks} from './state/stock.actions';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit , OnDestroy{
  @Select(StockState.stocks)
  stocks$: Observable<Stock[]> | undefined;
  stocks: Stock[] | undefined;
  currentStock: Stock | undefined;
  unsubscribe$ = new Subject();

  constructor(private stockService: StockService, private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ListenForStocks());

    this.stocks$?.pipe(takeUntil(this.unsubscribe$)
    ).subscribe(stocksArray => {
      const stocksArrayClone: Stock[] | undefined = [];
      stocksArray.forEach(value => stocksArrayClone.push({id: value.id,
        price: value.price,
        desc: value.desc}));
      this.stocks = stocksArrayClone; } );

    this.stockService.listenForSelect()
      .pipe(takeUntil(this.unsubscribe$)
      ).subscribe(stock => {
        this.currentStock = stock;
      });
/*
    this.stockService.ListenForAllStocks().pipe(takeUntil(this.unsubscribe$)
    ).subscribe(stocksArray => {
      const stocksArrayClone: Stock[] | undefined = [];
      stocksArray.forEach(value => stocksArrayClone.push({id: value.id,
        price: value.price,
        desc: value.desc}));
      this.stocks = stocksArrayClone;
    } );
*/
    this.stockService.listenForUpdate()
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(stock => {
        if (this.stocks !== undefined) {
          const index = this.stocks?.findIndex(arrayStock => arrayStock.id === stock.id);


          this.stocks[index] = stock;
          this.store.dispatch(new UpdateStocks(this.stocks));
          console.log('Update!!!!');
        }
    } );

  }
  ngOnDestroy(): void {
    console.log('Destroyed');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.store.dispatch(new StopListeningForStocks());
    // this.chatService.disconnect();
  }

  selectStock(stock: Stock): void{
    this.currentStock = stock;
  }

  increaseStock(stock: Stock): void{
    const newStock = {id: stock.id,
      price: stock.price,
      desc: stock.desc};
    newStock.price += 1;
    this.stockService.UpdateStock(newStock);
  }

  decreaseStock(stock: Stock): void{
    const newStock = {id: stock.id,
      price: stock.price,
      desc: stock.desc};
    newStock.price -= 1;
    this.stockService.UpdateStock(newStock);
  }

}
