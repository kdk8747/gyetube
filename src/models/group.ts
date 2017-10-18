export class Group {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public createdDate: string,
    public members: string[]
  ) { }
}
