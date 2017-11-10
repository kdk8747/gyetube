import { State } from '../app/constants';

export class Decision {
  constructor(
    public id: number,
    public prevId: number, // 0: unused
    public state: State,
    public meetingDate: string,  // equals to parentProceeding.meetingDate
    public expiryDate: string,
    public abstainers: string[],
    public accepters: string[],
    public rejecters: string[],
    public title: string,
    public description: string,
    public parentProceeding: number,
    public childActivities: number[],
    public childReceipts: number[],
    public totalElapsedTime: number,  // TODO
    public totalDifference: number    // TODO
  ) { }
}
