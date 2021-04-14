import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {Stock} from '../shared/stock.model';
import {Subscription} from 'rxjs';
import {StockService} from '../shared/stock.service';
import {ListenForStocks, StopListeningForStocks, UpdateStocks} from './stock.actions';

export interface StockStateModel {
  stocks: Stock[];
}

@State<StockStateModel>({
  name: 'stock',
  defaults: {
    stocks: []
  }
})
@Injectable()
export class StockState{
  initSub: Subscription | undefined;
  constructor(private stockService: StockService) {
  }
  @Selector()
  static stocks(state: StockStateModel): Stock[] {
    return state.stocks;
  }

  @Action(ListenForStocks)
  getStocks(ctx: StateContext<StockStateModel>): void {
    this.initSub = this.stockService.ListenForAllStocks()
      .subscribe(stocks => {
        ctx.dispatch(new UpdateStocks(stocks));
      });

  }

  @Action(StopListeningForStocks)
  stopListeningForStocks(ctx: StateContext<StockStateModel>): void {
    if (this.initSub) {
      this.initSub.unsubscribe();
    }
  }

  @Action(UpdateStocks)
  updateStocks(ctx: StateContext<StockStateModel>, action: UpdateStocks): void{
    const state = ctx.getState();
    const newState: StockStateModel = {
      ...state,
      stocks: action.stocks
    };
    ctx.setState(newState);
  }

}
