import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AmazonSignature } from '../_models';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AmazonService {
    constructor(private http: Http) { }

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

    getAmazonSignatureForReceiptPOST(ISO8601Date: string): Promise<AmazonSignature> {
        let url = `api/sign-s3/receipts?amz-date=${ISO8601Date}`;
        return this.http.get(url)
            .toPromise()
            .then(response => {
                let amazonSignature = response.json() as AmazonSignature;
                console.log(amazonSignature);
                return amazonSignature;
            }).catch(this.handleError);
    }

    postReceipt(file: File, ISO8601Date: string, amazonSignature: AmazonSignature): Promise<void> {
        let formData = new FormData();
        console.log(file);
        formData.append('key', amazonSignature.keyPath + file.name);   // FIX ME
        formData.append('acl', 'public-read');
        formData.append('Content-Type', file.type);
        formData.append('x-amz-meta-uuid', '14365123651274'); // remove test
        formData.append('x-amz-server-side-encryption', 'AES256');
        formData.append('X-Amz-Credential', amazonSignature.credential);
        formData.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
        formData.append('X-Amz-Date', ISO8601Date);
        formData.append('Policy', amazonSignature.stringToSign);
        formData.append('X-Amz-Signature', amazonSignature.signature);
        formData.append('file', file, file.name);
        return this.http.post('http://grassroots-groups.s3.amazonaws.com/', formData)
            .toPromise()
            .then(() => { console.log('post end'); })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}