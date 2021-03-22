import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  clientidIdentifier = 'clientId';
  constructor() { }

  saveClientId(clientId: string): void{

    localStorage.setItem(this.clientidIdentifier, clientId);

  }

  getClientId(): string | null {


    return localStorage.getItem(this.clientidIdentifier);

  }
}
