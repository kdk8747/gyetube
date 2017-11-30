import { State } from '../app/constants';

export class Member {
  constructor(
    public id: number,
    public prevId: number,
    public nextId: number,
    public state: State,
    public creator: number,
    public modifiedDate: string,
    public imageUrl: string,
    public name: string,
    public parentDecision: number
  ) { }
}
