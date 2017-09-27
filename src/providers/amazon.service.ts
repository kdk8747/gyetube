import { Injectable } from '@angular/core';
import { AmazonSignature } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

@Injectable()
export class AmazonService {
    constructor(
      public http: AuthHttp
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

    getAmazonSignatureForReceiptPOST(ISO8601Date: string): Observable<AmazonSignature> {
        let url = `/api/v1.0/sign-s3/suwongreenparty/receipts?amz-date=${ISO8601Date}`;
        return this.http.get(url)
            .map(response => response.json() as AmazonSignature)
            .take(1);
    }

    getAmazonSignatureForPhotoPOST(ISO8601Date: string): Observable<AmazonSignature> {
        let url = `/api/v1.0/sign-s3/suwongreenparty/photos?amz-date=${ISO8601Date}`;
        return this.http.get(url)
            .map(response => response.json() as AmazonSignature)
            .take(1);
    }

    getAmazonSignatureForDocumentPOST(ISO8601Date: string): Observable<AmazonSignature> {
        let url = `/api/v1.0/sign-s3/suwongreenparty/documents?amz-date=${ISO8601Date}`;
        return this.http.get(url)
            .map(response => response.json() as AmazonSignature)
            .take(1);
    }

    postFile(file: File, ISO8601Date: string, amazonSignature: AmazonSignature): Observable<string> {
        let formData = new FormData();
        formData.append('key', amazonSignature.keyPath + file.name);   // FIX ME
        formData.append('acl', 'public-read');
        if (file.type.substr(0, 5) == 'image')
            formData.append('Content-Type', file.type);
        formData.append('x-amz-meta-uuid', '14365123651274'); // remove test
        formData.append('x-amz-server-side-encryption', 'AES256');
        formData.append('success_action_status', '201')
        formData.append('X-Amz-Credential', amazonSignature.credential);
        formData.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
        formData.append('X-Amz-Date', ISO8601Date);
        formData.append('Policy', amazonSignature.stringToSign);
        formData.append('X-Amz-Signature', amazonSignature.signature);
        formData.append('file', file, file.name);
        return this.http.post('http://grassroots-groups.s3.amazonaws.com/', formData)
            .map(response => response.text())
            .take(1);
    }
}
