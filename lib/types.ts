export type UserRole =
  | 'super_admin'
  | 'director'
  | 'secretary'
  | 'teacher'
  | 'parent'
  | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  schoolId: string;
  status?: 'active' | 'suspended';
  avatar?: string;
  title?: string;
  assignedClassIds?: string[];
  lastLogin?: string;
}

export interface AcademicYear {
  id: string;
  schoolId: string;
  name: string; // e.g. "2025-2026"
  startDate: string;
  endDate: string;
  status: 'active' | 'closed' | 'upcoming';
  isDefault: boolean;
}

export interface School {
  id: string;
  name: string;
  city: string;
  country: string;
  address?: string;
  phone: string;
  email: string;
  plan: 'free' | 'main' | 'advanced';
  monthlyFee: number;
  classesCount: number;
  studentsCount: number;
  parentsCount: number;
  code: string;
  status: 'active' | 'trial' | 'pending';
}

export interface SchoolClass {
  id: string;
  schoolId: string;
  academicYearId: string;
  name: string; // e.g. "CM2 A", "6ème Bleue"
  gradeLevel: string; // "CP1", "CP2", "CE1", "CE2", "CM1", "CM2", "6e", "5e", "4e", "3e", "2nde", "1ère", "Tle"
  division: string; // "A", "B", "C", "Bleue", etc.
  teacherId: string;
  teacherName: string;
  studentsCount: number;
  room?: string;
}

export interface Student {
  id: string;
  schoolId: string;
  academicYearId: string;
  classId: string;
  className: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthDate?: string;
  verificationCode: string; // Given to parents on paper bulletin to link account
  guardianPhone: string;
  guardianName?: string;
  status?: 'enrolled' | 'transferred' | 'graduated';
}

export interface ParentStudentRelation {
  id: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  className: string;
  relationType: 'Père' | 'Mère' | 'Tuteur légal' | 'Autre';
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedAt?: string;
}

export interface Announcement {
  id: string;
  schoolId: string;
  targetType: 'all' | 'class';
  targetClassId?: string;
  targetClassName?: string;
  authorId: string;
  authorName: string;
  authorRole: 'Direction' | 'Enseignant' | 'Secrétariat';
  title: string;
  content: string;
  smsVersion?: string;
  priority: 'normal' | 'important' | 'urgent';
  category: 'general' | 'pedagogy' | 'event' | 'discipline' | 'finance';
  createdAt: string;
  readCount: number;
  totalTargets: number;
  readByCurrentParent?: boolean;
}

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  date: string;
  session: 'Matin' | 'Après-midi';
  status: 'present' | 'absent' | 'late';
  durationMinutes?: number;
  reason?: string;
  isJustified: boolean;
  justificationReason?: string;
  justificationSubmittedBy?: string;
  justificationSubmittedAt?: string;
  justificationStatus?: 'none' | 'pending' | 'accepted' | 'rejected';
  recordedBy: string;
  notifiedParents: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'absence' | 'announcement' | 'link_approved' | 'system';
  channel: 'in_app' | 'sms' | 'whatsapp';
  isRead: boolean;
  createdAt: string;
  studentName?: string;
}

export interface SaaSPlan {
  id: 'free' | 'main' | 'advanced';
  name: string;
  price: number;
  currency: string;
  billingPeriod: string;
  subtitle: string;
  classesLimit: string;
  features: string[];
  isPopular?: boolean;
  badgeText?: string;
}
