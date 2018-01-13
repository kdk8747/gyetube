import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { MemberListElement, MemberMyselfElement, MemberDetailElement, MemberEditorElement } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class MemberService {
  private membersUrl = '/api/v1.0/groups';  // URL to web api
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

  getMembers(group_id: number): Observable<MemberListElement[]> {
    const url = `${this.membersUrl}/${group_id}/members`;
    return this.http.get(url)
      .map(response => {
        let members = response.json() as MemberListElement[];
        return members.map(member => {
          member.modified_datetime = this.convertTimestring(member.modified_datetime);
          return member;
        });
      })
      .take(1);
  }

  getMemberLog(group_id: number, member_id: number, member_log_id: number): Observable<MemberDetailElement> {
    const url = `${this.membersUrl}/${group_id}/members/${member_id}/logs/${member_log_id}`;

    return this.http.get(url)
      .map(response => {
        let member = response.json() as MemberDetailElement;
        member.created_datetime = this.convertTimestring(member.created_datetime);
        return member;
      })
      .take(1);
  }

  getMember(group_id: number, member_id: number): Observable<MemberListElement> {
    const url = `${this.membersUrl}/${group_id}/members/${member_id}`;

    return this.http.get(url)
      .map(response => {
        let member = response.json() as MemberListElement;
        member.modified_datetime = this.convertTimestring(member.modified_datetime);
        return member;
      })
      .take(1);
  }

  getMemberMyself(group_id: number): Observable<MemberMyselfElement> {
    const url = `${this.membersUrl}/${group_id}/members/myself`;
    return this.http.get(url)
      .map(response => response.json() as MemberMyselfElement)
      .take(1);
  }

  approveNewMember(group_id: number, member_id: number): Observable<void> {
    const url = `${this.membersUrl}/${group_id}/members/${member_id}/approve-new-member`;
    return this.http
      .put(url, '', { headers: this.headers })
      .map(() => null)
      .take(1);
  }
  approveOverwrite(group_id: number, member_id: number, prev_id: number): Observable<void> {
    const url = `${this.membersUrl}/${group_id}/members/${member_id}/approve-overwrite/${prev_id}`;
    return this.http
      .put(url, '', { headers: this.headers })
      .map(() => null)
      .take(1);
  }
  reject(group_id: number, member_id: number): Observable<void> {
    const url = `${this.membersUrl}/${group_id}/members/${member_id}/reject`;
    return this.http
      .put(url, '', { headers: this.headers })
      .map(() => null)
      .take(1);
  }

  create(group_id: number, member: MemberEditorElement): Observable<MemberListElement> {
    const url = `${this.membersUrl}/${group_id}/members`;
    return this.http
      .post(url, JSON.stringify(member), { headers: this.headers })
      .map(response => {
        let res = response.json() as MemberListElement;
        return new MemberListElement(res.member_id, res.member_log_id, res.member_state, new Date().toISOString(), null,
          member.name, null, member.parent_decision_id);
      })
      .take(1);
  }

  registerMember(group_id: number): Observable<void> {
    const url = `${this.membersUrl}/${group_id}/members/register`;
    return this.http
      .post(url, '', { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
