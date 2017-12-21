import { DocumentState, VoterState } from '../app/constants';
import { DecisionListElement } from './'

export class MemberListElement {
  constructor(
    public member_id: number,
    public prev_id: number,
    public next_id: number,
    public document_state: DocumentState,
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
    public document_state: DocumentState,
    public creator: MemberListElement,
    public modified_datetime: string,
    public user_id: string,
    public image_url: string,
    public name: string,
    public parent_decision: DecisionListElement
  ) { }
}

export class Voter {
  constructor(
    public member_id: number,
    public prev_id: number,
    public next_id: number,
    public document_state: DocumentState,
    public voter_state: VoterState,
    public creator: number,
    public modified_datetime: string,
    public user_id: string,
    public image_url: string,
    public name: string,
    public parent_decision: DecisionListElement
  ) { }
}