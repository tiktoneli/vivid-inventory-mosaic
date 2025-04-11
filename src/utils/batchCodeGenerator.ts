
/**
 * Utility functions for generating batch codes
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Generates a unique batch code based on the provided prefix and existing codes
 * Format: PREFIX-YYYYMMDD-XXX where XXX is an incremental number
 * 
 * @param prefix Optional prefix for the batch code (default: 'BCH')
 * @returns A promise that resolves to a unique batch code
 */
export async function generateBatchCode(prefix: string = 'BCH'): Promise<string> {
  // Format: PREFIX-YYYYMMDD-XXX
  const today = new Date();
  const dateStr = today.getFullYear().toString() +
    (today.getMonth() + 1).toString().padStart(2, '0') +
    today.getDate().toString().padStart(2, '0');
  
  const baseCode = `${prefix}-${dateStr}`;
  
  // Get highest existing batch code with this prefix and date
  const { data } = await supabase
    .from('batches')
    .select('sku')
    .like('sku', `${baseCode}-%`)
    .order('sku', { ascending: false })
    .limit(1);
  
  // Determine next sequence number
  let nextSequence = 1;
  if (data && data.length > 0) {
    const lastCode = data[0].sku;
    const lastSequenceStr = lastCode.split('-').pop();
    if (lastSequenceStr && !isNaN(parseInt(lastSequenceStr))) {
      nextSequence = parseInt(lastSequenceStr) + 1;
    }
  }
  
  // Generate the new code with padding (e.g., 001, 012, 123)
  return `${baseCode}-${nextSequence.toString().padStart(3, '0')}`;
}

/**
 * Batch generates multiple unique batch codes
 * 
 * @param count Number of batch codes to generate
 * @param prefix Optional prefix for the batch codes (default: 'BCH')
 * @returns A promise that resolves to an array of unique batch codes
 */
export async function generateMultipleBatchCodes(count: number, prefix: string = 'BCH'): Promise<string[]> {
  // Get a base batch code first
  const baseCode = await generateBatchCode(prefix);
  const [prefixPart, datePart, seqPart] = baseCode.split('-');
  const sequence = parseInt(seqPart);
  
  // Generate subsequent codes
  const codes: string[] = [baseCode];
  for (let i = 1; i < count; i++) {
    const nextSeq = sequence + i;
    codes.push(`${prefixPart}-${datePart}-${nextSeq.toString().padStart(3, '0')}`);
  }
  
  return codes;
}
