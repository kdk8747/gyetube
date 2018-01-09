import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { MemberListElement, MemberDetailElement, MemberEditorElement } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class MemberService {
  private membersUrl = '/api/v1.0/members';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: AuthHttp
  ) { }

  getMembers(group_id: number): Observable<MemberListElement[]> {
    const url = `${this.membersUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => {
        let members = response.json() as MemberListElement[];
        return members.map(member => {
          member.created_datetime = member.created_datetime.replace(' ','T') + 'Z'; //https://github.com/sidorares/node-mysql2/issues/262  // If this issue is closed, remove this workaround and add timezone=Z to JAWSDB_MARIA_URL
          return member;
        });
      })
      .take(1);
  }

  getMember(group_id: number, member_id: number): Observable<MemberDetailElement> {
    const url = `${this.membersUrl}/${group_id}/${member_id}`;

    return this.http.get(url)
      .map(response => {
        let member = response.json() as MemberDetailElement;
        member.created_datetime = member.created_datetime.replace(' ','T') + 'Z'; //https://github.com/sidorares/node-mysql2/issues/262  // If this issue is closed, remove this workaround and add timezone=Z to JAWSDB_MARIA_URL
        return member;
      })
      .take(1);
  }

  approveNewMember(group_id: number, member_id: number): Observable<void> {
    const url = `${this.membersUrl}/${group_id}/${member_id}/approve-new-member`;
    return this.http
      .put(url, '', { headers: this.headers })
      .map(() => null)
      .take(1);
  }
  approveOverwrite(group_id: number, member_id: number, prev_id: number): Observable<void> {
    const url = `${this.membersUrl}/${group_id}/${member_id}/approve-overwrite/${prev_id}`;
    return this.http
      .put(url, '', { headers: this.headers })
      .map(() => null)
      .take(1);
  }
  reject(group_id: number, member_id: number): Observable<void> {
    const url = `${this.membersUrl}/${group_id}/${member_id}/reject`;
    return this.http
      .put(url, '', { headers: this.headers })
      .map(() => null)
      .take(1);
  }

  create(group_id: number, member: MemberEditorElement): Observable<void> {
    const url = `${this.membersUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(member), { headers: this.headers })
      .map(() => null)
      .take(1);
  }

  registerMember(group_id: number): Observable<void> {
    const url = `${this.membersUrl}/${group_id}/register`;
    return this.http
      .post(url, '', { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
