import { PrivateKey, PublicKey } from '../src/main'


describe("test random keys", () => {
  function testRandom() {
    const k1 = new PrivateKey();
    const k2 = new PrivateKey();
    expect(k1.multiply(k2.publicKey)).toStrictEqual(k2.multiply(k1.publicKey));

    const sk = new PrivateKey();
    const skFromHex = PrivateKey.fromHex(sk.secretToHex);
    const pkFromHex = PublicKey.fromHex(sk.publicKey.toHex(false));

    expect(skFromHex).toStrictEqual(sk);
    expect(pkFromHex).toStrictEqual(sk.publicKey);
  }
  it("tests randomkey", () => {
    testRandom();
  });
  })