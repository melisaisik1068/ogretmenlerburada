import type { UserMe } from "@/lib/types/api";

export type TeacherAvailability = {
  id: number;
  weekday: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

export type Appointment = {
  id: number;
  teacher: Pick<UserMe, "id" | "username" | "first_name" | "last_name">;
  student: Pick<UserMe, "id" | "username" | "first_name" | "last_name">;
  starts_at: string;
  ends_at: string;
  status: string;
  note: string;
  meeting_url: string;
  created_at: string;
};
