"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Building2,
  GraduationCap,
  Mail,
  Menu,
  Pencil,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
  RefreshCw,
  UserRound,
  ChevronDown,
} from "lucide-react";

const EMPTY_FORM = { name: "", email: "", phone: "", department: "" };

function StatCard({ icon: Icon, label, value, detail, tone }) {
  const tones = {
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    violet: "bg-violet-50 text-violet-600 ring-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{detail}</p>
        </div>
        <div className={`rounded-xl p-3 ring-1 ${tones[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function StudentForm({ form, setForm, editingId, submitting, onSubmit, onCancel }) {
  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-semibold text-slate-700">
        Full name
        <input className={fieldClass} name="name" value={form.name} onChange={update} placeholder="e.g. Ayesha Rahman" minLength={2} maxLength={100} required />
      </label>
      <label className="text-sm font-semibold text-slate-700">
        Email address
        <input className={fieldClass} type="email" name="email" value={form.email} onChange={update} placeholder="student@example.com" required />
      </label>
      <label className="text-sm font-semibold text-slate-700">
        Phone number
        <input className={fieldClass} type="tel" name="phone" value={form.phone} onChange={update} placeholder="+880 1XXXXXXXXX" minLength={6} maxLength={25} required />
      </label>
      <label className="text-sm font-semibold text-slate-700">
        Department
        <input className={fieldClass} name="department" value={form.department} onChange={update} placeholder="e.g. Computer Science" maxLength={100} required />
      </label>
      <div className="flex flex-wrap gap-3 pt-1 sm:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={17} />}
          {submitting ? "Saving..." : editingId ? "Save changes" : "Add student"}
        </button>
        {editingId && (
          <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
}

export default function Home() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const response = await fetch("/api/students", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to fetch students.");
      }
      setStudents(result.data);
    } catch (error) {
      setPageError(error.message || "Could not connect to the local database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const departments = useMemo(
    () => [...new Set(students.map((student) => student.department))].sort(),
    [students]
  );

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        !query ||
        [student.name, student.email, student.phone, student.department]
          .some((value) => value.toLowerCase().includes(query));
      const matchesDepartment =
        departmentFilter === "All" || student.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [students, search, departmentFilter]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
  }

  function startEdit(student) {
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
    });
    setEditingId(student._id);
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const response = await fetch(
        editingId ? `/api/students/${editingId}` : "/api/students",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save student.");
      }

      resetForm();
      notify(editingId ? "Student details updated." : "Student added successfully.");
      await fetchStudents();
    } catch (error) {
      setFormError(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(student) {
    const confirmed = window.confirm(`Delete ${student.name}? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/students/${student._id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete student.");
      }
      if (editingId === student._id) resetForm();
      notify("Student deleted.");
      await fetchStudents();
    } catch (error) {
      setPageError(error.message || "Delete failed.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7ff]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-32 top-64 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
      </div>

      {toast && (
        <div role="status" className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 shadow-xl">
          <ShieldCheck size={19} />
          {toast}
          <button onClick={() => setToast("")} aria-label="Dismiss notification"><X size={16} /></button>
        </div>
      )}

      <div className="relative mx-auto flex min-h-screen max-w-[1440px]">
        <aside className={`${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white px-6 py-7 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0`}>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={27} />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-slate-900">StudentHub</p>
              <p className="text-xs text-slate-400">Academic workspace</p>
            </div>
          </div>

          <p className="mb-3 mt-12 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
          <div className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 font-semibold text-indigo-700">
            <BookOpen size={19} />
            Dashboard
          </div>

          <div className="mt-auto rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold">Local development</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Your student records are stored in your local MongoDB database.
            </p>
          </div>
        </aside>

        {mobileMenuOpen && (
          <button aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" />
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:px-10 lg:py-10">
          <header className="mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenuOpen(true)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 lg:hidden" aria-label="Open navigation">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-500">Overview</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Student dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">Manage your student records in one place.</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              MongoDB Local
            </div>
          </header>

          <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard icon={Users} label="Total students" value={students.length} detail="All registered records" tone="indigo" />
            <StatCard icon={Building2} label="Departments" value={departments.length} detail="Departments represented" tone="violet" />
            <StatCard icon={UserRound} label="Filtered results" value={filteredStudents.length} detail="Matching your current search" tone="emerald" />
          </section>

          <section className="mb-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className={`rounded-xl p-2.5 ${editingId ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
                {editingId ? <Pencil size={20} /> : <Plus size={21} />}
              </div>
              <div>
                <h2 className="font-bold text-slate-900">{editingId ? "Edit student" : "Add a student"}</h2>
                <p className="text-xs text-slate-400">Enter the student's information below.</p>
              </div>
            </div>

            {formError && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</p>}
            <StudentForm
              form={form}
              setForm={setForm}
              editingId={editingId}
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="font-bold text-slate-900">Student directory</h2>
                <p className="mt-1 text-xs text-slate-400">{filteredStudents.length} of {students.length} students</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative block">
                  <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search students..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 sm:w-56"
                  />
                </label>
                <label className="relative block">
                  <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-9 text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 sm:w-52">
                    <option value="All">All departments</option>
                    {departments.map((department) => <option key={department} value={department}>{department}</option>)}
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </label>
                <button onClick={fetchStudents} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" title="Refresh students">
                  <RefreshCw size={16} /> <span className="sm:hidden">Refresh</span>
                </button>
              </div>
            </div>

            {pageError && (
              <div role="alert" className="m-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <p className="font-semibold">Could not connect to the student API.</p>
                <p className="mt-1">{pageError}</p>
                <p className="mt-2 text-xs">Check that MongoDB Community Server is running and that MONGODB_URI is set in .env.local.</p>
                <button onClick={fetchStudents} className="mt-3 font-semibold underline">Try again</button>
              </div>
            )}

            {loading ? (
              <div className="space-y-3 p-6">
                {[1, 2, 3].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                  <Users size={26} />
                </div>
                <h3 className="mt-4 font-bold text-slate-800">{search || departmentFilter !== "All" ? "No matching students" : "No students yet"}</h3>
                <p className="mt-1 text-sm text-slate-400">{search || departmentFilter !== "All" ? "Try changing your search or filter." : "Add your first student using the form above."}</p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-6 py-4 font-bold">Student</th>
                        <th className="px-6 py-4 font-bold">Contact details</th>
                        <th className="px-6 py-4 font-bold">Department</th>
                        <th className="px-6 py-4 font-bold">Added</th>
                        <th className="px-6 py-4 text-center font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((student) => (
                        <tr key={student._id} className="transition hover:bg-indigo-50/30">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">{student.name.charAt(0).toUpperCase()}</div>
                              <span className="font-semibold text-slate-800">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="flex items-center gap-2 text-sm text-slate-700"><Mail size={14} className="text-slate-400" />{student.email}</p>
                            <p className="mt-1 flex items-center gap-2 text-xs text-slate-400"><Phone size={13} />{student.phone}</p>
                          </td>
                          <td className="px-6 py-4"><span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">{student.department}</span></td>
                          <td className="px-6 py-4 text-xs text-slate-500">{new Date(student.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => startEdit(student)} aria-label={`Edit ${student.name}`} className="rounded-lg bg-amber-50 p-2 text-amber-700 transition hover:bg-amber-100"><Pencil size={16} /></button>
                              <button onClick={() => handleDelete(student)} aria-label={`Delete ${student.name}`} className="rounded-lg bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-3 p-4 md:hidden">
                  {filteredStudents.map((student) => (
                    <article key={student._id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">{student.name.charAt(0).toUpperCase()}</div>
                          <div className="min-w-0"><h3 className="truncate font-semibold text-slate-800">{student.name}</h3><p className="truncate text-xs text-slate-400">{student.department}</p></div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(student)} aria-label={`Edit ${student.name}`} className="rounded-lg bg-amber-50 p-2 text-amber-700"><Pencil size={15} /></button>
                          <button onClick={() => handleDelete(student)} aria-label={`Delete ${student.name}`} className="rounded-lg bg-rose-50 p-2 text-rose-600"><Trash2 size={15} /></button>
                        </div>
                      </div>
                      <p className="mt-3 flex items-center gap-2 break-all text-sm text-slate-600"><Mail size={14} className="shrink-0 text-slate-400" />{student.email}</p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-600"><Phone size={14} className="shrink-0 text-slate-400" />{student.phone}</p>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>

          <footer className="py-8 text-center text-xs text-slate-400">
            StudentHub · Built with Next.js, Tailwind CSS, MongoDB & Mongoose
          </footer>
        </main>
      </div>
    </div>
  );
}
