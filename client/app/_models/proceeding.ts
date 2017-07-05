export class Proceeding {
  constructor(
    public id: number,
    public prevId: number, // 0: unused
    public createdDate: Date,
    public meetingDate: Date,
    public title: string,
    public content: string,
    public childPolicies: number[]) { }
}