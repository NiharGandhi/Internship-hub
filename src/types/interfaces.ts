// interfaces.ts

export interface User {
    id: string | null;
    userId: string | null;
    name: string | null;
    bio?: string | null;
    EducationLevel?: string | null;
    InstitutionName?: string | null;
    GraduationDate?: Date | null;
    email?: string | null;
    stripe_customer_id?: string | null;
    verified: boolean | null;
    instagramLink?: string | null;
    linkedInLink?: string | null;
    xLink?: string | null;
    skills?: string | null;
    resume?: string | null;
    role: UserRole | null;
    userType: UserType | null;
    projects: Project[] | null;
    certificates: Certificate[] | null;
    applications: Application[] | null;
    sentMessages: Message[] | null;
    receivedMessages: Message[] | null;
    connectRequestsSent: ConnectRequest[] | null;
    connectRequestsReceived: ConnectRequest[] | null;
    publicMetadata?: { userType: string } | null;
}

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER",
}

export enum UserType {
    INTERNSHIP_FINDER = "INTERNSHIP_FINDER",
    RECRUITER = "RECRUITER",
}

export interface Project {
    id: string;
    name: string;
    description: string;
    link?: string;
    imageUrl?: string;
    userId: string;
    user: User;
}

export interface Certificate {
    id: string;
    name: string;
    description: string;
    link?: string;
    certificateUrl?: string;
    userId: string;
    user: User;
}

export interface Events {
    id: string;
    title: string;
    dateTime: Date;
    description: string;
    link?: string;
}

export interface OnlineResources {
    id: string;
    name: string;
    desc: string;
    link: string;
}

export interface RecommendedBooks {
    id: string;
    name: string;
    author: string;
    link: string;
}

export interface UsefulTools {
    id: string;
    name: string;
    desc: string;
    link: string;
}

export interface Company {
    id: string;
    userId: string;
    name: string;
    email?: string;
    userType: UserType;
    CompanyDescription?: string;
    CompanyImageUrl?: string;
    CompanyLogoUrl?: string;
    Location: string;
    projects: CreateInternship[];
    sentMessages: Message[];
    receivedMessages: Message[];
    connectRequestsSent: ConnectRequest[];
    connectRequestsReceived: ConnectRequest[];
}

export interface CreateInternship {
    id: string;
    name: string;
    EducationLevel?: string;
    InternshipDescription?: string;
    InternshipRequirement?: string;
    Paid: boolean;
    AmountPaid?: string;
    InternshipType: string;
    userId: string;
    user: Company;
    applications: Application[];
}

export interface Application {
    id: string;
    userId: string;
    user: User;
    internshipId: string;
    internship: CreateInternship;
    createdAt: Date;
    updatedAt: Date;
    status: ApplicationStatus;
    messages: Message[];
}

export enum ApplicationStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}

export interface Message {
    id: string;
    content: string;
    createdAt: Date;
    senderUserId?: string;
    senderUser?: User;
    receiverUserId?: string;
    receiverUser?: User;
    senderCompanyId?: string;
    senderCompany?: Company;
    receiverCompanyId?: string;
    receiverCompany?: Company;
    applicationId: string;
    application: Application;
}

export interface ConnectRequest {
    id: string;
    senderUserId?: string;
    senderUser?: User;
    receiverUserId?: string;
    receiverUser?: User;
    senderCompanyId?: string;
    senderCompany?: Company;
    receiverCompanyId?: string;
    receiverCompany?: Company;
    status: ConnectStatus;
    createdAt: Date;
    updatedAt: Date;
}

export enum ConnectStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
}
