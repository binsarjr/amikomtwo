
import { persisted } from 'svelte-local-storage-store'
import type { IHasilSemester, ITranskripNilai, Pengumuman } from '../../Amikom/typings/Response'

export const transkripNilai = persisted<ITranskripNilai | null>('transkripnilai', null);
export const hasilStudiSemester = persisted<IHasilSemester | null>('hasil-studi-semester', null);

export const pengumuman = persisted<Pengumuman[]>('pengumuman', []);
