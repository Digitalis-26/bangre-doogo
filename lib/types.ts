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
  whatsapp?: string;
  email: string;
  plan: 'free' | 'main' | 'advanced';
  monthlyFee: number;
  classesCount: number;
  studentsCount: number;
  parentsCount: number;
  code: string;
  status: 'active' | 'trial' | 'pending';
  // Directory & Admissions fields for parents/students
  cycles?: ('Maternelle' | 'Primaire' | 'Collège' | 'Lycée')[];
  type?: 'Privé laïc' | 'Privé confessionnel' | 'Public d\'excellence' | 'Bilingue Français-Anglais';
  annualTuitionMin?: number;
  annualTuitionMax?: number;
  services?: string[]; // e.g. "Cantine scolaire", "Transport / Bus", "Internat", "Informatique", "Soutien scolaire"
  successRate?: string; // e.g. "98% au CEP · 94% au BEPC"
  openAdmissions?: boolean;
  admissionDeadline?: string;
  description?: string;
  highlights?: string[];
  bannerGradient?: string;
}

export interface SchoolInquiry {
  id: string;
  schoolId: string;
  schoolName: string;
  senderId: string;
  senderName: string;
  senderPhone: string;
  senderRole: 'parent' | 'student';
  studentName: string;
  targetGrade: string; // e.g. "6ème", "CM2", "2nde C"
  message?: string;
  status: 'sent' | 'contacted' | 'accepted';
  createdAt: string;
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
  type: 'absence' | 'announcement' | 'link_approved' | 'tuition' | 'system';
  channel: 'in_app' | 'sms' | 'whatsapp';
  isRead: boolean;
  createdAt: string;
  studentName?: string;
}

export type PaymentMethodType =
  | 'orange_money'
  | 'moov_money'
  | 'wave'
  | 'coris_money'
  | 'cash'
  | 'bank_transfer';

export interface TuitionInstallment {
  id: string;
  name: string; // e.g. "Frais d'inscription", "1ère Tranche", "2ème Tranche", "Solde"
  amount: number;
  dueDate: string;
  paidAmount: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  paidDate?: string;
}

export interface StudentTuitionAccount {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  classId: string;
  className: string;
  guardianName: string;
  guardianPhone: string;
  totalDue: number;
  totalPaid: number;
  balance: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  installments: TuitionInstallment[];
  lastPaymentDate?: string;
  lastReminderSentAt?: string;
  remindersCount: number;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string; // e.g. "QUIT-2026-0042"
  schoolId: string;
  schoolName: string;
  schoolCity: string;
  schoolPhone: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  classId: string;
  className: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  methodLabel: string;
  methodRef?: string;
  installmentName: string;
  payerName: string;
  payerPhone: string;
  recordedBy: string; // "Paiement en ligne (Parent)" or "Guichet Établissement (Secrétariat)"
  notes?: string;
  status: 'completed';
  createdAt: string;
  balanceAfter: number;
}

export interface TuitionReminderLog {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  studentMatricule: string;
  className: string;
  parentName: string;
  parentPhone: string;
  amountDue: number;
  dueDate: string;
  message: string;
  channel: 'sms' | 'whatsapp';
  sentAt: string;
  status: 'delivered';
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
