export class User {
  constructor(
    public id: number,
    public name: string,
    public imageUrl: string,
    public login: string,
    public permissions: JSON
  ) { }
}