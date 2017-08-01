import { Component, OnInit } from '@angular/core';
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
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        // subscribe to router event
        this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
            let token = queryParams['token'];
            console.log(token); // TODO: https
        });
    }


    onNaverLogin(): void {
        window.location.href = 'api/users/auth/naver';
    }

    onKakaoLogin(): void {
        window.location.href = 'api/users/auth/kakao';
    }

    onFacebookLogin(): void {
        window.location.href = 'api/users/auth/facebook';
    }
}