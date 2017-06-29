import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../_models';

@Injectable()
export class UserService {
  private usersUrl = 'api/users';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  getUsers(): Promise<User[]> {
    return this.http.get(this.usersUrl)
      .toPromise()
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  getUser(id: number): Promise<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);

  }

  update(hero: User): Promise<User> {
    const url = `${this.usersUrl}/${hero.id}`;
    return this.http
      .put(url, JSON.stringify(hero), { headers: this.headers })
      .toPromise()
      .then(() => hero)
      .catch(this.handleError);
  }

  create(name: string): Promise<User> {
    return this.http
      .post(this.usersUrl, JSON.stringify({ name: name }), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as User)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}