

import { 
  Deflate,
  Inflate ,
  constants as StrategyOpt,
  type DeflateFunctionOptions,
  type InflateOptions,
  type DeflateOptions
} from 'pako';

import { 
  concatBytes as concat, 
  utf8ToBytes as u8a, 
  bytesToUtf8 as au8, 
  bytesToHex as toHex,
} from './index';

export type CompressOpts = DeflateOptions & {
  coverage?: 1 | 2 | 3 | 4 | null
}

export function compressData(dictionary: Uint8Array, options: DeflateOptions, ...data: Uint8Array[]): Uint8Array
export function compressData( options: DeflateOptions, ...data: Uint8Array[]): Uint8Array
export function compressData( dictionary: Uint8Array, options: DeflateOptions, data: Uint8Array): Uint8Array
export function compressData(  options: DeflateOptions, data: Uint8Array): Uint8Array

// Compress data with pako
export function compressData(
  dictionaryOrOptions: Uint8Array | DeflateOptions,
  optionsOrData: DeflateOptions | Uint8Array,
  ...data: Uint8Array[]
): Uint8Array {
  let dictionary: Uint8Array | undefined;
  let opts: DeflateOptions;
  let dataArray: Uint8Array[];
  let compress: Deflate;

  // ตรวจสอบว่า dictionary หรือ options ถูกส่งมาเป็นพารามิเตอร์แรก
  if (dictionaryOrOptions instanceof Uint8Array) {
    dictionary = dictionaryOrOptions;
    opts = optionsOrData as DeflateOptions;

    // ตรวจสอบว่ามีการส่งหลาย data (rest parameters) หรือแค่ตัวเดียว
    if (data.length > 0) {
      dataArray = data;  // รับค่าจาก rest parameters (...data)
    } else {
      dataArray = [optionsOrData as Uint8Array];  // รับแค่ค่าพารามิเตอร์เดียว
    }
  } else {
    dictionary = undefined;
    opts = dictionaryOrOptions as DeflateOptions;

    // ตรวจสอบว่า data ถูกส่งมาเป็น rest หรือเป็นพารามิเตอร์เดียว
    if (data.length > 0) {
      dataArray = [optionsOrData as Uint8Array, ...data];  // มี rest parameters
    } else {
      dataArray = [optionsOrData as Uint8Array];  // มีแค่พารามิเตอร์เดียว
    }
  }
  
  
  compress = new Deflate({
    level: opts.level ?? 1,
    strategy: opts.strategy ?? StrategyOpt.Z_FILTERED,
    raw: opts.raw ?? true,
    windowBits: opts.windowBits ?? -15,
    memLevel: opts.memLevel ?? 9,
    ...(dictionary && { dictionary }),
    ...opts,
  });

  //ตอนนี้ dataArray จะมีข้อมูลที่ถูกต้องไม่ว่ามันจะมาจาก single data หรือ rest parameters
  dataArray.forEach((dataPiece, index) => {
    
    compress.push(dataPiece, index === dataArray.length - 1);
  });
  
if (compress.err) {
  console.error('Compression error:', compress.msg);
  throw new Error('Compression error' + compress.msg);
}

  // คืนค่าข้อมูลที่ถูกบีบอัด
  return compress.result // เปลี่ยนเป็นผลลัพธ์การบีบอัดจริง
}

// Decompress data with pako

export function decompressData(data: Uint8Array, opts?: InflateOptions ): Uint8Array {
  
  const decompressedData = new Inflate({
    windowBits: opts?.windowBits || -15,
    raw: opts?.raw ?? true,
    dictionary: opts?.dictionary?? undefined,
    ...opts
  });
  decompressedData.push(data, true);

  if (decompressedData.err) {
    throw new Error(`Decompression error: ${decompressedData.msg}`);
  }

  return decompressedData.result as Uint8Array;
}

export function calculateChunkSize(dataArray: Uint8Array[], chunkCount: number): { totalSize: number, chunkSize: number } {
  console.debug(dataArray, chunkCount);
  const totalSize = dataArray.reduce((sum, data) => sum + data.length, 0); // คำนวณขนาดทั้งหมด
  console.log('totalSize', totalSize);

  // ตรวจสอบ chunkCount ต้องมีค่ามากกว่า 0
  if (chunkCount <= 0) {
    throw new Error("chunkCount must be greater than 0.");
  }

  // กำหนด chunkSize
  const chunkSize = Math.ceil(totalSize / chunkCount);

  // ตรวจสอบว่า chunkSize ไม่เกิน totalSize
  return { totalSize,
   chunkSize: Math.min(chunkSize, totalSize)}
}
export type { DeflateFunctionOptions, InflateOptions, DeflateOptions }