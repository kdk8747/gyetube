import { DecisionListElement, MemberListElement } from './'

export class RoleListElement {
  constructor(
    public role_id: number,
    public prev_id: number,
    public next_id: number,
    public document_state: string,
    public creator_id: number,
    public modified_datetime: string,
    public name: string,
    public member: number,
    public role: number,
    public proceeding: number,
    public decision: number,
    public activity: number,
    public receipt: number,
    public parent_decision: number
  ) { }
}

export class RoleDetailElement {
  constructor(
    public role_id: number,
    public prev_id: number,
    public next_id: number,
    public document_state: string,
    public creator: MemberListElement,
    public modified_datetime: string,
    public name: string,
    public member: number,
    public role: number,
    public proceeding: number,
    public decision: number,
    public activity: number,
    public receipt: number,
    public parent_decision: DecisionListElement
  ) { }
}
