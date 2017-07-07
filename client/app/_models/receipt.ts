export class Receipt {
  constructor(
    public id: number,
    public modifiedDate: Date,
    public paymentDate: Date,
    public imageUrl: string,
    public parentActivity: number
  ) { }
}