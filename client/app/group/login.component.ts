import { Component } from '@angular/core';
import { AuthenticationService } from '../_services';

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

export class LoginComponent{

    constructor(
        private authenticationService: AuthenticationService
    ) { }

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