export type UserMe = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  bio?: string;
  avatar_url?: string;
  teacher_verification_status?: string | null;
  is_teacher_verified?: boolean;
};

export type SubscriptionPlanBrief = {
  code: string;
  title: string;
  price_try: number;
  billing_cycle_days?: number;
};

export type SubscriptionPayload =
  | {
      id: number;
      plan: SubscriptionPlanBrief | null;
      provider?: string;
      status?: string;
    }
  | {
      subscription: null;
      plan: null;
    };

export type CoursePublic = {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  access_level: string;
  subject: { id: number; slug: string; title: string };
  teacher: Pick<UserMe, "id" | "username" | "first_name" | "last_name">;
  lessons_count?: number;
  total_duration_minutes?: number;
  min_price_try?: number;
  rating_avg?: number;
  rating_count?: number;
};

export type LessonPublic = {
  id: number;
  course: number;
  title: string;
  duration_minutes: number;
  price_try: number;
  content: string;
  video_url: string;
  order_index: number;
  is_preview?: boolean;
  is_published: boolean;
  created_at: string;
};

export type CourseDetail = CoursePublic & {
  lessons: LessonPublic[];
  is_published: boolean;
  created_at: string;
};
