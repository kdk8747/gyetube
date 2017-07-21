import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'login',
    template: `
        <div class="activity">
            <button (click)="onNaverLogin()">
                Naver Login
            </button>
            <button (click)="onKakaoLogin()">
                Kakao Login
            </button>
            <button (click)="onFacebookLogin()">
                Facebook Login
            </button>
        </div>
    `,
    styles: [`
        div {
            border: 1px solid #000000;
            text-align: center;
        }
    `]
})

export class LoginComponent {

    constructor(
        private authenticationService: AuthenticationService,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        // subscribe to router event
        this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
            let code = queryParams['code'];
            let state = queryParams['state'];
            //this.authenticationService.accesstoken();
        });
    }


    onNaverLogin(): void {
        ;
    }

    onKakaoLogin(): void {
        this.authenticationService.kakaoLogin();
    }

    onFacebookLogin(): void {
        ;
    }
}