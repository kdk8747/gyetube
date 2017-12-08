import { DocumentState } from '../app/constants';
import { DecisionListElement, MemberListElement } from './'

export class ProceedingListElement {
  constructor(
    public proceeding_id: number,
    public prev_id: number, // 0: unused
    public next_id: number, // 0: unused
    public document_state: DocumentState,
    public created_datetime: string,
    public meeting_datetime: string,
    public title: string,
    public description: string,
    public attendees_count: number,
    public reviewers_count: number,
    public child_decisions_count: number
  ) { }
}

export class ProceedingDetailElement {
  constructor(
    public proceeding_id: number,
    public prev_id: number, // 0: unused
    public next_id: number, // 0: unused
    public document_state: DocumentState,
    public created_datetime: string,
    public meeting_datetime: string,
    public title: string,
    public description: string,
    public attendees: MemberListElement[],
    public child_decisions: DecisionListElement[]
  ) { }
}
