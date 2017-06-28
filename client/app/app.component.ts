import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div>
      <div>수원녹색당</div> <div>회원가입 | 로그인</div>
    </div>
    <router-outlet></router-outlet>
  `,
  styleUrls: [ './app.component.css' ]
})

export class AppComponent {
  title = 'Tour of Heroes';
}