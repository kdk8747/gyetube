import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ReceiptListElement, ReceiptDetailElement } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class ReceiptService {
  private receiptsUrl = '/api/v1.0/receipts';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: AuthHttp
  ) { }

  getReceipts(group_id: number): Observable<ReceiptListElement[]> {
    const url = `${this.receiptsUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => response.json() as ReceiptListElement[])
      .take(1);
  }

  getReceipt(group_id: number, receipt_id: number): Observable<ReceiptDetailElement> {
    const url = `${this.receiptsUrl}/${group_id}/${receipt_id}`;
    return this.http.get(url)
      .map(response => response.json() as ReceiptDetailElement)
      .take(1);
  }

  update(group_id: number, receipt: ReceiptDetailElement): Observable<ReceiptDetailElement> {
    const url = `${this.receiptsUrl}/${group_id}/${receipt.receipt_id}`;
    return this.http
      .put(url, JSON.stringify(receipt), { headers: this.headers })
      .map(() => receipt)
      .take(1);
  }

  create(group_id: number, receipt: ReceiptDetailElement): Observable<ReceiptDetailElement> {
    const url = `${this.receiptsUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(receipt), { headers: this.headers })
      .map(response => response.json() as ReceiptDetailElement)
      .take(1);
  }

  delete(group_id: number, id: number): Observable<void> {
    const url = `${this.receiptsUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
