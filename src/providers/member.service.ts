import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Member } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class MemberService {
  private membersUrl = '/api/v1.0/members';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  private members = {};
  private responseTimeMs: number = 0;

  constructor(
    public http: AuthHttp
  ) { }

  print() {
    console.log('members: ');
    for (let elem in this.members)
      console.log(elem);
  }

  getResponseTimeMs(): number {
    return this.responseTimeMs;
  }

  getMembers(group_id: number): Observable<Member[]> {
    const url = `${this.membersUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => response.json() as Member[])
      .take(1);
  }

  cacheMembers(group_id: number): void {
    const url = `${this.membersUrl}/${group_id}`;
    this.http.get(url)
      .map(response => {
        let members = response.json() as Member[];
        members.map(member => {
          this.members[group_id + '/' + member.id] = new Observable<Member>(obs => obs.next(member));
        });
      }).publishLast().connect(); // connect(): immediately fetch
  }

  getMember(group_id: number, id: number): Observable<Member> {
    const url = `${this.membersUrl}/${group_id}/${id}`;

    if (!this.members[group_id + '/' + id]){
      let sendDate = (new Date()).getTime();
      this.members[group_id + '/' + id] = this.http.get(url)
        .map(response => {
          let receiveDate = (new Date()).getTime();
          this.responseTimeMs = receiveDate - sendDate;
          return response.json() as Member;
        })
        .publishLast().refCount();
    }
    return this.members[group_id + '/' + id];
  }

  cacheMember(group_id: number, id: number): Observable<Member> {
    const url = `${this.membersUrl}/${group_id}/${id}`;
    let sendDate = (new Date()).getTime();
    return this.http.get(url)
      .map(response => {
        let receiveDate = (new Date()).getTime();
        this.responseTimeMs = receiveDate - sendDate;
        let member = response.json() as Member;
        this.members[group_id + '/' + member.id] = new Observable<Member>(obs => obs.next(member));
        return member;
      });
  }

  update(group_id: number, member: Member): Observable<Member> {
    const url = `${this.membersUrl}/${group_id}/${member.id}`;
    return this.http
      .put(url, JSON.stringify(member), { headers: this.headers })
      .map(() => member)
      .take(1);
  }
}
