import { Component } from '@angular/core';


@Component({
    selector: 'greeting',
    template: `
        <div>
        
        <a routerLink="/suwongreenparty" routerLinkActive="active">수원녹색당</a>
        </div>
    `,
    styles: [`
        div {
            border: 1px solid #000000;
            text-align: center;
        }
    `]
})

export class GreetingComponent {
}