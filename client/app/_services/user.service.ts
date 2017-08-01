import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../_models';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class UserService {
  private usersUrl = 'api/v1.0/suwongreenparty/users';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthenticationService
  ) { }

  getUsers(): Promise<User[]> {
    return this.http.get(this.usersUrl, this.auth.addJwt())
      .toPromise()
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  getUser(id: number): Promise<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get(url, this.auth.addJwt())
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);

  }

  update(user: User): Promise<User> {
    const url = `${this.usersUrl}/${user.id}`;
    return this.http
      .put(url, JSON.stringify(user), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(() => user)
      .catch(this.handleError);
  }

  create(user: User): Promise<User> {
    return this.http
      .post(this.usersUrl, JSON.stringify(user), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(res => res.json() as User)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete(url, this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    if (error.status == 401)
      window.location.href = 'login';
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}