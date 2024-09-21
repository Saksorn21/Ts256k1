// ตัวอย่าง pseudocode สำหรับ Huffman Coding

class HuffmanNode {
  constructor(public char: string, public freq: number, public left?: HuffmanNode, public right?: HuffmanNode) {}
}

export function buildHuffmanTree(data: string): HuffmanNode {
  const freqMap = new Map<string, number>();

  // นับความถี่ของตัวอักษรแต่ละตัว
  for (const char of data) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }

  // สร้าง priority queue สำหรับ node
  const nodes = Array.from(freqMap.entries()).map(([char, freq]) => new HuffmanNode(char, freq));
  while (nodes.length > 1) {
    // จัดเรียงตามความถี่ต่ำไปสูง
    nodes.sort((a, b) => a.freq - b.freq);

    // นำ node ที่มีความถี่ต่ำสุด 2 ตัวมารวมกันเป็น parent node
    const left = nodes.shift();
    const right = nodes.shift();
    const parent = new HuffmanNode('', left.freq + right.freq, left, right);

    // นำ parent node กลับไปยัง queue
    nodes.push(parent);
  }

  // คืนค่ารากของต้นไม้
  return nodes[0];
}

// ฟังก์ชันสร้างตารางเข้ารหัสจาก Huffman Tree
export function buildHuffmanCode(node: HuffmanNode, code = '', codeMap = new Map<string, string>()): Map<string, string> {
  if (!node.left && !node.right) {
    codeMap.set(node.char, code);
  } else {
    if (node.left) buildHuffmanCode(node.left, code + '0', codeMap);
    if (node.right) buildHuffmanCode(node.right, code + '1', codeMap);
  }
  let bitstring = '';
  codeMap.forEach((value, key) => {
    bitstring += value
  })
  return bitstring
}

export function bitStringToUint8Array(bitString) {
    // เก็บค่า bytes ที่จะถูกแปลงจากบิตสตริง
    const bytes = [];

    // เดินไปทีละ 8 บิตแล้วแปลงเป็น byte
    for (let i = 0; i < bitString.length; i += 8) {
        const byte = bitString.slice(i, i + 8);
        // แปลงบิตเป็นเลขฐาน 10 แล้วเก็บในอาร์เรย์
        bytes.push(parseInt(byte, 2));
    }

    // สร้าง Uint8Array จากอาร์เรย์ bytes
    return new Uint8Array(bytes);
}

export function decodeHuffman(encodedBits, huffmanCodeMap) {
  let decodedData = '';
  let currentBits = '';

  for (let bit of encodedBits) {
    currentBits += bit;  // เพิ่มบิตทีละบิต
    // ตรวจสอบว่ามีโค้ดใน map ที่ตรงกับบิตปัจจุบันหรือไม่
    for (let [key, code] of huffmanCodeMap.entries()) {
      if (currentBits === code) {
        decodedData += String.fromCharCode(key); // แปลงกลับไปเป็นค่าดั้งเดิม
        currentBits = '';  // รีเซ็ตบิตสตริง
        break;
      }
    }
  }

  return decodedData;
}

// ตัวอย่างการใช้
const huffmanCodeMap = new Map([
  [97, '00'],   // 'a' -> '00'
  [98, '01'],   // 'b' -> '01'
  [99, '10'],   // 'c' -> '10'
  [100, '11']   // 'd' -> '11'
]);

const encodedBits = "001011";  // บิตที่ถูกเข้ารหัส
const decodedData = decodeHuffman(encodedBits, huffmanCodeMap);
console.log(decodedData);  // แสดงข้อมูลที่ถอดรหัสแล้ว
