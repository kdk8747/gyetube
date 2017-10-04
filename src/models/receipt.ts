export class Receipt {
  constructor(
    public id: number,
    public modifiedDate: string,
    public paymentDate: string,
    public creator: string,
    public memo: string,
    public difference: number,
    public balance: number,     // always 0 at the server
    public imageUrl: string,    // 영수증 사진의 금액과 기록된 차액을 비교하는 작업이 편하려면 사진은 한장이어야 한다.
    public parentActivity: number
  ) { }
}
