import { DecisionListElement, MemberListElement } from './'

export class RoleListElement {
  constructor(
    public role_id: number,
    public role_log_id: number,
    public document_state: string,
    public creator_id: number,
    public modified_datetime: string,
    public name: string,
    public home: string[],
    public member: string[],
    public role: string[],
    public proceeding: string[],
    public decision: string[],
    public activity: string[],
    public receipt: string[],
    public parent_decision_id: number
  ) { }
}

export class RoleDetailElement {
  constructor(
    public role_id: number,
    public role_log_id: number,
    public prev_id: number,
    public next_id: number,
    public document_state: string,
    public creator: MemberListElement,
    public modified_datetime: string,
    public name: string,
    public home: string[],
    public member: string[],
    public role: string[],
    public proceeding: string[],
    public decision: string[],
    public activity: string[],
    public receipt: string[],
    public parent_decision: DecisionListElement
  ) { }
}

export class RoleEditorElement {
  constructor(
    public role_id: number,
    public name: string,
    public home: string[],
    public member: string[],
    public role: string[],
    public proceeding: string[],
    public decision: string[],
    public activity: string[],
    public receipt: string[],
    public parent_decision_id: number
  ) { }
}
