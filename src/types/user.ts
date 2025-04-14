export interface User {
  userId: number;
  role: "UNASSIGNED" | "BOSS" | "STAFF";
  name: string;
  phone: string;
  email: string;
  profileImageUrl: string;
}
