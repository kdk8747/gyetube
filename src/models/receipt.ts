import { DecisionListElement, ActivityListElement, MemberListElement } from './'

export class ReceiptListElement {
  constructor(
    public receipt_id: number,
    public modified_datetime: string,
    public settlement_datetime: string,
    public title: string,
    public difference: number,
    public balance: number,     // always 0 at the server
    public image_url: string,    // 영수증 사진의 금액과 기록된 차액을 비교하는 작업이 편하려면 사진은 한장이어야 한다.
  ) { }
}

export class ReceiptDetailElement {
  constructor(
    public receipt_id: number,
    public modified_datetime: string,
    public settlement_datetime: string,
    public creator: MemberListElement,
    public title: string,
    public difference: number,
    public image_url: string,    // 영수증 사진의 금액과 기록된 차액을 비교하는 작업이 편하려면 사진은 한장이어야 한다.

    public parent_activity: ActivityListElement, // parent는 activity 또는
    public parent_decision: DecisionListElement  // decision 둘 중 하나만 가질 수 있다.
  ) { }
}

export class ReceiptEditorElement {
  constructor(
    public receipt_id: number,
    public modified_datetime: string,
    public settlement_datetime: string,
    public creator_id: number,
    public title: string,
    public difference: number,
    public image_url: string,    // 영수증 사진의 금액과 기록된 차액을 비교하는 작업이 편하려면 사진은 한장이어야 한다.

    public parent_activity_id: number, // parent는 activity 또는
    public parent_decision_id: number  // decision 둘 중 하나만 가질 수 있다.
  ) { }
}
