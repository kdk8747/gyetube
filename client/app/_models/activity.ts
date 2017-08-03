export class Activity {
  constructor(
    public id: number,
    public modifiedDate: Date,
    public activityDate: Date,
    public content: string,
    public imageUrls: string[],
    public documentUrls: string[],
    public parentDecision: number,
    public childReceipts: number[]
  ) { }
}