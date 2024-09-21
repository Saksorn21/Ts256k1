import { decodeHex, remove0x, bytesToHex, bytesToBase64, base64ToBytes, hexToBytes, utf8ToBytes, bytesToUtf8 , bytesToAscii, asciiToBytes, bytesToLatin1, latin1ToBytes, bytesToUcs2, ucs2ToBytes, normalizeToUint8Array ,abytes, isBytes, isString, } from "../src/utils/bytes";

describe("bytes", () => {
  const message = "Helloworld";
  const hello = new Uint8Array([72, 101, 108, 108, 111])
  const hex = "48656c6c6f776f726c64"
  it("utf8 test", () => {
    expect(bytesToUtf8(utf8ToBytes(message))).toBe(message);
    expect(utf8ToBytes(message)).toEqual(new Uint8Array(Buffer.from(message)));
    
  })
  it("hex test", () => {
  
      expect(bytesToHex(new Uint8Array(Buffer.from(message)))).toEqual(hex)
    expect(hexToBytes(hex)).toEqual(new Uint8Array(Buffer.from(message)));
    
  })
  it("base64 test", () => {
    expect(bytesToBase64(hello)).toEqual(bytesToBase64(hello))
    expect(base64ToBytes(bytesToBase64(hello))).toEqual(Buffer.from(hello));
  })
  it("ascii test", () => {
    expect(bytesToAscii(hello)).toEqual(bytesToAscii(hello))
    expect(asciiToBytes(bytesToAscii(hello))).toEqual(Buffer.from(hello));
  })
  it("latin1 test", () => {
    expect(bytesToLatin1(hello)).toEqual(bytesToLatin1(hello))
    expect(latin1ToBytes(bytesToLatin1(hello))).toEqual(Buffer.from(hello));
  })
  it("ucs2 test", () => {
    expect(bytesToUcs2(hello)).toEqual(bytesToUcs2(hello))
    expect(ucs2ToBytes(bytesToUcs2(hello))).toEqual(ucs2ToBytes(bytesToUcs2(hello)));
  })
  it("normalizeToUint8Array test", () => {
    expect(normalizeToUint8Array(hex)).toEqual(hexToBytes(hex))
    expect(normalizeToUint8Array(hello)).toEqual(hello)
  })
  it("abytes and isBytes and isString test", () => {
    expect(isBytes(hello)).toBe(true)
    expect(isBytes(message)).toBe(false)
    
  })
  describe('isBytes', () => {
    it('should return true for Uint8Array', () => {
      const result = isBytes(new Uint8Array([1, 2, 3]));
      expect(result).toBe(true);
    });

    it('should return true for Buffer', () => {
      const result = isBytes(Buffer.from([1, 2, 3]));
      expect(result).toBe(true);
    });

    it('should return false for other types (string)', () => {
      const result = isBytes('hello');
      expect(result).toBe(false);
    });

    it('should return false for null', () => {
      const result = isBytes(null);
      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      const result = isBytes(undefined);
      expect(result).toBe(false);
    });
  });
  describe('abytes', () => {
    it('should not throw an error for Uint8Array', () => {
      expect(() => abytes(new Uint8Array([1, 2, 3]))).not.toThrow();
    });

    it('should not throw an error for Buffer', () => {
      expect(() => abytes(Buffer.from([1, 2, 3]))).not.toThrow();
    });

    it('should throw a TypeError for a string', () => {
      expect(() => abytes('hello')).toThrow(TypeError);
      expect(() => abytes('hello')).toThrow('Expected Uint8Array or Buffer, got string');
    });

    it('should throw a TypeError for null', () => {
      expect(() => abytes(null)).toThrow(TypeError);
      expect(() => abytes({})).toThrow('Expected Uint8Array or Buffer, got object');
    });

    it('should throw a TypeError for undefined', () => {
      expect(() => abytes(undefined)).toThrow(TypeError);
      expect(() => abytes(undefined)).toThrow('Expected Uint8Array or Buffer, got undefined');
    });

    it('should treat object with constructor.name === "Uint8Array" as Uint8Array', () => {
      const mockUint8ArrayLike = {
        constructor: { name: 'Uint8Array' },
      };
      expect(isBytes(mockUint8ArrayLike)).toBe(true);
    });
  });
  describe('isString', () => {
    it('should not throw an error when the second argument is a string', () => {
      expect(() => isString('Title', 'hello')).not.toThrow();
    });

    it('should throw a TypeError when the second argument is not a string', () => {
      expect(() => isString('Title', 123)).toThrow(TypeError);
      expect(() => isString('Title', 123)).toThrow('Title string expected, got number');
    });

    it('should throw a TypeError when the second argument is null', () => {
      expect(() => isString('Title', null)).toThrow(TypeError);
      expect(() => isString('Title', null)).toThrow('Title string expected, got object');
    });

    it('should throw a TypeError when the second argument is undefined', () => {
      expect(() => isString('Title', undefined)).toThrow(TypeError);
      expect(() => isString('Title', undefined)).toThrow('Title string expected, got undefined');
    });
  });
  })
  


describe("test hex", () => {
  it("removes 0x", () => {
    
    expect(remove0x("0256")).toBe("0256");
    expect(remove0x("0022")).toBe("0022");
    expect(remove0x("0x0011")).toBe("0011");
    expect(remove0x("0X0022")).toBe("0022");
  });

  it("converts hex to buffer", () => {
    expect(decodeHex("0x0011")).toEqual(Uint8Array.from([0, 0x11]));
    expect(decodeHex("0X0022")).toEqual(Uint8Array.from([0, 0x22]));
  });
});