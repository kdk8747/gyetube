import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { User } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';


@Injectable()
export class UserService {
  private usersUrl = '/api/v1.0/users';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  private users = {};
  private responseTimeMs: number = 0;

  constructor(
    public http: AuthHttp
  ) { }

  /*getUsers(): Observable<User[]> {
    return this.http.get(this.usersUrl)
      .map(response => response.json() as User[])
      .take(1);
  }*/

  print() {
    console.log('users: ');
    for (let elem in this.users)
      console.log(elem);
  }

  getResponseTimeMs(): number {
    return this.responseTimeMs;
  }

  getUser(id: string): Observable<User> {
    const url = `${this.usersUrl}/${id}`;

    if (!this.users[id]) {
      let sendDate = (new Date()).getTime();
      this.users[id] = this.http.get(url)
        .map(response => {
          let receiveDate = (new Date()).getTime();
          this.responseTimeMs = receiveDate - sendDate;
          return response.json() as User;
        })
        .publishLast().refCount();
    }
    return this.users[id];
  }

  cacheUser(id: string): void {
    const url = `${this.usersUrl}/${id}`;

    let sendDate = (new Date()).getTime();
    this.http.get(url)
      .map(response => {
        let receiveDate = (new Date()).getTime();
        this.responseTimeMs = receiveDate - sendDate;
        let user = response.json() as User;
        this.users[id] = new Observable<User>(obs => obs.next(user));
      })
      .publishLast().connect(); // connect(): immediately fetch
  }

  update(user: User): Observable<User> {
    const url = `${this.usersUrl}/${user.id}`;
    return this.http
      .put(url, JSON.stringify(user), { headers: this.headers })
      .map(() => user)
      .take(1);
  }

  create(user: User): Observable<User> {
    return this.http
      .post(this.usersUrl, JSON.stringify(user), { headers: this.headers })
      .map(res => res.json() as User)
      .take(1);
  }

  delete(id: number): Observable<void> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
