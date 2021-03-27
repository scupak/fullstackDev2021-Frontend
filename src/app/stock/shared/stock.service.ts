import { Injectable } from '@angular/core';
import {StockSocket} from '../../app.module';
import {Stock} from './stock.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private stockSocket: StockSocket ) { }

  UpdateStock(stock: Stock): void{
   this.stockSocket.emit('update', stock);
   console.log('Update emitted!!!');
  }

  listenForUpdate(): Observable<Stock>{
    const stock = this.stockSocket.fromEvent<Stock>('stockUpdate');
    console.log(stock);
    return stock;

  }

  ListenForAllStocks(): Observable<Stock[]>{

        return this.stockSocket.fromEvent<Stock[]>('stocks');

  }
  listenForError(): Observable<string> {
    return this.stockSocket
      .fromEvent<string>('error');

  }
}
