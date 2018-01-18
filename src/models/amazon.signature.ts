export class AmazonSignature {
  constructor(
    public stringToSign: string,
    public signature: string,
    public keyPath: string,
    public credential: string,
    public hashedPayload: string
  ) { }
}
