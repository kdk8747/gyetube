import { Injectable } from '@angular/core';

import { Policy } from '../_models';


@Injectable()
export class PolicyChangesetService {
    isActivated: boolean = false;
    policies: Policy[] = [];
}