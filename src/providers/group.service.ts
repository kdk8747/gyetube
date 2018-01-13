import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Group, GroupEditorElement } from '../models';
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

   //https://github.com/sidorares/node-mysql2/issues/262  // If this issue is closed, remove this workaround and add timezone=Z to JAWSDB_MARIA_URL
  convertTimestring(str: string) {
    if (str.length == 19)
      return str.replace(' ','T') + 'Z';
    else if (str.length == 10)
      return str + 'T00:00:00Z';
    else
      return new Date().toISOString();
  }

  getGroups(): Observable<Group[]> {
    return this.http.get(this.groupsUrl)
      .map(response => {
        let groups = response.json() as Group[];
        return groups.map(group => {
          group.created_datetime = this.convertTimestring(group.created_datetime);
          return group;
        });
      })
      .take(1);
  }

  getGroup(id: number): Observable<Group> {
    const url = `${this.groupsUrl}/${id}`;

    return this.http.get(url)
      .map(response => {
        let group = response.json() as Group;
        group.created_datetime = this.convertTimestring(group.created_datetime);
        return group;
      })
      .take(1);
  }

  getGroupByUrlSegment(url_segment: string): Observable<Group> {
    const url = `${this.groupsUrl}/${url_segment}`;

    return this.http.get(url)
      .map(response => {
        let group = response.json() as Group;
        group.created_datetime = this.convertTimestring(group.created_datetime);
        return group;
      })
      .take(1);
  }

  getGroupId(url_segment: string): Observable<number> {
    const url = `${this.groupsUrl}/${url_segment}/id`;

    return this.http.get(url)
      .map(response => response.json() as number)
      .take(1);
  }

  create(group: GroupEditorElement): Observable<Group> {
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
