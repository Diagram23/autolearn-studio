export type CourseCategory =
  | "Sales"
  | "Customer Service"
  | "Vehicle Knowledge"
  | "Financing"
  | "Warranty"
  | "Workshop";

export type CourseStatus = "Draft" | "Review" | "Published";

export interface Quiz {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz: Quiz;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  status: CourseStatus;
  assignedRoles: string[]; // e.g., ["Sales Advisor"]
  completionRate: number; // percentage
  enrolledEmployees: number; // count
  modules: Module[];
  createdBy: string;
  createdAt: string;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: "Training Manager" | "Sales Advisor" | "Service Advisor" | "Workshop Employee";
  avatar: string;
  completedCourses: number;
  ongoingCourses: number;
  averageQuizScore: number;
  atRisk: boolean;
  department: string;
}

export interface Activity {
  id: string;
  employeeName: string;
  employeeRole: string;
  action: string;
  courseTitle: string;
  timestamp: string;
  status: "success" | "pending" | "alert";
}
