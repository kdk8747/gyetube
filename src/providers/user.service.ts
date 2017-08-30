import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../models';
import { HttpWrapperService } from './http-wrapper.service';

@Injectable()
export class UserService {
  private usersUrl = '/api/v1.0/users';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: HttpWrapperService
  ) { }

  getUsers(): Promise<User[]> {
    return this.http.get(this.usersUrl)
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  getUser(id: string): Promise<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get(url)
      .then(response => response.json() as User)
      .catch(this.handleError);

  }

  update(user: User): Promise<User> {
    const url = `${this.usersUrl}/${user.id}`;
    return this.http
      .put(url, JSON.stringify(user), { headers: this.headers })
      .then(() => user)
      .catch(this.handleError);
  }

  create(user: User): Promise<User> {
    return this.http
      .post(this.usersUrl, JSON.stringify(user),{ headers: this.headers })
      .then(res => res.json() as User)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
