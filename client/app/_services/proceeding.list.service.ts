import { Injectable } from '@angular/core';

import { Proceeding } from '../_models';
import { ProceedingService } from '../_services';
import { State } from '../constants';

@Injectable()
export class ProceedingListService {
    proceedings: Proceeding[];

    constructor(
        private proceedingService: ProceedingService
    ) { }

    init(): Promise<void> {
        return this.proceedingService.getProceedings().then(proceedings => { this.proceedings = proceedings; this.sortByDate(); });
    }

    get(): Proceeding[] {
        return this.proceedings;
    }

    sortByDate(): void {
        this.proceedings = this.proceedings.sort((h1, h2) => {
            return h1.meetingDate < h2.meetingDate ? 1 :
                (h1.meetingDate > h2.meetingDate ? -1 : 0);
        });
    }

    addProceeding(title: string, content: string): Promise<void> {
        title = title.trim();
        content = content.trim();
        if (!title || !content) { return Promise.resolve(); }
        return this.proceedingService.create(new Proceeding(0, 0, State.STATE_NEW_ONE, new Date(Date.now()), new Date(Date.now()), title, content, []))
            .then((proceeding: Proceeding) => {
                this.proceedings.push(proceeding);
                this.sortByDate();
            });
    }
}