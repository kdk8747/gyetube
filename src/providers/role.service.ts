import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { RoleListElement, RoleDetailElement, RoleEditorElement } from '../models';
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

  getRoles(group_id: number): Observable<RoleListElement[]> {
    const url = `${this.rolesUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => {
        let roles = response.json() as RoleListElement[];
        return roles.map(role => {
          role.created_datetime = role.created_datetime.replace(' ','T') + 'Z'; //https://github.com/sidorares/node-mysql2/issues/262  // If this issue is closed, remove this workaround and add timezone=Z to JAWSDB_MARIA_URL
          return role;
        });
      })
      .take(1);
  }

  getRole(group_id: number, id: number): Observable<RoleDetailElement> {
    const url = `${this.rolesUrl}/${group_id}/${id}`;
    return this.http.get(url)
      .map(response => {
        let role = response.json() as RoleDetailElement;
        role.created_datetime = role.created_datetime.replace(' ','T') + 'Z'; //https://github.com/sidorares/node-mysql2/issues/262  // If this issue is closed, remove this workaround and add timezone=Z to JAWSDB_MARIA_URL
        return role;
      })
      .take(1);
  }

  getRoleMyself(group_id: number): Observable<RoleDetailElement> {
    const url = `${this.rolesUrl}/${group_id}/myself`;
    return this.http.get(url)
      .map(response => response.json() as RoleDetailElement)
      .take(1);
  }

  update(group_id: number, role: RoleDetailElement): Observable<RoleDetailElement> {
    const url = `${this.rolesUrl}/${group_id}/${role.role_id}`;
    return this.http
      .put(url, JSON.stringify(role), { headers: this.headers })
      .map(() => role)
      .take(1);
  }

  create(group_id: number, role: RoleEditorElement): Observable<void> {
    const url = `${this.rolesUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(role), { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
