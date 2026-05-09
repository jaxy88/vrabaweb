export interface UserModel {
  _id: string;
  username: string;
  email: string;
  identifier: string;
  created_at: string;
  whatsapp: string;
  phone: string;
  active: boolean;
}

export interface UsersResponse {
  status: string;
  page: number;
  limit: number;
  total: number;
  data: UserModel[];
}