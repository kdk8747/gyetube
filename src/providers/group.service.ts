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

  constructor(
    public http: AuthHttp
  ) { }

  getGroups(): Observable<Group[]> {
    return this.http.get(this.groupsUrl)
      .map(response => response.json() as Group[])
      .take(1);
  }

  getGroup(id: number): Observable<Group> {
    const url = `${this.groupsUrl}/${id}`;

    return this.http.get(url)
      .map(response => response.json() as Group)
      .publishLast().refCount();
  }

  getGroupId(url_segment: string): Promise<number> {
    const url = `/api/v1.0/group-id/${url_segment}`;

    return this.http.get(url)
      .map(response => response.json().group_id as number)
      .toPromise();
  }

  update(group: Group): Observable<Group> {
    const url = `${this.groupsUrl}/${group.group_id}`;
    return this.http
      .put(url, JSON.stringify(group), { headers: this.headers })
      .map(() => group)
      .take(1);
  }

  create(group: Group): Observable<Group> {
    return this.http
      .post(this.groupsUrl, JSON.stringify(group), { headers: this.headers })
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
