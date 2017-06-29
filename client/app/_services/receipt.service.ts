import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Receipt } from '../_models';

@Injectable()
export class ReceiptService {
  private receiptsUrl = 'api/receipts';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  getReceipts(): Promise<Receipt[]> {
    return this.http.get(this.receiptsUrl)
      .toPromise()
      .then(response => response.json() as Receipt[])
      .catch(this.handleError);
  }

  getReceipt(id: number): Promise<Receipt> {
    const url = `${this.receiptsUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Receipt)
      .catch(this.handleError);

  }

  update(hero: Receipt): Promise<Receipt> {
    const url = `${this.receiptsUrl}/${hero.id}`;
    return this.http
      .put(url, JSON.stringify(hero), { headers: this.headers })
      .toPromise()
      .then(() => hero)
      .catch(this.handleError);
  }

  create(name: string): Promise<Receipt> {
    return this.http
      .post(this.receiptsUrl, JSON.stringify({ name: name }), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as Receipt)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.receiptsUrl}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}