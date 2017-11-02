import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Receipt } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class ReceiptService {
  private receiptsUrl = '/api/v1.0/receipts';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  private receipts = {};

  constructor(
    public http: AuthHttp
  ) { }

  print() {
    console.log('receipts: ');
    for (let elem in this.receipts)
      console.log(elem);
  }

  getReceipts(group_id: string): Observable<Receipt[]> {
    const url = `${this.receiptsUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => response.json() as Receipt[])
      .take(1);
  }

  cacheReceipts(group_id: string): void {
    const url = `${this.receiptsUrl}/${group_id}`;
    this.http.get(url)
      .map(response => {
        let receipts = response.json() as Receipt[];
        receipts.map(receipt => {
          if (!this.receipts[group_id + receipt.id])
            this.receipts[group_id + receipt.id] = new Observable<Receipt>(obs => obs.next(receipt))
        });
      }).publishLast().connect(); // connect(): immediately fetch
  }

  getReceipt(group_id: string, id: number): Observable<Receipt> {
    const url = `${this.receiptsUrl}/${group_id}/${id}`;

    if (!this.receipts[group_id + id])
      this.receipts[group_id + id] = this.http.get(url)
        .map(response => response.json() as Receipt)
        .publishLast().refCount();
    return this.receipts[group_id + id];
  }

  update(group_id: string, receipt: Receipt): Observable<Receipt> {
    const url = `${this.receiptsUrl}/${group_id}/${receipt.id}`;
    return this.http
      .put(url, JSON.stringify(receipt), { headers: this.headers })
      .map(() => receipt)
      .take(1);
  }

  create(group_id: string, receipt: Receipt): Observable<Receipt> {
    const url = `${this.receiptsUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(receipt), { headers: this.headers })
      .map(response => response.json() as Receipt)
      .take(1);
  }

  delete(group_id: string, id: number): Observable<void> {
    const url = `${this.receiptsUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
