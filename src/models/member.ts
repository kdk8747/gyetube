import { DecisionListElement, RoleListElement } from './'

export class MemberListElement {
  constructor(
    public member_id: number,
    public member_log_id: number,
    public member_state: string,
    public modified_datetime: string,
    public image_url: string,
    public name: string,
    public roles: string[],
    public parent_decision_id: number
  ) { }
}

export class MemberMyselfElement {
  constructor(
    public member_id: number,
    public member_log_id: number,
    public member_state: string,
    public modified_datetime: string,
    public image_url: string,
    public name: string,
    public role: RoleListElement,
    public parent_decision_id: number
  ) { }
}

export class MemberDetailElement {
  constructor(
    public member_id: number,
    public member_log_id: number,
    public prev_id: number,
    public next_id: number,
    public member_state: string,
    public creator: MemberListElement,
    public created_datetime: string,
    public image_url: string,
    public name: string,
    public parent_decision: DecisionListElement,
    public roles: RoleListElement[]
  ) { }
}

export class MemberEditorElement {
  constructor(
    public member_id: number, // 0: unused
    public name: string,
    public parent_decision_id: number,
    public role_ids: number[]
  ) { }
}
