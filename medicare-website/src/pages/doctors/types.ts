export interface Doctor {
  id: string;
  lastName: string;
  firstName: string;
  profile_picture?: string;
  specialization: string;
  experience: number;
  consultation_fee: number;
  gender: string;
  hospital_id?: string;
}

export interface DoctorsResponse {
  doctors: Doctor[];
  hasMore: boolean;
  nextCursor: string | null;
  totalCount: number;
}

export interface DoctorFilters {
  specialization?: string;
  hospital_id?: string;
  gender?: string;
  consultation_fee?: string;
  experience?: number | "";
}

export interface HospitalOption {
  name: string;
  value: string;
}
