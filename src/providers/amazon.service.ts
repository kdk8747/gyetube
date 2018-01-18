import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AmazonSignature } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { EnvVariables } from '../app/environment-variables/environment-variables.token';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

@Injectable()
export class AmazonService {
  constructor(
    public authHttp: AuthHttp,
    public http: Http,
    @Inject(EnvVariables) public envVariables
  ) { }

  getISO8601Date(date: Date) {
    let dateStr = date.toISOString();
    let chars = [":", "-"];
    for (let i = 0; i < chars.length; i++) {
      while (dateStr.indexOf(chars[i]) != -1) {
        dateStr = dateStr.replace(chars[i], "");
      }
    }
    dateStr = dateStr.split(".")[0] + "Z";
    return dateStr;
  }

  getAmazonSignatureForReceiptPOST(groupID: number, ISO8601Date: string): Observable<AmazonSignature> {
    let url = `/api/v1.0/groups/${groupID}/sign-s3/post/receipt?amz-date=${ISO8601Date}`;
    return this.authHttp.get(url)
      .map(response => response.json() as AmazonSignature)
      .take(1);
  }

  getAmazonSignatureForActivityPOST(groupID: number, ISO8601Date: string): Observable<AmazonSignature> {
    let url = `/api/v1.0/groups/${groupID}/sign-s3/post/activity?amz-date=${ISO8601Date}`;
    return this.authHttp.get(url)
      .map(response => response.json() as AmazonSignature)
      .take(1);
  }

  postImageFile(file: File, ISO8601Date: string, amazonSignature: AmazonSignature): Observable<string> {
    let formData = new FormData();
    formData.append('key', amazonSignature.keyPath);
    formData.append('acl', 'public-read');
    formData.append('Content-Type', file.type);
    formData.append('x-amz-server-side-encryption', 'AES256');
    formData.append('success_action_status', '201')
    formData.append('X-Amz-Credential', amazonSignature.credential);
    formData.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
    formData.append('X-Amz-Date', ISO8601Date);
    formData.append('Policy', amazonSignature.stringToSign);
    formData.append('X-Amz-Signature', amazonSignature.signature);
    formData.append('file', file, file.name);
    return this.http.post(this.envVariables.amazonS3Endpoint, formData)
      .map(response => response.text())
      .take(1);
  }

  getAmazonSignatureForReceiptDELETE(groupID: number, ISO8601Date: string, keyPath: string): Observable<AmazonSignature> {
    let url = `/api/v1.0/groups/${groupID}/sign-s3/delete/receipt?amz-date=${ISO8601Date}&key-path=${keyPath}`;
    return this.authHttp.get(url)
      .map(response => response.json() as AmazonSignature)
      .take(1);
  }

  deleteFile(ISO8601Date: string, amazonSignature: AmazonSignature, keyPath: string): Observable<string> {
    let myHeaders = new Headers();
    myHeaders.append('Authorization',
    `AWS4-HMAC-SHA256 \
Credential=${amazonSignature.credential},\
SignedHeaders=host;x-amz-content-sha256;x-amz-date,\
Signature=${amazonSignature.signature}`);
    myHeaders.append('x-amz-content-sha256', amazonSignature.hashedPayload);
    myHeaders.append('x-amz-date', ISO8601Date);

    let options = new RequestOptions();
    options.headers = myHeaders;

    return this.http.delete(this.envVariables.amazonS3Endpoint + keyPath, options)
      .map(response => response.text())
      .take(1);
  }
}
