import {Stock} from '../shared/stock.model';


export class ListenForStocks {
  static readonly type = '[chat] Listen for stocks';
}

export class StopListeningForStocks {
  static readonly type = '[chat] Stop listening for stocks';
}

export class UpdateStocks {
  constructor(public stocks: Stock[]) {}

  static readonly type = '[chat] Update stocks';

}
