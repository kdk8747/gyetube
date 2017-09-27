import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Activity } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';


@Injectable()
export class ActivityService {
  private activitiesUrl = '/api/v1.0/activities';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: AuthHttp
  ) { }

  getActivities(group_id: string): Observable<Activity[]> {
    const url = `${this.activitiesUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => {
        let activities = response.json() as Activity[];
        return activities.map(activity => {
          activity.modifiedDate = new Date(activity.modifiedDate);
          activity.activityDate = new Date(activity.activityDate);
          return activity;
        })
      }).take(1);
  }

  getActivity(group_id: string, id: number): Observable<Activity> {
    const url = `${this.activitiesUrl}/${group_id}/${id}`;
    return this.http.get(url)
      .map(response => {
        let activity = response.json() as Activity;
        activity.modifiedDate = new Date(activity.modifiedDate);
        activity.activityDate = new Date(activity.activityDate);
        return activity;
      }).take(1);

  }

  update(group_id: string, activity: Activity): Observable<Activity> {
    const url = `${this.activitiesUrl}/${group_id}/${activity.id}`;
    return this.http
      .put(url, JSON.stringify(activity), { headers: this.headers })
      .map(() => activity)
      .take(1);
  }

  create(group_id: string, activity: Activity): Observable<Activity> {
    const url = `${this.activitiesUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(activity), { headers: this.headers })
      .map(response => {
        let activity = response.json() as Activity;
        activity.modifiedDate = new Date(activity.modifiedDate);
        activity.activityDate = new Date(activity.activityDate);
        return activity;
      })
      .take(1);
  }

  delete(group_id: string, id: number): Observable<void> {
    const url = `${this.activitiesUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
