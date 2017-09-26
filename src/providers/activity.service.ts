import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Activity } from '../models';
import { HttpWrapperService } from './http-wrapper.service';

@Injectable()
export class ActivityService {
  private activitiesUrl = '/api/v1.0/activities';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: HttpWrapperService
  ) { }

  getActivities(group_id: string): Promise<Activity[]> {
    const url = `${this.activitiesUrl}/${group_id}`;
    return this.http.get(url)
      .then(response => {
        let activities = response.json() as Activity[];
        return activities.map(activity => {
          activity.modifiedDate = new Date(activity.modifiedDate);
          activity.activityDate = new Date(activity.activityDate);
          return activity;
        })
      })
      .catch(this.handleError);
  }

  getActivity(group_id: string, id: number): Promise<Activity> {
    const url = `${this.activitiesUrl}/${group_id}/${id}`;
    return this.http.get(url)
      .then(response => {
        let activity = response.json() as Activity;
        activity.modifiedDate = new Date(activity.modifiedDate);
        activity.activityDate = new Date(activity.activityDate);
        return activity;
      })
      .catch(this.handleError);

  }

  update(group_id: string, activity: Activity): Promise<Activity> {
    const url = `${this.activitiesUrl}/${group_id}/${activity.id}`;
    return this.http
      .put(url, JSON.stringify(activity), { headers: this.headers })
      .then(() => activity)
      .catch(this.handleError);
  }

  create(group_id: string, activity: Activity): Promise<Activity> {
    const url = `${this.activitiesUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(activity), { headers: this.headers })
      .then(response => {
        let activity = response.json() as Activity;
        activity.modifiedDate = new Date(activity.modifiedDate);
        activity.activityDate = new Date(activity.activityDate);
        return activity;
      })
      .catch(this.handleError);
  }

  delete(group_id: string, id: number): Promise<void> {
    const url = `${this.activitiesUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
