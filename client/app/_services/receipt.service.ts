import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Receipt } from '../_models';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ReceiptService {
  private receiptsUrl = 'api/v1.0/suwongreenparty/receipts';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthenticationService
  ) { }

  getReceipts(): Promise<Receipt[]> {
    return this.http.get(this.receiptsUrl, this.auth.addJwt())
      .toPromise()
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

  getReceipt(id: number): Promise<Receipt> {
    const url = `${this.receiptsUrl}/${id}`;
    return this.http.get(url, this.auth.addJwt())
      .toPromise()
      .then(response => {
        let receipt = response.json() as Receipt;
        receipt.modifiedDate = new Date(receipt.modifiedDate);
        receipt.paymentDate = new Date(receipt.paymentDate);
        return receipt;
      })
      .catch(this.handleError);

  }

  update(receipt: Receipt): Promise<Receipt> {
    const url = `${this.receiptsUrl}/${receipt.id}`;
    return this.http
      .put(url, JSON.stringify(receipt), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(() => receipt)
      .catch(this.handleError);
  }

  create(receipt: Receipt): Promise<Receipt> {
    return this.http
      .post(this.receiptsUrl, JSON.stringify(receipt), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(response => {
        let receipt = response.json() as Receipt;
        receipt.modifiedDate = new Date(receipt.modifiedDate);
        receipt.paymentDate = new Date(receipt.paymentDate);
        return receipt;
      })
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.receiptsUrl}/${id}`;
    return this.http.delete(url, this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    if (error.status == 401)
      window.location.href = 'login';
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}