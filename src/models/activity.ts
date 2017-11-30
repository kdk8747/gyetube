export class Activity {
  constructor(
    public id: number,
    public modifiedDate: string,
    public activityDate: string,
    public creator: number,
    public participants: number[],
    public elapsedTime: number,
    public title: string,
    public description: string,
    public imageUrls: string[],
    public documentUrls: string[],
    public parentDecision: number,
    public childReceipts: number[],
    public totalDifference: number    // TODO
  ) { }
}
