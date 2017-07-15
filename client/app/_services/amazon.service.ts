import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AmazonService {
    private amazonUrl = 'api/sign-s3';  // URL to web api
    private crypto = require('crypto-js');

    constructor(private http: Http) { }

    getSignatureKey(Crypto: any, key: string, dateStamp: string, regionName: string, serviceName: string) {
        var kDate = Crypto.HmacSHA256(dateStamp, 'AWS4' + key);
        var kRegion = Crypto.HmacSHA256(regionName, kDate);
        var kService = Crypto.HmacSHA256(serviceName, kRegion);
        var kSigning = Crypto.HmacSHA256('aws4_request', kService);
        return kSigning;
    }

    getAmzDate(dateStr: string) {
        var chars = [":", "-"];
        for (var i = 0; i < chars.length; i++) {
            while (dateStr.indexOf(chars[i]) != -1) {
                dateStr = dateStr.replace(chars[i], "");
            }
        }
        dateStr = dateStr.split(".")[0] + "Z";
        return dateStr;
    }

    test(file: any): Promise<any> {
        let access_key_id = '';
        let secret_access_key = '';
        let amzDate = this.getAmzDate(new Date().toISOString());
        let authDate = amzDate.split("T")[0];
        let policy = {
            "expiration": "2017-07-16T12:00:00.000Z",
            "conditions": [
                { "bucket": "grassroots-groups" },
                ["starts-with", "$key", "user/grassroots-s3/"],
                { "acl": "public-read" },
                //{ "success_action_redirect": "http://grassroots-groups.s3.amazonaws.com/successful_upload.html" },
                ["starts-with", "$Content-Type", "image/"],
                { "x-amz-meta-uuid": "14365123651274" },
                { "x-amz-server-side-encryption": "AES256" },
                ["starts-with", "$x-amz-meta-tag", ""],

                { "x-amz-credential": `${access_key_id}/${authDate}/ap-northeast-2/s3/aws4_request` },
                { "x-amz-algorithm": "AWS4-HMAC-SHA256" },
                { "x-amz-date": amzDate }
            ]
        };
        let policyString = JSON.stringify(policy);
        let formData = new FormData();
        formData.append('key', 'user/grassroots-s3/' + file.name);
        formData.append('acl', 'public-read');
        //formData.append('success_action_redirect', 'http://grassroots-groups.s3.amazonaws.com/successful_upload.html');
        formData.append('Content-Type', 'image/jpeg');
        formData.append('x-amz-meta-uuid', '14365123651274');
        formData.append('x-amz-server-side-encryption', 'AES256');
        formData.append('X-Amz-Credential', `${access_key_id}/${authDate}/ap-northeast-2/s3/aws4_request`);
        formData.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
        formData.append('X-Amz-Date', amzDate);
        formData.append('x-amz-meta-tag', '');
        formData.append('Policy', window.btoa(policyString));
        formData.append('X-Amz-Signature',
            this.crypto.HmacSHA256(window.btoa(policyString),
                this.getSignatureKey(this.crypto,
                    secret_access_key,
                    authDate,
                    'ap-northeast-2',
                    's3')));
        formData.append('file', file, file.name);
        //let headers = new Headers({ 'Content-Type': 'multipart/form-data' });
        return this.http.post('http://grassroots-groups.s3.amazonaws.com/', formData)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}