// export interface ICourseForm {
//   title: string;
//   description: string;
//   category: string;
//   difficultyLevel: string;
//   moduleTitle: string;
//   lessonTitle: string;
//   moduleSelection?: string;
//   uploadContent: File | null;
//   lessonSelection?: string;
//   price: number;
//   assignment?: string;
//   quiz?: string;
//   liveClass?: string;
//   offer?: string;
//   coupon?: string;
// }

import { ICoupon, IOffer } from './IAdmin';
import { IInstructor } from './Instructor';

export interface Lesson {
  title: string;
  content: string;
  document?: string;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Assignment {
  assignmentTitle: string;
  assignmentDescription: string;
}

export interface QuizOption {
  optionText: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  questionText: string;
  options: QuizOption[];
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface LiveClass {
  title: string;
  scheduleDate: string;
  duration: string;
  meetingLink: string;
  description: string;
}

export interface ICourse {
  _id?: string;
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  price: number;
  modules: Module[];
  assignments: Assignment[];
  quizzes: Quiz[];
  liveClasses: LiveClass[];
  instructorId?: IInstructor;
  offer?: IOffer;
  coupon?: ICoupon;
}
