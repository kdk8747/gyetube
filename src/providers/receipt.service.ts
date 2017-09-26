import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Receipt } from '../models';
import { HttpWrapperService } from './http-wrapper.service';

@Injectable()
export class ReceiptService {
  private receiptsUrl = '/api/v1.0/receipts';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: HttpWrapperService
  ) { }

  getReceipts(group_id: string): Promise<Receipt[]> {
    const url = `${this.receiptsUrl}/${group_id}`;
    return this.http.get(url)
      .then(response => {
        let receipts = response.json() as Receipt[];
        return receipts.map(receipt => {
          receipt.modifiedDate = new Date(receipt.modifiedDate);
          receipt.paymentDate = new Date(receipt.paymentDate);
          return receipt;
        })
      })
      .catch(this.handleError);
  }

  getReceipt(group_id: string, id: number): Promise<Receipt> {
    const url = `${this.receiptsUrl}/${group_id}/${id}`;
    return this.http.get(url)
      .then(response => {
        let receipt = response.json() as Receipt;
        receipt.modifiedDate = new Date(receipt.modifiedDate);
        receipt.paymentDate = new Date(receipt.paymentDate);
        return receipt;
      })
      .catch(this.handleError);

  }

  update(group_id: string, receipt: Receipt): Promise<Receipt> {
    const url = `${this.receiptsUrl}/${group_id}/${receipt.id}`;
    return this.http
      .put(url, JSON.stringify(receipt), { headers: this.headers })
      .then(() => receipt)
      .catch(this.handleError);
  }

  create(group_id: string, receipt: Receipt): Promise<Receipt> {
    const url = `${this.receiptsUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(receipt), { headers: this.headers })
      .then(response => {
        let receipt = response.json() as Receipt;
        receipt.modifiedDate = new Date(receipt.modifiedDate);
        receipt.paymentDate = new Date(receipt.paymentDate);
        return receipt;
      })
      .catch(this.handleError);
  }

  delete(group_id: string, id: number): Promise<void> {
    const url = `${this.receiptsUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
