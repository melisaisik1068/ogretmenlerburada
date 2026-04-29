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
};
