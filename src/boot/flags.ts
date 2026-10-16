// URL flags. ?gl=off|force · ?record[=home|nav|case] · ?debug
export type RecordMode = false | 'home' | 'nav' | 'case';
export interface Flags { gl: 'auto' | 'off' | 'force'; record: RecordMode; debug: boolean }

export function readFlags(search: string = location.search): Flags {
  const q = new URLSearchParams(search);
  const gl = q.get('gl');
  let record: RecordMode = false;
  if (q.has('record')) {
    const r = q.get('record');
    record = r === 'nav' || r === 'case' ? r : 'home';
  }
  return { gl: gl === 'off' ? 'off' : gl === 'force' ? 'force' : 'auto', record, debug: q.has('debug') };
}
