import { Injectable } from '@angular/core';
import { AmazonSignature } from '../models';
import { HttpWrapperService } from './http-wrapper.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AmazonService {
    constructor(
        private http: HttpWrapperService
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

    getAmazonSignatureForReceiptPOST(ISO8601Date: string): Promise<AmazonSignature> {
        let url = `/api/v1.0/sign-s3/suwongreenparty/receipts?amz-date=${ISO8601Date}`;
        return this.http.get(url)
            .then(response => response.json() as AmazonSignature)
            .catch(this.handleError);
    }

    getAmazonSignatureForPhotoPOST(ISO8601Date: string): Promise<AmazonSignature> {
        let url = `/api/v1.0/sign-s3/suwongreenparty/photos?amz-date=${ISO8601Date}`;
        return this.http.get(url)
            .then(response => response.json() as AmazonSignature)
            .catch(this.handleError);
    }

    getAmazonSignatureForDocumentPOST(ISO8601Date: string): Promise<AmazonSignature> {
        let url = `/api/v1.0/sign-s3/suwongreenparty/documents?amz-date=${ISO8601Date}`;
        return this.http.get(url)
            .then(response => response.json() as AmazonSignature)
            .catch(this.handleError);
    }

    postFile(file: File, ISO8601Date: string, amazonSignature: AmazonSignature): Promise<string> {
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
            .then(response => response.text())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
