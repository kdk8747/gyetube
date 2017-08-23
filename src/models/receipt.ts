export class Receipt {
  constructor(
    public id: number,
    public modifiedDate: Date,
    public paymentDate: Date,
    public memo: string,
    public difference: number,
    public imageUrl: string,    // 영수증 사진의 금액과 기록된 차액을 비교하는 작업이 편하려면 사진은 한장이어야 한다.
    public parentActivity: number
  ) { }
}