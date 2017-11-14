import { State } from '../app/constants';
import { Decision } from './decision'

export class Proceeding {
  constructor(
    public id: number,
    public prevId: number, // 0: unused
    public nextId: number, // 0: unused
    public state: State,
    public createdDate: string,
    public meetingDate: string,
    public attendees: string[],
    public reviewers: string[],
    public title: string,
    public description: string,
    public childDecisions: number[]
  ) { }
}

export class ProceedingCreation {
  constructor(
    public id: number,
    public prevId: number, // 0: unused
    public nextId: number, // 0: unused
    public state: State,
    public createdDate: string,
    public meetingDate: string,
    public attendees: string[],
    public reviewers: string[],
    public title: string,
    public description: string,
    public childDecisions: Decision[]
  ) { }
}
