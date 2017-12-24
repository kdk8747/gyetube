import { DecisionListElement, DecisionNewElement, MemberListElement } from './'

export class ProceedingListElement {
  constructor(
    public proceeding_id: number,
    public prev_id: number, // 0: unused
    public next_id: number, // 0: unused
    public document_state: string,
    public created_datetime: string,
    public meeting_datetime: string,
    public title: string,
    public description: string,
    public attendees_count: number,
    public reviewers_count: number,
    public need_my_review: number,
    public child_decisions_count: number
  ) { }
}

export class ProceedingDetailElement {
  constructor(
    public proceeding_id: number,
    public prev_id: number, // 0: unused
    public next_id: number, // 0: unused
    public document_state: string,
    public created_datetime: string,
    public meeting_datetime: string,
    public title: string,
    public description: string,
    public attendees: MemberListElement[],
    public reviewers: MemberListElement[],
    public need_my_review: number,
    public child_decisions: DecisionListElement[]
  ) { }
}

export class ProceedingEditorElement {
  constructor(
    public prev_id: number, // 0: unused
    public created_datetime: string,
    public meeting_datetime: string,
    public title: string,
    public description: string,
    public attendee_ids: number[],
    public child_decisions: DecisionNewElement[]
  ) { }
}
