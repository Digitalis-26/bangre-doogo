'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserRole,
  User,
  School,
  SchoolClass,
  Student,
  ParentStudentRelation,
  Announcement,
  AttendanceRecord,
  AppNotification,
  SaaSPlan,
  AcademicYear,
  SchoolInquiry,
  StudentTuitionAccount,
  PaymentTransaction,
  TuitionReminderLog,
  PaymentMethodType,
} from '@/lib/types';
import {
  INITIAL_SCHOOLS,
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_RELATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ATTENDANCE,
  INITIAL_NOTIFICATIONS,
  SAAS_PLANS,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_SCHOOL_INQUIRIES,
  INITIAL_TUITION_ACCOUNTS,
  INITIAL_PAYMENT_TRANSACTIONS,
  INITIAL_TUITION_REMINDERS,
} from '@/lib/sample-data';

interface SchoolContextType {
  // Current active session
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  currentSchool: School;
  setCurrentSchoolId: (id: string) => void;
  schools: School[];
  users: User[];
  
  // Auth state & modal
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot') => void;
  login: (email: string, password?: string, role?: UserRole) => { success: boolean; message: string };
  signup: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: UserRole;
    schoolId: string;
    schoolName?: string;
    title?: string;
  }) => { success: boolean; message: string };
  logout: () => void;
  resetPassword: (email: string) => { success: boolean; message: string };

  // View mode
  isMobileDeviceView: boolean;
  setIsMobileDeviceView: (val: boolean) => void;

  // Academic Years
  academicYears: AcademicYear[];
  activeAcademicYear: AcademicYear;
  createAcademicYear: (name: string, startDate: string, endDate: string) => void;
  activateAcademicYear: (yearId: string) => void;
  closeAcademicYear: (yearId: string) => void;

  // School config
  updateSchoolConfig: (schoolId: string, partial: Partial<School>) => void;
  createSchool: (data: Omit<School, 'id' | 'classesCount' | 'studentsCount' | 'parentsCount'>) => School;

  // Classes & Divisions
  classes: SchoolClass[];
  addClass: (data: { name: string; gradeLevel: string; division: string; teacherId?: string; room?: string }) => SchoolClass;
  updateClass: (classId: string, partial: Partial<SchoolClass>) => void;
  assignTeacherToClass: (teacherId: string, classId: string) => void;

  // Students & Enrollments
  students: Student[];
  enrollStudent: (data: {
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';
    birthDate?: string;
    classId: string;
    guardianPhone: string;
    guardianName?: string;
  }) => Student;
  transferStudentClass: (studentId: string, newClassId: string) => void;

  // Users & Administration
  createUser: (data: Omit<User, 'id'>) => User;
  updateUser: (userId: string, partial: Partial<User>) => void;
  toggleUserStatus: (userId: string) => void;

  // Relations & Parents
  relations: ParentStudentRelation[];
  selectedChildId: string | null;
  setSelectedChildId: (id: string | null) => void;
  myChildren: Student[];
  requestParentChildLink: (matricule: string, verificationCode: string, relationType: 'Père' | 'Mère' | 'Tuteur légal' | 'Autre') => { success: boolean; message: string };
  updateRelationStatus: (relationId: string, status: 'approved' | 'rejected') => void;

  // Announcements
  announcements: Announcement[];
  publishAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt' | 'readCount' | 'readByCurrentParent'>) => Announcement;
  markAnnouncementAsRead: (announcementId: string) => void;

  // Attendance & Justifications
  attendance: AttendanceRecord[];
  recordAttendance: (
    classId: string,
    studentId: string,
    status: 'present' | 'absent' | 'late',
    session: 'Matin' | 'Après-midi',
    options?: { reason?: string; durationMinutes?: number; isJustified?: boolean }
  ) => AttendanceRecord;
  submitAbsenceJustification: (attendanceId: string, reason: string, parentName: string) => void;
  reviewAbsenceJustification: (attendanceId: string, status: 'accepted' | 'rejected') => void;

  // School Directory Inquiries & Applications (Parents & Students)
  schoolInquiries: SchoolInquiry[];
  submitSchoolInquiry: (data: {
    schoolId: string;
    studentName: string;
    targetGrade: string;
    senderPhone?: string;
    message?: string;
  }) => { success: boolean; message: string; inquiry: SchoolInquiry };

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;

  // Tuition, Payments & Official Receipts
  tuitionAccounts: StudentTuitionAccount[];
  paymentTransactions: PaymentTransaction[];
  tuitionReminders: TuitionReminderLog[];
  processOnlineTuitionPayment: (data: {
    studentId: string;
    amount: number;
    paymentMethod: PaymentMethodType;
    methodLabel: string;
    methodRef?: string;
    installmentId?: string;
    installmentName?: string;
    payerName: string;
    payerPhone: string;
  }) => { success: boolean; transaction: PaymentTransaction; message: string };
  recordManualTuitionPayment: (data: {
    studentId: string;
    amount: number;
    paymentMethod: PaymentMethodType;
    methodLabel: string;
    installmentName: string;
    payerName: string;
    payerPhone: string;
    notes?: string;
  }) => { success: boolean; transaction: PaymentTransaction; message: string };
  sendTuitionReminder: (
    studentId: string,
    customMessage?: string,
    channel?: 'sms' | 'whatsapp'
  ) => { success: boolean; message: string; log: TuitionReminderLog };
  sendBulkTuitionReminders: (
    studentIds: string[],
    channel?: 'sms' | 'whatsapp'
  ) => { success: boolean; sentCount: number; message: string };

  // SaaS Plans & Factory Reset
  saasPlans: SaaSPlan[];
  updateSchoolPlan: (schoolId: string, planId: 'free' | 'main' | 'advanced') => void;
  resetSystemData: () => void;
  resetDemoData: () => void;
  isHydrated: boolean;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_PREFIX = 'ecoleconnect_v1_';

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('parent');
  const [currentSchoolId, setCurrentSchoolId] = useState<string>('school-1');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(true);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Stored state initialized with identical server and client constants to avoid hydration mismatch
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(INITIAL_ACADEMIC_YEARS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [classes, setClasses] = useState<SchoolClass[]>(INITIAL_CLASSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [relations, setRelations] = useState<ParentStudentRelation[]>(INITIAL_RELATIONS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [schoolInquiries, setSchoolInquiries] = useState<SchoolInquiry[]>(INITIAL_SCHOOL_INQUIRIES);
  const [tuitionAccounts, setTuitionAccounts] = useState<StudentTuitionAccount[]>(INITIAL_TUITION_ACCOUNTS);
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(INITIAL_PAYMENT_TRANSACTIONS);
  const [tuitionReminders, setTuitionReminders] = useState<TuitionReminderLog[]>(INITIAL_TUITION_REMINDERS);

  // Safely restore persisted data from localStorage on client-side mount only
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedSchools = localStorage.getItem(`${STORAGE_PREFIX}schools`);
        if (savedSchools) setSchools(JSON.parse(savedSchools));

        const savedYears = localStorage.getItem(`${STORAGE_PREFIX}years`);
        if (savedYears) setAcademicYears(JSON.parse(savedYears));

        const savedUsers = localStorage.getItem(`${STORAGE_PREFIX}users`);
        if (savedUsers) setUsers(JSON.parse(savedUsers));

        const savedClasses = localStorage.getItem(`${STORAGE_PREFIX}classes`);
        if (savedClasses) setClasses(JSON.parse(savedClasses));

        const savedStudents = localStorage.getItem(`${STORAGE_PREFIX}students`);
        if (savedStudents) setStudents(JSON.parse(savedStudents));

        const savedRelations = localStorage.getItem(`${STORAGE_PREFIX}relations`);
        if (savedRelations) setRelations(JSON.parse(savedRelations));

        const savedAnnouncements = localStorage.getItem(`${STORAGE_PREFIX}announcements`);
        if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));

        const savedAttendance = localStorage.getItem(`${STORAGE_PREFIX}attendance`);
        if (savedAttendance) setAttendance(JSON.parse(savedAttendance));

        const savedNotifications = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
        if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

        const savedInquiries = localStorage.getItem(`${STORAGE_PREFIX}schoolInquiries`);
        if (savedInquiries) setSchoolInquiries(JSON.parse(savedInquiries));

        const savedTuition = localStorage.getItem(`${STORAGE_PREFIX}tuitionAccounts`);
        if (savedTuition) setTuitionAccounts(JSON.parse(savedTuition));

        const savedPayments = localStorage.getItem(`${STORAGE_PREFIX}paymentTransactions`);
        if (savedPayments) setPaymentTransactions(JSON.parse(savedPayments));

        const savedReminders = localStorage.getItem(`${STORAGE_PREFIX}tuitionReminders`);
        if (savedReminders) setTuitionReminders(JSON.parse(savedReminders));

        const savedAuth = localStorage.getItem(`${STORAGE_PREFIX}isAuthenticated`);
        const savedUserId = localStorage.getItem(`${STORAGE_PREFIX}currentUserId`);
        if (savedAuth === 'true' && savedUserId) {
          setIsAuthenticated(true);
          setCurrentUserId(savedUserId);
          setAuthModalOpen(false);
        } else {
          setIsAuthenticated(false);
          setCurrentUserId(null);
          setAuthModalOpen(true);
        }
      }
    } catch (e) {
      console.warn('Could not read saved data from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist state updates to localStorage whenever data changes after hydration
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}schools`, JSON.stringify(schools));
      localStorage.setItem(`${STORAGE_PREFIX}years`, JSON.stringify(academicYears));
      localStorage.setItem(`${STORAGE_PREFIX}users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_PREFIX}classes`, JSON.stringify(classes));
      localStorage.setItem(`${STORAGE_PREFIX}students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_PREFIX}relations`, JSON.stringify(relations));
      localStorage.setItem(`${STORAGE_PREFIX}announcements`, JSON.stringify(announcements));
      localStorage.setItem(`${STORAGE_PREFIX}attendance`, JSON.stringify(attendance));
      localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_PREFIX}schoolInquiries`, JSON.stringify(schoolInquiries));
      localStorage.setItem(`${STORAGE_PREFIX}tuitionAccounts`, JSON.stringify(tuitionAccounts));
      localStorage.setItem(`${STORAGE_PREFIX}paymentTransactions`, JSON.stringify(paymentTransactions));
      localStorage.setItem(`${STORAGE_PREFIX}tuitionReminders`, JSON.stringify(tuitionReminders));
      localStorage.setItem(`${STORAGE_PREFIX}isAuthenticated`, JSON.stringify(isAuthenticated));
      if (currentUserId) {
        localStorage.setItem(`${STORAGE_PREFIX}currentUserId`, currentUserId);
      } else {
        localStorage.removeItem(`${STORAGE_PREFIX}currentUserId`);
      }
    } catch (e) {
      console.warn('Could not save data to localStorage:', e);
    }
  }, [
    isHydrated,
    schools,
    academicYears,
    users,
    classes,
    students,
    relations,
    announcements,
    attendance,
    notifications,
    schoolInquiries,
    tuitionAccounts,
    paymentTransactions,
    tuitionReminders,
    isAuthenticated,
    currentUserId,
  ]);

  // Current School
  const currentSchool = useMemo(() => {
    return schools.find((s) => s.id === currentSchoolId) || schools[0];
  }, [schools, currentSchoolId]);

  // Active Academic Year
  const activeAcademicYear = useMemo(() => {
    return academicYears.find((y) => y.schoolId === currentSchool.id && y.status === 'active') ||
      academicYears.find((y) => y.status === 'active') ||
      academicYears[0];
  }, [academicYears, currentSchool.id]);

  // Current User based on currentUserId or active role
  const currentUser = useMemo(() => {
    if (currentUserId) {
      const matched = users.find((u) => u.id === currentUserId);
      if (matched) return matched;
    }

    const matchedByRole = users.find(
      (u) => u.role === currentRole && (u.schoolId === currentSchool.id || u.schoolId === 'all')
    );
    if (matchedByRole) return matchedByRole;

    return {
      id: currentUserId || `user-${currentRole}`,
      name:
        currentRole === 'director'
          ? 'Direction Établissement'
          : currentRole === 'teacher'
          ? 'Enseignant Titulaire'
          : currentRole === 'parent'
          ? 'Parent d\'élève'
          : currentRole === 'secretary'
          ? 'Secrétariat Scolaire'
          : 'Administrateur',
      email: `${currentRole}@ecoleconnect.bf`,
      phone: '+226 70 00 00 00',
      role: currentRole,
      schoolId: currentSchool.id,
      title: 'Compte Personnel',
      status: 'active' as const,
    };
  }, [currentUserId, currentRole, currentSchool.id, users]);

  // Parent's linked children
  const myChildren = useMemo(() => {
    if (currentRole !== 'parent') return [];
    const approvedStudentIds = relations
      .filter((r) => r.parentId === currentUser.id && r.status === 'approved')
      .map((r) => r.studentId);
    return students.filter((s) => approvedStudentIds.includes(s.id));
  }, [currentRole, currentUser.id, relations, students]);

  const [selectedChildIdState, setSelectedChildId] = useState<string | null>(null);

  const selectedChildId = useMemo(() => {
    if (selectedChildIdState && myChildren.some((c) => c.id === selectedChildIdState)) {
      return selectedChildIdState;
    }
    return myChildren[0]?.id || null;
  }, [selectedChildIdState, myChildren]);

  // Auth Operations
  const login = (emailOrPhone: string, password?: string, role?: UserRole) => {
    const query = emailOrPhone.trim().toLowerCase();
    const cleanPhone = query.replace(/\s+/g, '');

    const existing = users.find(
      (u) =>
        u.email.toLowerCase() === query ||
        u.phone.replace(/\s+/g, '') === cleanPhone
    );

    if (existing) {
      if (existing.status === 'suspended') {
        return { success: false, message: 'Ce compte est actuellement suspendu par la direction de l\'établissement.' };
      }

      // Password verification if password was set on the account
      if (existing.password && password && existing.password !== password) {
        return { success: false, message: 'Mot de passe incorrect. Veuillez vérifier votre saisie.' };
      }

      setCurrentUserId(existing.id);
      setCurrentRole(existing.role);
      if (existing.schoolId !== 'all') {
        setCurrentSchoolId(existing.schoolId);
      }
      setIsAuthenticated(true);
      setAuthModalOpen(false);

      if (typeof window !== 'undefined') {
        localStorage.setItem(`${STORAGE_PREFIX}isAuthenticated`, 'true');
        localStorage.setItem(`${STORAGE_PREFIX}currentUserId`, existing.id);
      }

      return { success: true, message: `Connexion réussie. Bienvenue, ${existing.name} !` };
    }

    // Role-based login if role is specified
    if (role) {
      const roleUser = users.find((u) => u.role === role);
      if (roleUser) {
        setCurrentUserId(roleUser.id);
        setCurrentRole(roleUser.role);
        if (roleUser.schoolId !== 'all') setCurrentSchoolId(roleUser.schoolId);
      } else {
        setCurrentRole(role);
      }
      setIsAuthenticated(true);
      setAuthModalOpen(false);
      return { success: true, message: `Session démarrée avec le rôle ${role}.` };
    }

    return {
      success: false,
      message: 'Identifiants non reconnus. Veuillez vérifier votre saisie ou créer un compte.',
    };
  };

  const signup = (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: UserRole;
    schoolId: string;
    schoolName?: string;
    title?: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Un compte existe déjà avec cette adresse email.' };
    }

    const explicitSchoolName = data.schoolName?.trim();
    let targetSchoolId = data.schoolId || currentSchool.id;
    let targetSchool = schools.find((s) => s.id === targetSchoolId);

    // If explicit school name was provided and doesn't match targetSchool, or if targetSchool wasn't found in current state
    if (explicitSchoolName && (!targetSchool || targetSchool.name.toLowerCase() !== explicitSchoolName.toLowerCase())) {
      const matchByName = schools.find((s) => s.name.toLowerCase() === explicitSchoolName.toLowerCase());
      if (matchByName) {
        targetSchool = matchByName;
        targetSchoolId = matchByName.id;
      } else {
        const generatedSchool: School = {
          id: targetSchoolId.startsWith('school-') ? targetSchoolId : `school-${Date.now()}`,
          name: explicitSchoolName,
          city: 'Ouagadougou',
          country: 'Burkina Faso',
          phone: data.phone.trim() || '+226 25 00 00 00',
          email: cleanEmail,
          plan: 'main',
          monthlyFee: 10000,
          code: explicitSchoolName.slice(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, '') || 'ECOL',
          status: 'active',
          cycles: ['Maternelle', 'Primaire', 'Collège'],
          type: 'Privé laïc',
          classesCount: 3,
          studentsCount: 1,
          parentsCount: 1,
        };
        targetSchool = generatedSchool;
        targetSchoolId = generatedSchool.id;
        setSchools((prev) => [...prev.filter((s) => s.id !== generatedSchool.id), generatedSchool]);
      }
    }

    if (!targetSchool) {
      targetSchool = {
        ...currentSchool,
        name: explicitSchoolName || currentSchool.name,
      };
    }

    const resolvedSchoolName = explicitSchoolName || targetSchool.name;
    const newUserId = `user-${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      password: data.password || 'Ecole2026!',
      role: data.role,
      schoolId: targetSchoolId,
      status: 'active',
      title:
        data.title ||
        (data.role === 'parent'
          ? 'Parent d\'élève (Responsable Légal)'
          : data.role === 'teacher'
          ? 'Enseignant Titulaire'
          : data.role === 'director'
          ? 'Direction Établissement'
          : 'Secrétariat Scolaire'),
      lastLogin: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUserId);
    setCurrentRole(data.role);
    setCurrentSchoolId(targetSchoolId);

    // If registered as Parent, instantiate their child in this exact school with tuition and initial receipt
    if (data.role === 'parent') {
      const nameParts = data.name.trim().split(' ');
      const parentLastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0];
      const childFirstName = 'Rayan';
      const childFullName = `${childFirstName} ${parentLastName}`;
      const childId = `student-${Date.now()}`;
      const schoolCode = (targetSchool.code || resolvedSchoolName.slice(0, 4)).toUpperCase().replace(/[^A-Z0-9]/g, '') || 'ECOL';
      const childMatricule = `MAT-${schoolCode}-${Math.floor(100 + Math.random() * 900)}`;

      // Locate or assign class
      const schoolClasses = classes.filter((c) => c.schoolId === targetSchoolId);
      const chosenClass = schoolClasses[0] || {
        id: `class-${targetSchoolId}-1`,
        name: '6ème A',
      };

      const newStudent: Student = {
        id: childId,
        schoolId: targetSchoolId,
        academicYearId: activeAcademicYear.id,
        matricule: childMatricule,
        firstName: childFirstName,
        lastName: parentLastName,
        gender: 'M',
        birthDate: '2013-05-14',
        classId: chosenClass.id,
        className: chosenClass.name,
        verificationCode: childMatricule.slice(-4),
        guardianPhone: data.phone.trim(),
        guardianName: data.name.trim(),
        status: 'enrolled',
      };

      const newRelation: ParentStudentRelation = {
        id: `rel-${Date.now()}`,
        parentId: newUserId,
        parentName: data.name.trim(),
        parentPhone: data.phone.trim(),
        studentId: childId,
        studentName: childFullName,
        studentMatricule: childMatricule,
        className: chosenClass.name,
        relationType: 'Tuteur légal',
        status: 'approved',
        requestedAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      };

      const newTuitionAccount: StudentTuitionAccount = {
        id: `tuition-${Date.now()}`,
        studentId: childId,
        studentName: childFullName,
        studentMatricule: childMatricule,
        classId: chosenClass.id,
        className: chosenClass.name,
        schoolId: targetSchoolId,
        guardianName: data.name.trim(),
        guardianPhone: data.phone.trim(),
        totalDue: 135000,
        totalPaid: 45000,
        balance: 90000,
        status: 'partial',
        installments: [
          {
            id: `inst-1-${Date.now()}`,
            name: '1ère Tranche (Inscription)',
            dueDate: '2025-10-15',
            amount: 45000,
            paidAmount: 45000,
            status: 'paid',
            paidDate: new Date().toISOString().split('T')[0],
          },
          {
            id: `inst-2-${Date.now()}`,
            name: '2ème Tranche',
            dueDate: '2026-01-15',
            amount: 45000,
            paidAmount: 0,
            status: 'pending',
          },
          {
            id: `inst-3-${Date.now()}`,
            name: '3ème Tranche',
            dueDate: '2026-04-15',
            amount: 45000,
            paidAmount: 0,
            status: 'pending',
          },
        ],
        lastPaymentDate: new Date().toISOString().split('T')[0],
        remindersCount: 0,
      };

      const initialReceiptNumber = `QUITT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTx: PaymentTransaction = {
        id: `pay-${Date.now()}`,
        receiptNumber: initialReceiptNumber,
        schoolId: targetSchoolId,
        schoolName: resolvedSchoolName,
        schoolCity: targetSchool.city || 'Ouagadougou',
        schoolPhone: targetSchool.phone || data.phone.trim(),
        studentId: childId,
        studentName: childFullName,
        studentMatricule: childMatricule,
        classId: chosenClass.id,
        className: chosenClass.name,
        amount: 45000,
        paymentMethod: 'orange_money',
        methodLabel: 'Orange Money',
        methodRef: `OM-${Math.floor(100000 + Math.random() * 900000)}`,
        installmentName: '1ère Tranche (Inscription)',
        payerName: data.name.trim(),
        payerPhone: data.phone.trim(),
        recordedBy: `Paiement en ligne (${data.name.trim()})`,
        notes: `Règlement d'inscription validé avec succès pour ${resolvedSchoolName}`,
        status: 'completed',
        createdAt: new Date().toISOString(),
        balanceAfter: 90000,
      };

      setStudents((prev) => [newStudent, ...prev]);
      setRelations((prev) => [newRelation, ...prev]);
      setTuitionAccounts((prev) => [newTuitionAccount, ...prev]);
      setPaymentTransactions((prev) => [newTx, ...prev]);
      setSelectedChildId(childId);
    }

    setIsAuthenticated(true);
    setAuthModalOpen(false);

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_PREFIX}isAuthenticated`, 'true');
      localStorage.setItem(`${STORAGE_PREFIX}currentUserId`, newUserId);
    }

    return {
      success: true,
      message: `Compte créé avec succès pour ${data.name} au sein de l'établissement ${targetSchool.name}.`,
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUserId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${STORAGE_PREFIX}isAuthenticated`);
      localStorage.removeItem(`${STORAGE_PREFIX}currentUserId`);
    }
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const resetPassword = (email: string) => {
    return {
      success: true,
      message: `Un lien sécurisé de réinitialisation a été envoyé par SMS/email à ${email}.`,
    };
  };

  // Academic Year Operations
  const createAcademicYear = (name: string, startDate: string, endDate: string) => {
    const newYear: AcademicYear = {
      id: `year-${Date.now()}`,
      schoolId: currentSchool.id,
      name,
      startDate,
      endDate,
      status: 'upcoming',
      isDefault: false,
    };
    setAcademicYears((prev) => [...prev, newYear]);
  };

  const activateAcademicYear = (yearId: string) => {
    setAcademicYears((prev) =>
      prev.map((y) => {
        if (y.id === yearId) return { ...y, status: 'active', isDefault: true };
        if (y.schoolId === currentSchool.id && y.status === 'active') return { ...y, status: 'closed', isDefault: false };
        return y;
      })
    );
  };

  const closeAcademicYear = (yearId: string) => {
    setAcademicYears((prev) =>
      prev.map((y) => (y.id === yearId ? { ...y, status: 'closed', isDefault: false } : y))
    );
  };

  // School Config
  const updateSchoolConfig = (schoolId: string, partial: Partial<School>) => {
    setSchools((prev) => prev.map((s) => (s.id === schoolId ? { ...s, ...partial } : s)));
    if (partial.name) {
      setPaymentTransactions((prev) =>
        prev.map((tx) => (tx.schoolId === schoolId ? { ...tx, schoolName: partial.name! } : tx))
      );
    }
  };

  const createSchool = (data: Omit<School, 'id' | 'classesCount' | 'studentsCount' | 'parentsCount'>): School => {
    const schoolId = `school-${Date.now()}`;
    const newSchool: School = {
      ...data,
      id: schoolId,
      classesCount: 3,
      studentsCount: 2,
      parentsCount: 2,
    };

    // Create academic year for this new school
    const newYear: AcademicYear = {
      id: `year-${schoolId}`,
      schoolId: schoolId,
      name: '2025-2026',
      startDate: '2025-10-01',
      endDate: '2026-06-30',
      status: 'active',
      isDefault: true,
    };

    // Create initial classes for this school
    const class1: SchoolClass = {
      id: `class-${schoolId}-1`,
      schoolId: schoolId,
      academicYearId: newYear.id,
      name: '6ème A',
      gradeLevel: '6ème',
      division: 'A',
      teacherId: 'user-teacher-1',
      teacherName: 'M. Sawadogo Marc',
      studentsCount: 1,
      room: 'Bâtiment Principal - Salle 101',
    };
    const class2: SchoolClass = {
      id: `class-${schoolId}-2`,
      schoolId: schoolId,
      academicYearId: newYear.id,
      name: 'CM2 A',
      gradeLevel: 'CM2',
      division: 'A',
      teacherId: 'user-teacher-1',
      teacherName: 'Mme Kaboré Salimata',
      studentsCount: 1,
      room: 'Bâtiment Primaire - Salle 2',
    };
    const class3: SchoolClass = {
      id: `class-${schoolId}-3`,
      schoolId: schoolId,
      academicYearId: newYear.id,
      name: '3ème B',
      gradeLevel: '3ème',
      division: 'B',
      teacherId: 'user-teacher-1',
      teacherName: 'M. Ousmane Barry',
      studentsCount: 0,
      room: 'Bâtiment Principal - Salle 204',
    };

    setSchools((prev) => [...prev, newSchool]);
    setAcademicYears((prev) => [newYear, ...prev]);
    setClasses((prev) => [class1, class2, class3, ...prev]);
    setCurrentSchoolId(schoolId);
    return newSchool;
  };

  // Classes & Divisions
  const addClass = (data: { name: string; gradeLevel: string; division: string; teacherId?: string; room?: string }): SchoolClass => {
    const teacher = users.find((u) => u.id === data.teacherId);
    const newClass: SchoolClass = {
      id: `class-${Date.now()}`,
      schoolId: currentSchool.id,
      academicYearId: activeAcademicYear.id,
      name: data.name,
      gradeLevel: data.gradeLevel,
      division: data.division,
      teacherId: data.teacherId || '',
      teacherName: teacher ? teacher.name : 'Non assigné',
      studentsCount: 0,
      room: data.room || 'Salle principale',
    };
    setClasses((prev) => [...prev, newClass]);
    setSchools((prev) =>
      prev.map((s) => (s.id === currentSchool.id ? { ...s, classesCount: s.classesCount + 1 } : s))
    );
    return newClass;
  };

  const updateClass = (classId: string, partial: Partial<SchoolClass>) => {
    setClasses((prev) => prev.map((c) => (c.id === classId ? { ...c, ...partial } : c)));
  };

  const assignTeacherToClass = (teacherId: string, classId: string) => {
    const teacher = users.find((u) => u.id === teacherId);
    if (!teacher) return;

    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, teacherId, teacherName: teacher.name } : c))
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === teacherId) {
          const assigned = u.assignedClassIds || [];
          return { ...u, assignedClassIds: Array.from(new Set([...assigned, classId])) };
        }
        return u;
      })
    );
  };

  // Students & Enrollments
  const enrollStudent = (data: {
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';
    birthDate?: string;
    classId: string;
    guardianPhone: string;
    guardianName?: string;
  }): Student => {
    const cls = classes.find((c) => c.id === data.classId);
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const matriculeYear = new Date().getFullYear();
    const matriculeNum = Math.floor(100 + Math.random() * 900);

    const newStudent: Student = {
      id: `stud-${Date.now()}`,
      schoolId: currentSchool.id,
      academicYearId: activeAcademicYear.id,
      classId: data.classId,
      className: cls ? cls.name : 'Classe',
      matricule: `${currentSchool.code.slice(0, 5)}-${matriculeYear}-${matriculeNum}`,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      birthDate: data.birthDate,
      verificationCode: `LINK-${codeNum}`,
      guardianPhone: data.guardianPhone,
      guardianName: data.guardianName,
      status: 'enrolled',
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Update class student count
    setClasses((prev) =>
      prev.map((c) => (c.id === data.classId ? { ...c, studentsCount: c.studentsCount + 1 } : c))
    );

    // Update school student count
    setSchools((prev) =>
      prev.map((s) => (s.id === currentSchool.id ? { ...s, studentsCount: s.studentsCount + 1 } : s))
    );

    return newStudent;
  };

  const transferStudentClass = (studentId: string, newClassId: string) => {
    const newCls = classes.find((c) => c.id === newClassId);
    if (!newCls) return;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const oldClassId = s.classId;
          // Decrement old class, increment new
          setClasses((cList) =>
            cList.map((c) => {
              if (c.id === oldClassId) return { ...c, studentsCount: Math.max(0, c.studentsCount - 1) };
              if (c.id === newClassId) return { ...c, studentsCount: c.studentsCount + 1 };
              return c;
            })
          );
          return { ...s, classId: newClassId, className: newCls.name };
        }
        return s;
      })
    );
  };

  // User Management
  const createUser = (data: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...data,
      id: `user-${Date.now()}`,
      status: 'active',
      lastLogin: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const updateUser = (userId: string, partial: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...partial } : u)));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u
      )
    );
  };

  // Announcements
  const publishAnnouncement = (
    data: Omit<Announcement, 'id' | 'createdAt' | 'readCount' | 'readByCurrentParent'>
  ): Announcement => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
      readCount: 1,
      readByCurrentParent: false,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);

    // Push notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: `Nouvelle annonce : ${data.title}`,
      message: data.content.slice(0, 100) + '...',
      type: 'announcement',
      channel: 'in_app',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newAnn;
  };

  const markAnnouncementAsRead = (announcementId: string) => {
    setAnnouncements((prev) =>
      prev.map((ann) => {
        if (ann.id === announcementId && !ann.readByCurrentParent) {
          return {
            ...ann,
            readCount: ann.readCount + 1,
            readByCurrentParent: true,
          };
        }
        return ann;
      })
    );
  };

  // Attendance & Justifications
  const recordAttendance = (
    classId: string,
    studentId: string,
    status: 'present' | 'absent' | 'late',
    session: 'Matin' | 'Après-midi',
    options?: { reason?: string; durationMinutes?: number; isJustified?: boolean }
  ): AttendanceRecord => {
    const student = students.find((s) => s.id === studentId);
    const cls = classes.find((c) => c.id === classId);
    const dateStr = new Date().toISOString().split('T')[0];

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      schoolId: currentSchool.id,
      classId,
      className: cls ? cls.name : 'Classe',
      studentId,
      studentName: student ? `${student.firstName} ${student.lastName}` : 'Élève',
      date: dateStr,
      session,
      status,
      durationMinutes: options?.durationMinutes,
      reason: options?.reason,
      isJustified: options?.isJustified ?? false,
      justificationStatus: options?.isJustified ? 'accepted' : 'none',
      recordedBy: currentUser.name,
      notifiedParents: true,
      createdAt: new Date().toISOString(),
    };

    setAttendance((prev) => [newRecord, ...prev]);

    if (status === 'absent' || status === 'late') {
      const alertNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: 'user-parent-1',
        title: status === 'absent' ? `Alerte absence : ${student?.firstName}` : `Alerte retard : ${student?.firstName}`,
        message: `${student?.firstName} ${student?.lastName} a été signalé ${status === 'absent' ? 'absent(e)' : `en retard (${options?.durationMinutes || 15}m)`} ce ${session}.`,
        type: 'absence',
        channel: 'sms',
        isRead: false,
        createdAt: new Date().toISOString(),
        studentName: student ? `${student.firstName} ${student.lastName}` : undefined,
      };
      setNotifications((prev) => [alertNotif, ...prev]);
    }

    return newRecord;
  };

  const submitAbsenceJustification = (attendanceId: string, reason: string, parentName: string) => {
    setAttendance((prev) =>
      prev.map((att) => {
        if (att.id === attendanceId) {
          return {
            ...att,
            justificationReason: reason,
            justificationSubmittedBy: parentName,
            justificationSubmittedAt: new Date().toISOString(),
            justificationStatus: 'pending',
          };
        }
        return att;
      })
    );
  };

  const reviewAbsenceJustification = (attendanceId: string, status: 'accepted' | 'rejected') => {
    setAttendance((prev) =>
      prev.map((att) => {
        if (att.id === attendanceId) {
          return {
            ...att,
            justificationStatus: status,
            isJustified: status === 'accepted',
          };
        }
        return att;
      })
    );
  };

  // Relations
  const requestParentChildLink = (
    matricule: string,
    verificationCode: string,
    relationType: 'Père' | 'Mère' | 'Tuteur légal' | 'Autre'
  ) => {
    const student = students.find(
      (s) =>
        s.matricule.trim().toUpperCase() === matricule.trim().toUpperCase() &&
        s.verificationCode.trim().toUpperCase() === verificationCode.trim().toUpperCase()
    );

    if (!student) {
      return {
        success: false,
        message: 'Matricule ou code secret invalide. Veuillez vérifier le bulletin officiel.',
      };
    }

    const existing = relations.find(
      (r) => r.parentId === currentUser.id && r.studentId === student.id
    );

    if (existing) {
      return {
        success: false,
        message: `Une demande pour ${student.firstName} est déjà ${existing.status === 'approved' ? 'active' : 'en cours'}.`,
      };
    }

    const newRel: ParentStudentRelation = {
      id: `rel-${Date.now()}`,
      parentId: currentUser.id,
      parentName: currentUser.name,
      parentPhone: currentUser.phone,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentMatricule: student.matricule,
      className: student.className,
      relationType,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    setRelations((prev) => [newRel, ...prev]);

    return {
      success: true,
      message: `Demande de rattachement envoyée pour ${student.firstName} ${student.lastName}. La direction doit la valider.`,
    };
  };

  const updateRelationStatus = (relationId: string, status: 'approved' | 'rejected') => {
    setRelations((prev) =>
      prev.map((rel) => {
        if (rel.id === relationId) {
          return {
            ...rel,
            status,
            approvedAt: status === 'approved' ? new Date().toISOString() : undefined,
          };
        }
        return rel;
      })
    );
  };

  // Notifications
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // School Directory Inquiries & Applications
  const submitSchoolInquiry = (data: {
    schoolId: string;
    studentName: string;
    targetGrade: string;
    senderPhone?: string;
    message?: string;
  }) => {
    const targetSchool = schools.find((s) => s.id === data.schoolId);
    const newInquiry: SchoolInquiry = {
      id: `inq-${Date.now()}`,
      schoolId: data.schoolId,
      schoolName: targetSchool ? targetSchool.name : 'Établissement',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderPhone: data.senderPhone || currentUser.phone,
      senderRole: currentRole === 'student' ? 'student' : 'parent',
      studentName: data.studentName,
      targetGrade: data.targetGrade,
      message: data.message,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    setSchoolInquiries((prev) => [newInquiry, ...prev]);

    // Push in-app confirmation notification
    const notif: AppNotification = {
      id: `notif-inq-${Date.now()}`,
      userId: currentUser.id,
      title: 'Demande d\'inscription transmise',
      message: `Votre demande pour ${data.studentName} (${data.targetGrade}) a été transmise avec succès à l'administration de ${newInquiry.schoolName}.`,
      type: 'system',
      channel: 'in_app',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return {
      success: true,
      message: `Votre demande de pré-inscription/renseignements a été envoyée avec succès à ${newInquiry.schoolName}. Le secrétariat vous recontactera au ${newInquiry.senderPhone}.`,
      inquiry: newInquiry,
    };
  };

  // Plan
  const updateSchoolPlan = (schoolId: string, planId: 'free' | 'main' | 'advanced') => {
    const fee = planId === 'free' ? 0 : planId === 'main' ? 10000 : 25000;
    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, plan: planId, monthlyFee: fee } : s))
    );
  };

  // Helper to generate sequential receipt numbers
  const generateReceiptNumber = () => {
    const year = new Date().getFullYear();
    const count = paymentTransactions.length + 1;
    return `QUIT-${year}-${count.toString().padStart(4, '0')}`;
  };

  // Process Online Tuition Payment (Parent)
  const processOnlineTuitionPayment = (data: {
    studentId: string;
    amount: number;
    paymentMethod: PaymentMethodType;
    methodLabel: string;
    methodRef?: string;
    installmentId?: string;
    installmentName?: string;
    payerName: string;
    payerPhone: string;
  }) => {
    const account = tuitionAccounts.find((a) => a.studentId === data.studentId);
    if (!account) {
      throw new Error("Compte de scolarité de l'élève introuvable.");
    }

    const receiptNumber = generateReceiptNumber();
    const newTotalPaid = account.totalPaid + data.amount;
    const newBalance = Math.max(0, account.totalDue - newTotalPaid);

    let effectiveInstallmentName = data.installmentName || 'Règlement scolarité';
    let remaining = data.amount;

    const updatedInstallments = account.installments.map((inst) => {
      if (data.installmentId && inst.id === data.installmentId) {
        effectiveInstallmentName = inst.name;
        const newPaid = inst.paidAmount + remaining;
        const isPaid = newPaid >= inst.amount;
        return {
          ...inst,
          paidAmount: Math.min(inst.amount, newPaid),
          status: isPaid ? ('paid' as const) : ('partial' as const),
          paidDate: new Date().toISOString().split('T')[0],
        };
      }
      if (!data.installmentId && remaining > 0 && inst.paidAmount < inst.amount) {
        const needed = inst.amount - inst.paidAmount;
        const toPay = Math.min(needed, remaining);
        remaining -= toPay;
        effectiveInstallmentName = inst.name;
        const isPaid = inst.paidAmount + toPay >= inst.amount;
        return {
          ...inst,
          paidAmount: inst.paidAmount + toPay,
          status: isPaid ? ('paid' as const) : ('partial' as const),
          paidDate: new Date().toISOString().split('T')[0],
        };
      }
      return inst;
    });

    const hasOverdue = updatedInstallments.some(
      (i) => i.status !== 'paid' && new Date(i.dueDate) < new Date()
    );
    const newStatus: 'paid' | 'partial' | 'unpaid' | 'overdue' =
      newBalance === 0 ? 'paid' : hasOverdue ? 'overdue' : 'partial';

    const updatedAccount: StudentTuitionAccount = {
      ...account,
      totalPaid: newTotalPaid,
      balance: newBalance,
      status: newStatus,
      installments: updatedInstallments,
      lastPaymentDate: new Date().toISOString().split('T')[0],
    };

    const newTransaction: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      receiptNumber,
      schoolId: account.schoolId,
      schoolName: currentSchool.name,
      schoolCity: currentSchool.city,
      schoolPhone: currentSchool.phone,
      studentId: account.studentId,
      studentName: account.studentName,
      studentMatricule: account.studentMatricule,
      classId: account.classId,
      className: account.className,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      methodLabel: data.methodLabel,
      methodRef:
        data.methodRef ||
        `${data.paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
      installmentName: effectiveInstallmentName,
      payerName: data.payerName,
      payerPhone: data.payerPhone,
      recordedBy: `Paiement en ligne (${currentUser.name})`,
      notes: `Paiement validé avec succès via ${data.methodLabel}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      balanceAfter: newBalance,
    };

    setTuitionAccounts((prev) =>
      prev.map((a) => (a.studentId === data.studentId ? updatedAccount : a))
    );
    setPaymentTransactions((prev) => [newTransaction, ...prev]);

    // Push in-app confirmation notification
    const notif: AppNotification = {
      id: `notif-pay-${Date.now()}`,
      userId: currentUser.id,
      title: `Paiement reçu — Quittance N° ${receiptNumber}`,
      message: `Votre règlement de ${data.amount.toLocaleString()} FCFA pour ${account.studentName} a été validé. La quittance officielle est disponible.`,
      type: 'tuition',
      channel: 'in_app',
      isRead: false,
      createdAt: new Date().toISOString(),
      studentName: account.studentName,
    };
    setNotifications((prev) => [notif, ...prev]);

    return {
      success: true,
      transaction: newTransaction,
      message: `Paiement de ${data.amount.toLocaleString()} FCFA validé. Quittance N° ${receiptNumber} émise.`,
    };
  };

  // Record Manual Tuition Payment (Direction / Secrétariat)
  const recordManualTuitionPayment = (data: {
    studentId: string;
    amount: number;
    paymentMethod: PaymentMethodType;
    methodLabel: string;
    installmentName: string;
    payerName: string;
    payerPhone: string;
    notes?: string;
  }) => {
    const account = tuitionAccounts.find((a) => a.studentId === data.studentId);
    if (!account) {
      throw new Error("Compte de scolarité de l'élève introuvable.");
    }

    const receiptNumber = generateReceiptNumber();
    const newTotalPaid = account.totalPaid + data.amount;
    const newBalance = Math.max(0, account.totalDue - newTotalPaid);

    let remaining = data.amount;
    const updatedInstallments = account.installments.map((inst) => {
      if (remaining > 0 && inst.paidAmount < inst.amount) {
        const needed = inst.amount - inst.paidAmount;
        const toPay = Math.min(needed, remaining);
        remaining -= toPay;
        const isPaid = inst.paidAmount + toPay >= inst.amount;
        return {
          ...inst,
          paidAmount: inst.paidAmount + toPay,
          status: isPaid ? ('paid' as const) : ('partial' as const),
          paidDate: new Date().toISOString().split('T')[0],
        };
      }
      return inst;
    });

    const hasOverdue = updatedInstallments.some(
      (i) => i.status !== 'paid' && new Date(i.dueDate) < new Date()
    );
    const newStatus: 'paid' | 'partial' | 'unpaid' | 'overdue' =
      newBalance === 0 ? 'paid' : hasOverdue ? 'overdue' : 'partial';

    const updatedAccount: StudentTuitionAccount = {
      ...account,
      totalPaid: newTotalPaid,
      balance: newBalance,
      status: newStatus,
      installments: updatedInstallments,
      lastPaymentDate: new Date().toISOString().split('T')[0],
    };

    const newTransaction: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      receiptNumber,
      schoolId: account.schoolId,
      schoolName: currentSchool.name,
      schoolCity: currentSchool.city,
      schoolPhone: currentSchool.phone,
      studentId: account.studentId,
      studentName: account.studentName,
      studentMatricule: account.studentMatricule,
      classId: account.classId,
      className: account.className,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      methodLabel: data.methodLabel,
      installmentName: data.installmentName,
      payerName: data.payerName,
      payerPhone: data.payerPhone,
      recordedBy: `Guichet Établissement (${currentUser.name})`,
      notes: data.notes || `Encaissement enregistré au guichet`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      balanceAfter: newBalance,
    };

    setTuitionAccounts((prev) =>
      prev.map((a) => (a.studentId === data.studentId ? updatedAccount : a))
    );
    setPaymentTransactions((prev) => [newTransaction, ...prev]);

    return {
      success: true,
      transaction: newTransaction,
      message: `Encaissement de ${data.amount.toLocaleString()} FCFA enregistré. Quittance N° ${receiptNumber} délivrée.`,
    };
  };

  // Send Tuition Reminder to Parent
  const sendTuitionReminder = (
    studentId: string,
    customMessage?: string,
    channel: 'sms' | 'whatsapp' = 'sms'
  ) => {
    const account = tuitionAccounts.find((a) => a.studentId === studentId);
    if (!account) {
      throw new Error("Compte élève introuvable.");
    }

    const defaultMsg = `Avis ${currentSchool.name} : Rappel pour la scolarité de ${account.studentName} (${account.className}). Reste dû : ${account.balance.toLocaleString()} FCFA. Règlement possible par Orange Money, Moov ou Wave sur ÉcoleConnect. Merci.`;
    const message = customMessage || defaultMsg;

    const newLog: TuitionReminderLog = {
      id: `rem-${Date.now()}`,
      schoolId: account.schoolId,
      studentId: account.studentId,
      studentName: account.studentName,
      studentMatricule: account.studentMatricule,
      className: account.className,
      parentName: account.guardianName,
      parentPhone: account.guardianPhone,
      amountDue: account.balance,
      dueDate: new Date().toISOString().split('T')[0],
      message,
      channel,
      sentAt: new Date().toISOString(),
      status: 'delivered',
    };

    setTuitionReminders((prev) => [newLog, ...prev]);
    setTuitionAccounts((prev) =>
      prev.map((a) =>
        a.studentId === studentId
          ? {
              ...a,
              lastReminderSentAt: new Date().toISOString(),
              remindersCount: (a.remindersCount || 0) + 1,
            }
          : a
      )
    );

    return {
      success: true,
      message: `Relance ${channel.toUpperCase()} transmise avec succès au ${account.guardianPhone} (${account.guardianName}).`,
      log: newLog,
    };
  };

  // Send Bulk Tuition Reminders
  const sendBulkTuitionReminders = (
    studentIds: string[],
    channel: 'sms' | 'whatsapp' = 'sms'
  ) => {
    let count = 0;
    studentIds.forEach((sid) => {
      try {
        sendTuitionReminder(sid, undefined, channel);
        count++;
      } catch (e) {
        // continue
      }
    });

    return {
      success: true,
      sentCount: count,
      message: `${count} relances ${channel.toUpperCase()} envoyées avec succès aux familles en retard de paiement.`,
    };
  };

  // Factory Reset
  const resetSystemData = () => {
    if (typeof window !== 'undefined') {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    }
    setSchools(INITIAL_SCHOOLS);
    setAcademicYears(INITIAL_ACADEMIC_YEARS);
    setUsers(INITIAL_USERS);
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setRelations(INITIAL_RELATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAttendance(INITIAL_ATTENDANCE);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSchoolInquiries(INITIAL_SCHOOL_INQUIRIES);
    setTuitionAccounts(INITIAL_TUITION_ACCOUNTS);
    setPaymentTransactions(INITIAL_PAYMENT_TRANSACTIONS);
    setTuitionReminders(INITIAL_TUITION_REMINDERS);
    setCurrentSchoolId('school-1');
    setCurrentRole('director');
  };

  return (
    <SchoolContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        currentUserId,
        setCurrentUserId,
        currentSchool,
        setCurrentSchoolId,
        schools,
        users,
        isAuthenticated,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        login,
        signup,
        logout,
        resetPassword,
        isMobileDeviceView,
        setIsMobileDeviceView,
        academicYears,
        activeAcademicYear,
        createAcademicYear,
        activateAcademicYear,
        closeAcademicYear,
        updateSchoolConfig,
        createSchool,
        classes,
        addClass,
        updateClass,
        assignTeacherToClass,
        students,
        enrollStudent,
        transferStudentClass,
        createUser,
        updateUser,
        toggleUserStatus,
        relations,
        selectedChildId,
        setSelectedChildId,
        myChildren,
        requestParentChildLink,
        updateRelationStatus,
        announcements,
        publishAnnouncement,
        markAnnouncementAsRead,
        attendance,
        recordAttendance,
        submitAbsenceJustification,
        reviewAbsenceJustification,
        schoolInquiries,
        submitSchoolInquiry,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        tuitionAccounts,
        paymentTransactions,
        tuitionReminders,
        processOnlineTuitionPayment,
        recordManualTuitionPayment,
        sendTuitionReminder,
        sendBulkTuitionReminders,
        saasPlans: SAAS_PLANS,
        updateSchoolPlan,
        resetSystemData,
        resetDemoData: resetSystemData,
        isHydrated,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
}
