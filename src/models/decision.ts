import { ProceedingListElement, ActivityListElement, ReceiptListElement, MemberListElement } from './';

export class DecisionListElement {
  constructor(
    public decision_id: number,
    public prev_id: number, // 0: unused
    public next_id: number, // 0: unused
    public document_state: string,
    public meeting_datetime: string,  // equals to parentProceeding.meetingDate
    public expiry_datetime: string,
    public title: string,
    public description: string,

    public abstainers_count: number,
    public accepters_count: number,
    public rejecters_count: number,
    public child_activities_count: number,
    public child_receipts_count: number,

    public total_elapsed_time: number,  // TODO
    public total_difference: number    // TODO
  ) { }
}

export class DecisionDetailElement {
  constructor(
    public decision_id: number,
    public prev_id: number, // 0: unused
    public next_id: number, // 0: unused
    public document_state: string,
    public meeting_datetime: string,  // equals to parentProceeding.meetingDate
    public expiry_datetime: string,
    public title: string,
    public description: string,

    public abstainers: MemberListElement[],
    public accepters: MemberListElement[],
    public rejecters: MemberListElement[],
    public parent_proceeding: ProceedingListElement,
    public child_activities: ActivityListElement[],
    public child_receipts: ReceiptListElement[],

    public total_elapsedTime: number,  // TODO
    public total_difference: number    // TODO
  ) { }
}

export class DecisionEditorElement {
  constructor(
    public prev_id: number, // 0: unused
    public expiry_datetime: string,
    public title: string,
    public description: string,

    public abstainers: MemberListElement[],
    public accepters: MemberListElement[],
    public rejecters: MemberListElement[],
  ) { }
}

export class DecisionNewElement {
  constructor(
    public prev_id: number, // 0: unused
    public expiry_datetime: string,
    public title: string,
    public description: string,

    public abstainer_ids: number[],
    public accepter_ids: number[],
    public rejecter_ids: number[]
  ) { }
}
