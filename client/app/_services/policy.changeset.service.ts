import { Injectable } from '@angular/core';

import { Policy } from '../_models';


@Injectable()
export class PolicyChangesetService {
    policies: Policy[] = [];
}