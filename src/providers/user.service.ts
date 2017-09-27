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

  constructor(
    private http: AuthHttp
  ) { }

  getUsers(): Observable<User[]> {
    return this.http.get(this.usersUrl)
      .map(response => response.json() as User[])
      .take(1);
  }

  getUser(id: string): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get(url)
      .map(response => response.json() as User)
      .take(1);

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
      .post(this.usersUrl, JSON.stringify(user),{ headers: this.headers })
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
