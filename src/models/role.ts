import { DecisionListElement, MemberListElement } from './'

export class RoleListElement {
  constructor(
    public role_id: number,
    public prev_id: number,
    public next_id: number,
    public document_state: string,
    public creator_id: number,
    public created_datetime: string,
    public name: string,
    public member: number,
    public role: number,
    public proceeding: number,
    public decision: number,
    public activity: number,
    public receipt: number,
    public parent_decision_id: number
  ) { }
}

export class RoleDetailElement {
  constructor(
    public role_id: number,
    public prev_id: number,
    public next_id: number,
    public document_state: string,
    public creator: MemberListElement,
    public created_datetime: string,
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

export class RoleEditorElement {
  constructor(
    public prev_id: number,
    public name: string,
    public member: number,
    public role: number,
    public proceeding: number,
    public decision: number,
    public activity: number,
    public receipt: number,
    public parent_decision_id: number
  ) { }
}
