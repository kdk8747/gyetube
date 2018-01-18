import { MemberListElement, DecisionListElement, ReceiptListElement } from './'

export class ActivityListElement {
  constructor(
    public activity_id: number,
    public modified_datetime: string,
    public activity_datetime: string,
    public elapsed_time: number,
    public title: string,
    public description: string,
    public image_urls: string[],
    public document_urls: string[],

    public participants_count: number,
    public parent_decision_id: number,
    public child_receipts_count: number,

    public total_difference: number
  ) { }
}

export class ActivityDetailElement {
  constructor(
    public activity_id: number,
    public modified_datetime: string,
    public activity_datetime: string,
    public creator: MemberListElement,
    public elapsed_time: number,
    public title: string,
    public description: string,
    public image_urls: string[],
    public document_urls: string[],

    public participants: MemberListElement[],
    public parent_decision: DecisionListElement,
    public child_receipts: ReceiptListElement[],

    public total_difference: number
  ) { }
}

export class ActivityEditorElement {
  constructor(
    public activity_id: number,
    public activity_datetime: string,
    public elapsed_time: number,
    public title: string,
    public description: string,
    public image_urls: string[],
    public document_urls: string[],

    public participant_ids: number[],

    public parent_decision_id: number
  ) { }
}
