import { PresenceMessage, PresenceStatus } from './Enum/Presence';

export interface ResponseResult {
	result: 0 | 1;
}
export interface ResponseAuth {
	access_token: string;
	api_key: string;
	expires_in: number;
}
export interface ResponseAuthLegacy {
	access_token: string;
	expires_in: number;
}

export type ResponsePresence =
	| {
			status: PresenceStatus.Success;
			message: PresenceMessage.Success;
	  }
	| {
			status: PresenceStatus.ResourceAlreadyExists;
			message: PresenceMessage.ResourceAlreadyExists;
	  }
	| {
			status: PresenceStatus.Failed;
			message: PresenceMessage.Failed;
	  };
export interface IBio {
	Mhs: {
		Npm: string;
		Nama: string;
		Angkatan: string;
		EmailAmikom: string;
		//    PassEmail?: string
		Prodi: string;
		IsBelumLulus: boolean;
		IsAktif: boolean;
		NpmImg: string;
	};
	PeriodeAkademik: {
		TahunAkademik: string;
		Semester: number;
		SemesterFormat: string;
	};
}
export type IJenisKuliah = 'Teori' | 'Praktikum';
export interface IMataKuliah {
	ZoomURL: string;
	IsZoomURL: boolean;
	Kode: string;
	IdKuliah: number;
	MataKuliah: string;
	JenisKuliah: IJenisKuliah;
	Nik: string;
	NamaDosen: string;
	EmailDosen: string;
	Jenjang: string;
	Kelas: string;
}

export interface IJadwalKuliah extends IMataKuliah {
	IdHari: number;
	IdJam: number;
	Keterangan: string;
	Hari: string;
	Ruang: string;
	Waktu: string;
	IsBolehPresensi: 0 | 1;
	KodePresensi: string;
}

export interface ITicketCost {
	va: string;
	jenis_kwj: string;
	nama_kwj: string;
	nominal: number;
	tipe: 'open' | string;
	alias_nominal: string;
	is_active: boolean;
	status: string;
	warna: string;
}
export interface IHistory {
	tha: string;
	semester: string;
	tgl_bayar: string;
	nominal: number;
	bank: string;
	nama_kwj: string;
}
export type ResponsePage<T> = {
	status: {
		code: number;
		description: 'OK' | string;
		pages_count: number;
	};
	results: T;
};
export interface IPresence {
	KrsId: number;
	Kode: string;
	NamaMk: string;
	NamaMkEn: string;
	JmlSks: number;
	JmlPresensiKuliah: number;
	IsHadirMID: boolean;
	IsHadirUAS: boolean;
}
export interface IPresenceDetail {
	Tanggal: string;
	Jam: string;
	Kelas: string;
	JenisKuliah: IJenisKuliah;
}
export interface InitKHS {
	Tahun: {
		thn_ajaran: string;
	}[];
	Semester: {
		Kode: number;
		Nama: string;
	}[];
}

export interface PageResponse<T> {
	status: {
		code: number;
		description: string;
		pages_count: number;
		items_count?: number;
	};
	results: T[];
}

export interface ItemPinjam {
	isbn: string;
	judul: string;
}

export interface PinjamanBuku {
	tgl_pinjam: string;
	tgl_harus_kembali?: string;
	telat: string;
	denda: number;
	item_pinjam: ItemPinjam[];
}

export interface Pengumuman {
	id: number;
	tanggal: string;
	start_at: string;
	end_at: string;
	title: string;
	// @html content
	pengumuman: string;
	// base64 tanpa format data
	gambar: string;
}

export interface ITranskripNilai {
	Ipk: number;
	JmlSks: number;
	SksKonsentrasi: number;
	SksPilihan: number;
	SksWajib: number;
	Transkrip: {
		JmlSks: number;
		Kode: string;
		NamaMk: string;
		NamaMkEn: string;
		NamaSifatMk: string;
		Nilai: string;
		SifatMk: string;
	}[];
}

export interface IHasilSemester {
	IpkSem: number;
	JmlSks: number;
	Khs: {
		JmlSks: number;
		Kode: string;
		KrsId: number;
		NamaMk: string;
		NamaMkEn: string;
		Nilai: string;
		TglKrs: string;
	}[];
}
