import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

import { Group } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GroupService {
  private groupsUrl = '/api/v1.0/groups';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: AuthHttp
  ) { }

  getGroups(): Observable<Group[]> {
    return this.http.get(this.groupsUrl)
    .map(response => {
      let groups = response.json() as Group[];
      return groups.map(group => {
        group.createdDate = new Date(group.createdDate);
        return group;
      })
    }).take(1);
  }

  getGroup(id: string): Observable<Group> {
    const url = `${this.groupsUrl}/${id}`;
    return this.http.get(url)
    .map(response => {
      let group = response.json() as Group;
      group.createdDate = new Date(group.createdDate);
      return group;
    }).take(1);
  }

  update(user: Group): Observable<Group> {
    const url = `${this.groupsUrl}/${user.id}`;
    return this.http
      .put(url, JSON.stringify(user), { headers: this.headers })
      .map(() => user)
      .take(1);
  }

  create(user: Group): Observable<Group> {
    return this.http
      .post(this.groupsUrl, JSON.stringify(user),{ headers: this.headers })
      .map(response => {
        let group = response.json() as Group;
        group.createdDate = new Date(group.createdDate);
        return group;
      }).take(1);
  }

  delete(id: number): Observable<void> {
    const url = `${this.groupsUrl}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
