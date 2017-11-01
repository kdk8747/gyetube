export class Group {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public createdDate: string,
    public members: string[],
    public roles: Role[]
  ) { }
}

class Role {
  constructor(
    public id: string,
    public name: string,
    public proceedings: string,
    public decisions: string,
    public activities: string,
    public receipts: string
  ) { }
}
