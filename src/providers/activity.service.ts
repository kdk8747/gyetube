import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ActivityListElement, ActivityDetailElement, ActivityEditorElement } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class ActivityService {
  private activitiesUrl = '/api/v1.0/groups';  // URL to web api
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

  getActivities(group_id: number): Observable<ActivityListElement[]> {
    const url = `${this.activitiesUrl}/${group_id}/activities`;
    return this.http.get(url)
      .map(response => {
        let activities = response.json() as ActivityListElement[];
        return activities.map(activity => {
          activity.modified_datetime = this.convertTimestring(activity.modified_datetime);
          activity.activity_datetime = this.convertTimestring(activity.activity_datetime);
          return activity;
        });
      })
      .take(1);
  }

  getActivity(group_id: number, activity_id: number): Observable<ActivityDetailElement> {
    const url = `${this.activitiesUrl}/${group_id}/activities/${activity_id}`;

    return this.http.get(url)
      .map(response => {
        let activity = response.json() as ActivityDetailElement;
        activity.modified_datetime = this.convertTimestring(activity.modified_datetime);
        activity.activity_datetime = this.convertTimestring(activity.activity_datetime);
        return activity;
      })
      .take(1);
  }

  update(group_id: number, activity: ActivityEditorElement): Observable<ActivityEditorElement> {
    const url = `${this.activitiesUrl}/${group_id}/activities/${activity.activity_id}`;
    return this.http
      .put(url, JSON.stringify(activity), { headers: this.headers })
      .map(() => activity)
      .take(1);
  }

  create(group_id: number, activity: ActivityEditorElement): Observable<ActivityListElement> {
    const url = `${this.activitiesUrl}/${group_id}/activities`;
    return this.http
      .post(url, JSON.stringify(activity), { headers: this.headers })
      .map(response => {
        let res = response.json() as ActivityListElement;
        return new ActivityListElement(res.activity_id, new Date().toISOString(),
          activity.activity_datetime, activity.elapsed_time, activity.title, activity.description, activity.image_urls,
          activity.document_urls, activity.participant_ids.length, 0, 0);
      })
      .take(1);
  }

  delete(group_id: number, id: number): Observable<void> {
    const url = `${this.activitiesUrl}/${group_id}/activities/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
