import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Activity } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class ActivityService {
  private activitiesUrl = '/api/v1.0/activities';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  private activities = {};

  constructor(
    public http: AuthHttp
  ) { }

  print() {
    console.log('activities: ');
    for (let elem in this.activities)
      console.log(elem);
  }

  getActivities(group_id: number): Observable<Activity[]> {
    const url = `${this.activitiesUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => response.json() as Activity[])
      .take(1);
  }

  cacheActivities(group_id: number): void {
    const url = `${this.activitiesUrl}/${group_id}`;
    this.http.get(url)
      .map(response => {
        let activities = response.json() as Activity[];
        activities.map(activity => {
          this.activities[group_id + '/' + activity.id] = new Observable<Activity>(obs => obs.next(activity));
        });
      }).publishLast().connect(); // connect(): immediately fetch
  }

  getActivity(group_id: number, id: number): Observable<Activity> {
    const url = `${this.activitiesUrl}/${group_id}/${id}`;

    if (!this.activities[group_id + '/' + id])
      this.activities[group_id + '/' + id] = this.http.get(url)
        .map(response => response.json() as Activity)
        .publishLast().refCount();
    return this.activities[group_id + '/' + id];
  }

  update(group_id: number, activity: Activity): Observable<Activity> {
    const url = `${this.activitiesUrl}/${group_id}/${activity.id}`;
    return this.http
      .put(url, JSON.stringify(activity), { headers: this.headers })
      .map(() => activity)
      .take(1);
  }

  create(group_id: number, activity: Activity): Observable<Activity> {
    const url = `${this.activitiesUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(activity), { headers: this.headers })
      .map(response => response.json() as Activity)
      .take(1);
  }

  delete(group_id: number, id: number): Observable<void> {
    const url = `${this.activitiesUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
