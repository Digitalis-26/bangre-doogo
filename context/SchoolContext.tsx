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
  isAuthenticated: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot') => void;
  login: (email: string, role?: UserRole) => { success: boolean; message: string };
  signup: (data: { name: string; email: string; phone: string; role: UserRole; schoolId: string }) => { success: boolean; message: string };
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

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;

  // SaaS Plans & Demo Reset
  saasPlans: SaaSPlan[];
  updateSchoolPlan: (schoolId: string, planId: 'free' | 'main' | 'advanced') => void;
  resetDemoData: () => void;
  isHydrated: boolean;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_PREFIX = 'ecoleconnect_v1_';

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('director');
  const [currentSchoolId, setCurrentSchoolId] = useState<string>('school-1');
  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
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

  // Current User based on Role
  const currentUser = useMemo(() => {
    const matchedUser = users.find(
      (u) => u.role === currentRole && (u.schoolId === currentSchool.id || u.schoolId === 'all')
    );
    if (matchedUser) return matchedUser;

    return {
      id: `user-${currentRole}-demo`,
      name:
        currentRole === 'director'
          ? 'Direction École'
          : currentRole === 'teacher'
          ? 'Enseignant Démo'
          : currentRole === 'parent'
          ? 'Parent d\'élève'
          : currentRole === 'secretary'
          ? 'Secrétaire de Scolarité'
          : 'Administrateur',
      email: `${currentRole}@ecoleconnect.bf`,
      phone: '+226 70 00 00 00',
      role: currentRole,
      schoolId: currentSchool.id,
      title: 'Compte Démonstration',
      status: 'active' as const,
    };
  }, [currentRole, currentSchool.id, users]);

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
  const login = (email: string, role?: UserRole) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (existing.status === 'suspended') {
        return { success: false, message: 'Ce compte est actuellement suspendu par la direction.' };
      }
      setCurrentRole(existing.role);
      if (existing.schoolId !== 'all') {
        setCurrentSchoolId(existing.schoolId);
      }
      setIsAuthenticated(true);
      return { success: true, message: `Connexion réussie en tant que ${existing.name} (${existing.role}).` };
    }

    if (role) {
      setCurrentRole(role);
      setIsAuthenticated(true);
      return { success: true, message: `Session démarrée avec le rôle ${role}.` };
    }

    return { success: false, message: 'Aucun compte associé à cet email. Vérifiez l\'adresse ou inscrivez-vous.' };
  };

  const signup = (data: { name: string; email: string; phone: string; role: UserRole; schoolId: string }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      schoolId: data.schoolId || currentSchool.id,
      status: 'active',
      title: data.role === 'teacher' ? 'Enseignant' : data.role === 'parent' ? 'Parent d\'élève' : 'Personnel Scolaire',
      lastLogin: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentRole(data.role);
    if (data.schoolId) setCurrentSchoolId(data.schoolId);
    setIsAuthenticated(true);
    return { success: true, message: `Compte créé avec succès pour ${data.name}. Bienvenue sur ÉcoleConnect !` };
  };

  const logout = () => {
    setIsAuthenticated(false);
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
  };

  const createSchool = (data: Omit<School, 'id' | 'classesCount' | 'studentsCount' | 'parentsCount'>): School => {
    const newSchool: School = {
      ...data,
      id: `school-${Date.now()}`,
      classesCount: 0,
      studentsCount: 0,
      parentsCount: 0,
    };
    setSchools((prev) => [...prev, newSchool]);
    setCurrentSchoolId(newSchool.id);
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

  // Plan
  const updateSchoolPlan = (schoolId: string, planId: 'free' | 'main' | 'advanced') => {
    const fee = planId === 'free' ? 0 : planId === 'main' ? 10000 : 25000;
    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, plan: planId, monthlyFee: fee } : s))
    );
  };

  // Demo Reset
  const resetDemoData = () => {
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
    setCurrentSchoolId('school-1');
    setCurrentRole('director');
  };

  return (
    <SchoolContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
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
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        saasPlans: SAAS_PLANS,
        updateSchoolPlan,
        resetDemoData,
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
