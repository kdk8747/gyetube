import { DecisionListElement, RoleListElement } from './'

export class MemberListElement {
  constructor(
    public member_id: number,
    public prev_id: number,
    public next_id: number,
    public document_state: string,
    public modified_datetime: string,
    public user_id: string,
    public image_url: string,
    public name: string
  ) { }
}

export class MemberDetailElement {
  constructor(
    public member_id: number,
    public prev_id: number,
    public next_id: number,
    public document_state: string,
    public creator: MemberListElement,
    public modified_datetime: string,
    public user_id: string,
    public image_url: string,
    public name: string,
    public parent_decision: DecisionListElement,
    public roles: RoleListElement[]
  ) { }
}
