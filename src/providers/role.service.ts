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

  private roles = {};
  private responseTimeMs: number = 0;

  constructor(
    public http: AuthHttp
  ) { }

  print() {
    console.log('roles: ');
    for (let elem in this.roles)
      console.log(elem);
  }

  getResponseTimeMs(): number {
    return this.responseTimeMs;
  }

  getRoles(group_id: number): Observable<Role[]> {
    const url = `${this.rolesUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => response.json() as Role[])
      .take(1);
  }

  cacheRoles(group_id: number): void {
    const url = `${this.rolesUrl}/${group_id}`;
    this.http.get(url)
      .map(response => {
        let roles = response.json() as Role[];
        roles.map(role => {
          this.roles[group_id + '/' + role.id] = new Observable<Role>(obs => obs.next(role));
        });
      }).publishLast().connect(); // connect(): immediately fetch
  }

  getRole(group_id: number, id: number): Observable<Role> {
    const url = `${this.rolesUrl}/${group_id}/${id}`;

    if (!this.roles[group_id + '/' + id]){
      let sendDate = (new Date()).getTime();
      this.roles[group_id + '/' + id] = this.http.get(url)
        .map(response => {
          let receiveDate = (new Date()).getTime();
          this.responseTimeMs = receiveDate - sendDate;
          return response.json() as Role;
        })
        .publishLast().refCount();
    }
    return this.roles[group_id + '/' + id];
  }

  cacheRole(group_id: number, id: number): Observable<Role> {
    const url = `${this.rolesUrl}/${group_id}/${id}`;
    let sendDate = (new Date()).getTime();
    return this.http.get(url)
      .map(response => {
        let receiveDate = (new Date()).getTime();
        this.responseTimeMs = receiveDate - sendDate;
        let role = response.json() as Role;
        this.roles[group_id + '/' + role.id] = new Observable<Role>(obs => obs.next(role));
        return role;
      });
  }

  update(group_id: number, role: Role): Observable<Role> {
    const url = `${this.rolesUrl}/${group_id}/${role.id}`;
    return this.http
      .put(url, JSON.stringify(role), { headers: this.headers })
      .map(() => role)
      .take(1);
  }
}
