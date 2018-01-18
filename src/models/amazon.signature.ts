export class AmazonSignature {
  constructor(
    public stringToSign: string,
    public signature: string,
    public keyPath: string,
    public credential: string,
    public MD5HashedPayload: string,
    public SHA256HashedPayload: string,
    public payload: string
  ) { }
}
