export interface IInstructor {
  _id?: string | undefined;
  userName: string;
  email: string;
  phone: string;
  place: string;
  state: string;
  qualification: string;
  workExperience: string;
  lastWorkingPlace: string;
  specialization: string;
  linkedinProfile?: string;
  isActive?: boolean;
  createdAt?: Date;
  approvedAt?: Date;
  profilePhoto?: string
}

export interface IModule {
  title: string;
  lessons: ILesson[];
}

export interface ILesson {
  title: string;
  content: string;
}
