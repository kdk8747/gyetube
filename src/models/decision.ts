import { State } from '../app/constants';

export class Decision {
  constructor(
    public id: number,
    public prevId: number, // 0: unused
    public state: State,
    public createdDate: Date,
    public expiryDate: Date,
    public content: string,
    public parentProceeding: number,
    public childActivities: number[]) { }
}