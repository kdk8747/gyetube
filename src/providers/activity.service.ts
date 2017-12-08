import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ActivityListElement, ActivityDetailElement } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class ActivityService {
  private activitiesUrl = '/api/v1.0/activities';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: AuthHttp
  ) { }

  getActivities(group_id: number): Observable<ActivityListElement[]> {
    const url = `${this.activitiesUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => response.json() as ActivityListElement[])
      .take(1);
  }

  getActivity(group_id: number, activity_id: number): Observable<ActivityDetailElement> {
    const url = `${this.activitiesUrl}/${group_id}/${activity_id}`;

    return this.http.get(url)
      .map(response => response.json() as ActivityDetailElement)
      .take(1);
  }

  update(group_id: number, activity: ActivityDetailElement): Observable<ActivityDetailElement> {
    const url = `${this.activitiesUrl}/${group_id}/${activity.activity_id}`;
    return this.http
      .put(url, JSON.stringify(activity), { headers: this.headers })
      .map(() => activity)
      .take(1);
  }

  create(group_id: number, activity: ActivityDetailElement): Observable<ActivityDetailElement> {
    const url = `${this.activitiesUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(activity), { headers: this.headers })
      .map(response => response.json() as ActivityDetailElement)
      .take(1);
  }

  delete(group_id: number, id: number): Observable<void> {
    const url = `${this.activitiesUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
