import { MemberListElement, DecisionListElement, ReceiptListElement } from './'

export class ActivityListElement {
  constructor(
    public activity_id: number,
    public modified_datetime: string,
    public activity_datetime: string,
    public title: string,
    public description: string,
    public image_urls: string[],
    public document_urls: string[],

    public child_receipts_count: number,

    public elapsedTime: number,
    public participants_count: number,
    public total_difference: number    // TODO
  ) { }
}

export class ActivityDetailElement {
  constructor(
    public activity_id: number,
    public modified_datetime: string,
    public activity_datetime: string,
    public creator: MemberListElement,
    public participants: MemberListElement[],
    public elapsed_time: number,
    public title: string,
    public description: string,
    public image_urls: string[],
    public document_urls: string[],

    public parent_decision: DecisionListElement,
    public child_receipts: ReceiptListElement[],
    public total_difference: number    // TODO
  ) { }
}
