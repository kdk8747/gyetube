export class Group {
  constructor(
    public group_id: number,
    public url_segment: string,
    public title: string,
    public description: string,
    public image_url: string,
    public created_datetime: string
  ) { }
}

export class GroupEditorElement {
  constructor(
    public url_segment: string,
    public title: string,
    public description: string
  ) { }
}
