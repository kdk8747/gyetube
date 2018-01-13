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
  private rolesUrl = '/api/v1.0/groups';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });


  constructor(
    public http: AuthHttp
  ) { }

  getRoles(group_id: number): Observable<RoleListElement[]> {
    const url = `${this.rolesUrl}/${group_id}/roles`;
    return this.http.get(url)
      .map(response => {
        let roles = response.json() as RoleListElement[];
        return roles.map(role => {
          role.modified_datetime = role.modified_datetime.replace(' ','T') + 'Z'; //https://github.com/sidorares/node-mysql2/issues/262  // If this issue is closed, remove this workaround and add timezone=Z to JAWSDB_MARIA_URL
          return role;
        });
      })
      .take(1);
  }

  getRole(group_id: number, id: number): Observable<RoleDetailElement> {
    const url = `${this.rolesUrl}/${group_id}/roles/${id}`;
    return this.http.get(url)
      .map(response => {
        let role = response.json() as RoleDetailElement;
        role.modified_datetime = role.modified_datetime.replace(' ','T') + 'Z'; //https://github.com/sidorares/node-mysql2/issues/262  // If this issue is closed, remove this workaround and add timezone=Z to JAWSDB_MARIA_URL
        return role;
      })
      .take(1);
  }

  update(group_id: number, role: RoleDetailElement): Observable<RoleDetailElement> {
    const url = `${this.rolesUrl}/${group_id}/roles/${role.role_id}`;
    return this.http
      .put(url, JSON.stringify(role), { headers: this.headers })
      .map(() => role)
      .take(1);
  }

  create(group_id: number, role: RoleEditorElement): Observable<RoleListElement> {
    const url = `${this.rolesUrl}/${group_id}/roles`;
    return this.http
      .post(url, JSON.stringify(role), { headers: this.headers })
      .map(response => {
        let res = response.json() as RoleListElement;
        return new RoleListElement(res.role_id, res.role_log_id, res.document_state, res.creator_id, new Date().toISOString(),
          role.name, role.home, role.member, role.role, role.proceeding, role.decision, role.activity, role.receipt, role.parent_decision_id);
      })
      .take(1);
  }
}
