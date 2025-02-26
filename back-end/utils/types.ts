export interface ApiKey {
  key: string;
  rateLimit: number;
}

export interface JsonStorage {
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}
