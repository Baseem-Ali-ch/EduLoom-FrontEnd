export interface InstructorRequest {
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
  }