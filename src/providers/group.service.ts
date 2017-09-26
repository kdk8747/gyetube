import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Group } from '../models';
import { HttpWrapperService } from './http-wrapper.service';

@Injectable()
export class GroupService {
  private groupsUrl = '/api/v1.0/groups';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: HttpWrapperService
  ) { }

  getGroups(): Promise<Group[]> {
    return this.http.get(this.groupsUrl)
      .then(response => response.json() as Group[])
      .catch(this.handleError);
  }

  getGroup(id: string): Promise<Group> {
    const url = `${this.groupsUrl}/${id}`;
    return this.http.get(url)
      .then(response => response.json() as Group)
      .catch(this.handleError);

  }

  update(user: Group): Promise<Group> {
    const url = `${this.groupsUrl}/${user.id}`;
    return this.http
      .put(url, JSON.stringify(user), { headers: this.headers })
      .then(() => user)
      .catch(this.handleError);
  }

  create(user: Group): Promise<Group> {
    return this.http
      .post(this.groupsUrl, JSON.stringify(user),{ headers: this.headers })
      .then(res => res.json() as Group)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.groupsUrl}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
