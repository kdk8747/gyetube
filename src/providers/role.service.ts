import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Role } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class RoleService {
  private rolesUrl = '/api/v1.0/roles';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });


  constructor(
    public http: AuthHttp
  ) { }

  getRoles(group_id: number): Observable<Role[]> {
    const url = `${this.rolesUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => response.json() as Role[])
      .take(1);
  }

  getRole(group_id: number, id: number): Observable<Role> {
    const url = `${this.rolesUrl}/${group_id}/${id}`;
    return this.http.get(url)
      .map(response => response.json() as Role)
      .take(1);
  }

  update(group_id: number, role: Role): Observable<Role> {
    const url = `${this.rolesUrl}/${group_id}/${role.id}`;
    return this.http
      .put(url, JSON.stringify(role), { headers: this.headers })
      .map(() => role)
      .take(1);
  }
}
