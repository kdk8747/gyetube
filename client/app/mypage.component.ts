import { Component, OnInit } from '@angular/core';
import { UserService } from './_services';
import { User } from './_models';


@Component({
    selector: 'mypage',
    template: `
        <div>
            <span>name: {{name}}</span>
            <img class="user" [src]="imageUrl">
            <span>login: {{login}}</span>
        </div>
    `,
    styles: [`
        div {
            border: 1px solid #000000;
            text-align: center;
        }
        .user {
            display: inline-block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
        }
    `]
})

export class MyPageComponent implements OnInit {
    name: string;
    imageUrl: string;
    login: string;

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        let token = localStorage.getItem('currentUserToken');
        if (token) {
            let tokens = token.split('.');
            if (tokens.length === 3) {
                let payload = JSON.parse(window.atob(tokens[1]));
                let userId = payload.id;
                this.userService.getUser(userId)
                .then((user:User) => {
                    this.name = user.name;
                    this.imageUrl = user.imageUrl;
                    this.login = user.login;
                });
            }
        }
    }
}