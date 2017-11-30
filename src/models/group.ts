export class Group {
  constructor(
    public id: number,
    public urlSegment: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public createdDate: string
  ) { }
}
