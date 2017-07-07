export class Activity {
  constructor(
    public id: number,
    public modifiedDate: Date,
    public activityDate: Date,
    public content: string,
    public parentPolicy: number,
    public childReceipts: number[]
  ) { }
}