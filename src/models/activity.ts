export class Activity {
  constructor(
    public id: number,
    public modifiedDate: string,
    public activityDate: string,
    public content: string,
    public imageUrls: string[],
    public documentUrls: string[],
    public parentDecision: number,
    public childReceipts: number[]
  ) { }
}
