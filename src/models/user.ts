export class User {
  constructor(
    public id: string,
    public name: string,
    public imageUrl: string,
    public loggedInBy: string
    //public permissions: JSON
  ) { }
}
