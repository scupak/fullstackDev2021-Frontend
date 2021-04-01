import { Injectable } from '@angular/core';
import {StockSocket} from '../../app.module';
import {Stock} from './stock.model';
import {Observable} from 'rxjs';
import {StockDTO} from './stockDTO';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private stockSocket: StockSocket ) { }

  UpdateStock(stock: StockDTO): void{
   this.stockSocket.emit('update', stock);
   console.log('Update emitted!!!');
  }

  listenForUpdate(): Observable<StockDTO>{
    const stock = this.stockSocket.fromEvent<StockDTO>('stockUpdate');
    console.log(stock);
    return stock;

  }

  ListenForAllStocks(): Observable<StockDTO[]>{

        return this.stockSocket.fromEvent<StockDTO[]>('stocks');

  }
  listenForError(): Observable<string> {
    return this.stockSocket
      .fromEvent<string>('error');

  }
}
