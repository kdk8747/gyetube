import { Component, Input } from '@angular/core';
import { Activity } from '../_models';

@Component({
    selector: 'activity',
    template: `
        <div class="activity">
            <span>modifiedDate: {{activity.modifiedDate | date:'y-MM-dd'}}</span>
            <span>activityDate: {{activity.activityDate | date:'y-MM-dd'}}</span>
            <span>content: {{activity.content}}</span>
            <span>imageUrls: {{activity.imageUrls}}</span>
            <span>documentUrls: {{activity.documentUrls}}</span>
        </div>
    `,
    styles: [`
        div {
            border: 1px solid #000000;
            text-align: center;
        }
    `]
})

export class ActivityComponent{
    @Input() activity: Activity;
}