
export class Role {
  constructor(
    public id: number,
    public prevId: number,
    public nextId: number,
    public document_state: string,
    public creator: number,
    public modifiedDate: string,
    public name: string,
    public member: number,
    public role: number,
    public proceeding: number,
    public decision: number,
    public activity: number,
    public receipt: number,
    public parentDecision: number
  ) { }
}
