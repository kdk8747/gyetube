import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ReceiptListElement, ReceiptDetailElement, ReceiptEditorElement } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class ReceiptService {
  private receiptsUrl = '/api/v1.0/groups';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: AuthHttp
  ) { }

   //https://github.com/sidorares/node-mysql2/issues/262  // If this issue is closed, remove this workaround and add timezone=Z to JAWSDB_MARIA_URL
  convertTimestring(str: string) {
    if (str.length == 19)
      return str.replace(' ','T') + 'Z';
    else if (str.length == 10)
      return str + 'T00:00:00Z';
    else
      return new Date().toISOString();
  }

  getReceipts(group_id: number): Observable<ReceiptListElement[]> {
    const url = `${this.receiptsUrl}/${group_id}/receipts`;
    return this.http.get(url)
      .map(response => {
        let receipts = response.json() as ReceiptListElement[];
        return receipts.map(receipt => {
          receipt.modified_datetime = this.convertTimestring(receipt.modified_datetime);
          receipt.settlement_datetime = this.convertTimestring(receipt.settlement_datetime);
          return receipt;
        });
      })
      .take(1);
  }

  getReceipt(group_id: number, receipt_id: number): Observable<ReceiptDetailElement> {
    const url = `${this.receiptsUrl}/${group_id}/receipts/${receipt_id}`;
    return this.http.get(url)
      .map(response => {
        let receipt = response.json() as ReceiptDetailElement;
        receipt.modified_datetime = this.convertTimestring(receipt.modified_datetime);
        receipt.settlement_datetime = this.convertTimestring(receipt.settlement_datetime);
        return receipt;
      })
      .take(1);
  }

  update(group_id: number, receipt: ReceiptEditorElement): Observable<ReceiptListElement> {
    const url = `${this.receiptsUrl}/${group_id}/receipts/${receipt.receipt_id}`;
    return this.http
      .put(url, JSON.stringify(receipt), { headers: this.headers })
      .map(() => new ReceiptListElement(receipt.receipt_id, 0, new Date().toISOString(),
        receipt.settlement_datetime, receipt.title, receipt.difference, 0, receipt.image_url))
      .take(1);
  }

  create(group_id: number, receipt: ReceiptEditorElement): Observable<ReceiptListElement> {
    const url = `${this.receiptsUrl}/${group_id}/receipts`;
    return this.http
      .post(url, JSON.stringify(receipt), { headers: this.headers })
      .map(response => {
        let res = response.json() as ReceiptListElement;
        return new ReceiptListElement(res.receipt_id, res.creator_id, new Date().toISOString(),
          receipt.settlement_datetime,
          receipt.title,
          receipt.difference,
          0, receipt.image_url);
      })
      .take(1);
  }

  delete(group_id: number, id: number): Observable<void> {
    const url = `${this.receiptsUrl}/${group_id}/receipts/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
