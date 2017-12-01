import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Group } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class GroupService {
  private groupsUrl = '/api/v1.0/groups';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  private groups = {};

  constructor(
    public http: AuthHttp
  ) { }

  print() {
    console.log('groups: ');
    for (let elem in this.groups)
      console.log(elem);
  }

  getGroups(): Observable<Group[]> {
    return this.http.get(this.groupsUrl)
      .map(response => response.json() as Group[])
      .take(1);
  }

  getGroup(id: number): Observable<Group> {
    const url = `${this.groupsUrl}/${id}`;

    if (!this.groups[id])
      this.groups[id] = this.http.get(url)
        .map(response => response.json() as Group)
        .publishLast().refCount();
    return this.groups[id];
  }

  getGroupId(url_segment: string): Promise<number> {
    const url = `/api/v1.0/groupId/${url_segment}`;

    return this.http.get(url)
      .map(response => response.json() as number)
      .toPromise();
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
      .post(this.groupsUrl, JSON.stringify(user), { headers: this.headers })
      .map(response => response.json() as Group)
      .take(1);
  }

  delete(id: number): Observable<void> {
    const url = `${this.groupsUrl}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
