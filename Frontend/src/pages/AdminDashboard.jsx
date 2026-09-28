import React, { useState, useEffect, useCallback } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import DepartmentCard from '../components/admin/DepartmentCard';
import YearPills from '../components/admin/YearPills';
import StudentsTable from '../components/admin/StudentsTable';
import ProfessorsTable from '../components/admin/ProfessorsTable';
import SubjectsTable from '../components/admin/SubjectsTable';
import AssignProfessorModal from '../components/admin/AssignProfessorModal';
import CreateSubjectModal from '../components/admin/CreateSubjectModal';
import EditSubjectModal from '../components/admin/EditSubjectModal';
import ConfirmDeleteModal from '../components/admin/ConfirmDeleteModal';
import { DEPARTMENTS, YEARS, getDepartmentName, getYearLabel } from '../constants/academic';
import { adminApi, extractErrorMessage } from '../services/api';

const TABS = [
  { id: 'students', label: 'Students' },
  { id: 'professors', label: 'Professors' },
  { id: 'subjects', label: 'Subjects' },
];

export default function AdminDashboard({
  onLogout,
  darkMode,
  onToggleDarkMode,
  onToast,
}) {
  // Current filters
  const [selectedDepartment, setSelectedDepartment] = useState('COMPUTER_SCIENCE');
  const [selectedYear, setSelectedYear] = useState(1);
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'professors' | 'subjects'

  // Data lists
  const [students, setStudents] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Loading states
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [professorsLoading, setProfessorsLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  // Errors for tabs
  const [studentsError, setStudentsError] = useState('');
  const [professorsError, setProfessorsError] = useState('');
  const [subjectsError, setSubjectsError] = useState('');

  // Modals state
  const [assignModal, setAssignModal] = useState({ isOpen: false, subject: null });
  const [isCreateSubjectOpen, setIsCreateSubjectOpen] = useState(false);
  const [editSubjectModal, setEditSubjectModal] = useState({ isOpen: false, subject: null });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: 'student', // 'student' | 'professor' | 'subject'
    item: null,
    loading: false,
  });

  // Current human-readable labels
  const departmentName = getDepartmentName(selectedDepartment);
  const yearLabel = getYearLabel(selectedYear);

  // Global listener for non-401 API errors (400, 404, 500) to ensure toast notification
  useEffect(() => {
    function handleApiError(e) {
      if (e.detail?.status !== 401 && e.detail?.message) {
        onToast?.({ type: 'error', message: e.detail.message });
      }
    }
    window.addEventListener('campus-hub:api-error', handleApiError);
    return () => window.removeEventListener('campus-hub:api-error', handleApiError);
  }, [onToast]);

  // -------------------------------------------------------------
  // Data Fetching Functions
  // -------------------------------------------------------------

  const fetchStudents = useCallback(async (deptCode, yr) => {
    setStudentsLoading(true);
    setStudentsError('');
    try {
      const data = await adminApi.getStudents(deptCode, yr);
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      // 401 is caught by api service; for 400/404/500 show server message
      const msg = extractErrorMessage(err, 'Failed to fetch students.');
      setStudentsError(msg);
      onToast?.({ type: 'error', message: msg });
    } finally {
      setStudentsLoading(false);
    }
  }, [onToast]);

  const fetchProfessors = useCallback(async (deptCode) => {
    setProfessorsLoading(true);
    setProfessorsError('');
    try {
      const data = await adminApi.getProfessors(deptCode);
      setProfessors(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to fetch professors.');
      setProfessorsError(msg);
      onToast?.({ type: 'error', message: msg });
    } finally {
      setProfessorsLoading(false);
    }
  }, [onToast]);

  const fetchSubjects = useCallback(async (deptCode, yr) => {
    setSubjectsLoading(true);
    setSubjectsError('');
    try {
      const data = await adminApi.getSubjects(deptCode, yr);
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to fetch subjects.');
      setSubjectsError(msg);
      onToast?.({ type: 'error', message: msg });
    } finally {
      setSubjectsLoading(false);
    }
  }, [onToast]);

  // Sync data whenever department or year changes
  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents(selectedDepartment, selectedYear);
    } else if (activeTab === 'professors') {
      fetchProfessors(selectedDepartment);
    } else if (activeTab === 'subjects') {
      fetchSubjects(selectedDepartment, selectedYear);
    }
  }, [selectedDepartment, selectedYear, activeTab, fetchStudents, fetchProfessors, fetchSubjects]);

  // Tab switch handler
  function handleTabChange(tabId) {
    setActiveTab(tabId);
    if (tabId === 'students') {
      fetchStudents(selectedDepartment, selectedYear);
    } else if (tabId === 'professors') {
      fetchProfessors(selectedDepartment);
    } else if (tabId === 'subjects') {
      fetchSubjects(selectedDepartment, selectedYear);
    }
  }

  // -------------------------------------------------------------
  // Assign & Unassign Flow
  // -------------------------------------------------------------

  function handleAssignRequest(subject) {
    setAssignModal({ isOpen: true, subject });
  }

  function handleAssignSuccess(updatedSubject) {
    setSubjects((prev) =>
      prev.map((s) => (s.id === updatedSubject.id ? { ...s, ...updatedSubject } : s))
    );
    onToast?.({
      type: 'success',
      message: `Assigned ${updatedSubject.professorName} to "${updatedSubject.title}".`,
    });
  }

  async function handleUnassignRequest(subject) {
    try {
      const result = await adminApi.unassignProfessor(subject.id);
      setSubjects((prev) =>
        prev.map((s) =>
          s.id === subject.id ? { ...s, professorName: 'Unassigned', ...(result || {}) } : s
        )
      );
      onToast?.({
        type: 'success',
        message: `Professor unassigned from "${subject.title}".`,
      });
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to unassign professor.');
      onToast?.({ type: 'error', message: msg });
    }
  }

  // -------------------------------------------------------------
  // Create & Update Subject Flow
  // -------------------------------------------------------------

  function handleCreateSubjectSuccess(newSubject) {
    // If newly created subject matches current department and year filter, add to table
    const deptMatch =
      newSubject.department === departmentName ||
      newSubject.department === selectedDepartment;
    const yearMatch = Number(newSubject.year) === Number(selectedYear);

    if (deptMatch && yearMatch) {
      setSubjects((prev) => [...prev, newSubject]);
    } else {
      // Re-fetch current view to ensure consistency
      fetchSubjects(selectedDepartment, selectedYear);
    }

    onToast?.({
      type: 'success',
      message: `Subject "${newSubject.title}" created successfully.`,
    });
  }

  function handleUpdateRequest(subject) {
    setEditSubjectModal({ isOpen: true, subject });
  }

  function handleUpdateSuccess(updatedSubject) {
    setSubjects((prev) =>
      prev.map((s) => (s.id === updatedSubject.id ? { ...s, ...updatedSubject } : s))
    );
    // Refresh to handle cases where department or year was moved
    fetchSubjects(selectedDepartment, selectedYear);
    onToast?.({
      type: 'success',
      message: `Subject "${updatedSubject.title}" updated successfully.`,
    });
  }

  // -------------------------------------------------------------
  // Delete Flow
  // -------------------------------------------------------------

  function handleDeletePrompt(type, item) {
    setDeleteModal({
      isOpen: true,
      type,
      item,
      loading: false,
    });
  }

  async function handleConfirmDelete() {
    const { type, item } = deleteModal;
    if (!item) return;

    setDeleteModal((prev) => ({ ...prev, loading: true }));

    try {
      if (type === 'student') {
        await adminApi.deleteStudent(item.id);
        setStudents((prev) => prev.filter((s) => s.id !== item.id));
        onToast?.({
          type: 'success',
          message: `Student "${item.name}" deleted.`,
        });
      } else if (type === 'professor') {
        await adminApi.deleteProfessor(item.id);
        setProfessors((prev) => prev.filter((p) => p.id !== item.id));
        onToast?.({
          type: 'success',
          message: `Professor "${item.name}" deleted.`,
        });
      } else if (type === 'subject') {
        await adminApi.deleteSubject(item.id);
        setSubjects((prev) => prev.filter((s) => s.id !== item.id));
        onToast?.({
          type: 'success',
          message: `Subject "${item.title}" deleted.`,
        });
      }

      setDeleteModal({ isOpen: false, type: 'student', item: null, loading: false });
    } catch (err) {
      const msg = extractErrorMessage(err, `Failed to delete ${type}.`);
      onToast?.({ type: 'error', message: msg });
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  }

  return (
    <div className="min-h-screen bg-canvas dark:bg-slate-950 font-body text-ink dark:text-slate-100 antialiased transition-colors pb-16">
      {/* Top Navbar */}
      <AdminHeader
        onLogout={onLogout}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 animate-riseIn">
        {/* Page Banner / Title */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-white">
              Campus Management Dashboard
            </h1>
            <p className="mt-1 text-sm text-ink-muted dark:text-slate-400">
              Manage departments, student enrollments, faculty assignments, and curriculum.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-medium text-ink-muted dark:text-slate-300 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Connected: <strong className="text-ink dark:text-white ml-0.5">{departmentName}</strong>
            </span>
          </div>
        </div>

        {/* Section 1: Department Selection (5 cards) */}
        <section aria-labelledby="dept-section-title" className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2
              id="dept-section-title"
              className="font-display text-sm font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400"
            >
              Select Engineering Department
            </h2>
            <span className="text-xs text-ink-faint dark:text-slate-500">
              5 Departments Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {DEPARTMENTS.map((dept) => (
              <DepartmentCard
                key={dept.code}
                department={dept}
                isSelected={selectedDepartment === dept.code}
                onSelect={(code) => setSelectedDepartment(code)}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Year Filter Pills & Tab Navigation */}
        <div className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
          {/* Year Pills Filter */}
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <YearPills
              selectedYear={selectedYear}
              onSelectYear={(yr) => setSelectedYear(yr)}
              disabled={activeTab === 'professors'}
            />
          </div>

          {/* Tab Selector: Students | Professors | Subjects */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Management sections"
              className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 p-1 w-full sm:w-96"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => handleTabChange(tab.id)}
                    className={`rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all duration-150 outline-none
                      ${
                        isActive
                          ? 'bg-white dark:bg-slate-900 text-primary dark:text-accent shadow-sm'
                          : 'text-ink-muted dark:text-slate-400 hover:text-ink dark:hover:text-white'
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-ink-muted dark:text-slate-400">
              Showing data for: <strong className="text-primary dark:text-accent">{departmentName}</strong>
              {activeTab !== 'professors' && (
                <> • <strong className="text-ink dark:text-white">{yearLabel}</strong></>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Active Tab Content */}
        <section aria-label={`${activeTab} management`} className="animate-riseIn">
          {activeTab === 'students' && (
            <StudentsTable
              students={students}
              loading={studentsLoading}
              error={studentsError}
              departmentName={departmentName}
              yearLabel={yearLabel}
              onDeleteRequest={(student) => handleDeletePrompt('student', student)}
            />
          )}

          {activeTab === 'professors' && (
            <ProfessorsTable
              professors={professors}
              loading={professorsLoading}
              error={professorsError}
              departmentName={departmentName}
              onDeleteRequest={(professor) => handleDeletePrompt('professor', professor)}
            />
          )}

          {activeTab === 'subjects' && (
            <SubjectsTable
              subjects={subjects}
              loading={subjectsLoading}
              error={subjectsError}
              departmentName={departmentName}
              yearLabel={yearLabel}
              onOpenCreateModal={() => setIsCreateSubjectOpen(true)}
              onAssignRequest={handleAssignRequest}
              onUnassignRequest={handleUnassignRequest}
              onUpdateRequest={handleUpdateRequest}
              onDeleteRequest={(subject) => handleDeletePrompt('subject', subject)}
            />
          )}
        </section>
      </main>

      {/* Modals */}
      <AssignProfessorModal
        isOpen={assignModal.isOpen}
        subject={assignModal.subject}
        departmentCode={selectedDepartment}
        departmentName={departmentName}
        onClose={() => setAssignModal({ isOpen: false, subject: null })}
        onAssignSuccess={handleAssignSuccess}
        onToast={onToast}
      />

      <CreateSubjectModal
        isOpen={isCreateSubjectOpen}
        initialDepartmentCode={selectedDepartment}
        initialYear={selectedYear}
        onClose={() => setIsCreateSubjectOpen(false)}
        onCreateSuccess={handleCreateSubjectSuccess}
      />

      <EditSubjectModal
        isOpen={editSubjectModal.isOpen}
        subject={editSubjectModal.subject}
        currentDepartmentCode={selectedDepartment}
        currentYear={selectedYear}
        onClose={() => setEditSubjectModal({ isOpen: false, subject: null })}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title={
          deleteModal.type === 'student'
            ? 'Delete Student Record'
            : deleteModal.type === 'professor'
            ? 'Delete Faculty Member'
            : 'Delete Course Subject'
        }
        itemType={
          deleteModal.type === 'student'
            ? 'Student'
            : deleteModal.type === 'professor'
            ? 'Professor'
            : 'Subject'
        }
        itemName={
          deleteModal.item
            ? deleteModal.item.name || deleteModal.item.title
            : ''
        }
        loading={deleteModal.loading}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          !deleteModal.loading &&
          setDeleteModal({ isOpen: false, type: 'student', item: null, loading: false })
        }
      />
    </div>
  );
}
