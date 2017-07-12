export class Receipt {
  constructor(
    public id: number,
    public modifiedDate: Date,
    public paymentDate: Date,
    public memo: string,
    public difference: number,
    public imageUrl: string,
    public parentActivity: number
  ) { }
}