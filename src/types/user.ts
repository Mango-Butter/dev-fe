export interface User {
  userId: number;
  role: "UNASSIGNED" | "BOSS" | "STAFF" | "ADMIN";
  name: string;
  phone: string;
  email: string;
  birth: string;
  profileImageUrl: string;
}
