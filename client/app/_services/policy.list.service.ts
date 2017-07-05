import { Injectable } from '@angular/core';

import { Policy } from '../_models';
import { PolicyService } from '../_services';

@Injectable()
export class PolicyListService {
    policies: Policy[];

    constructor(
        private policyService: PolicyService
    ) { }

    init(): Promise<void> {
        return this.policyService.getPolicys().then(policies => { this.policies = policies; });
    }

    get(): Policy[] {
        return this.policies;
    }

    addPolicy(content: string, proceedingID: number): Promise<void> {
        content = content.trim();
        //let proceeding = this.proceedingListService.get().find(item => item.id === +proceedingID);
        if (!content /*|| !proceeding*/) { return Promise.resolve(); }
        return this.policyService.create(new Policy(0, 0, new Date(Date.now()), content, proceedingID, []))
            .then((policy: Policy) => {
                this.policies.push(policy);

                //proceeding.childPolicys.push(policy.id);
            });
    }
}