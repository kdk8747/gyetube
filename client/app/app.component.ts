import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <nav>
        <a routerLink="/" routerLinkActive="active">Grassroots</a>
        <!-- <a routerLink="/suwongreenparty" routerLinkActive="active">수원녹색당</a> -->
        <a routerLink="/login" routerLinkActive="active">로그인</a>
        <a routerLink="/mypage" routerLinkActive="active">내정보</a>
      </nav>
    </div>
    <router-outlet></router-outlet>
  `,
  styleUrls: [ './app.component.css' ]
})

export class AppComponent {
  title = 'Tour of Heroes';
}