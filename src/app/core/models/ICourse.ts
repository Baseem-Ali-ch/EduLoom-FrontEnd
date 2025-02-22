export interface ICourseForm {
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  moduleTitle: string;
  lessonTitle: string;
  moduleSelection?: string;
  uploadContent: File | null;
  lessonSelection?: string;
  price: number;
  assignment?: string;
  quiz?: string;
  liveClass?: string;
  offer?: string;
  coupon?: string;
}
