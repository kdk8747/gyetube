export class Policy {
  constructor(
    public id: number,
    public prevId: number,
    public expiryDate: Date,
    public content: string,
    public parentProceeding: number,
    public childActivities: number[]) { }
}