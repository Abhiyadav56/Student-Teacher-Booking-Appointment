import {
    loadData,
    saveData,
    loadCurrentUser,
    saveCurrentUser,
    clearCurrentUser
} from './storage.js';
import {
    renderOverview,
    renderAddTeacher,
    renderManageTeachers,
    renderApproveStudents,
    renderStudents,
    renderAllAppointments,
    renderMessages,
    renderTeacherSchedule,
    renderTeacherAppointments,
    renderSearchTeacher,
    renderBookAppointment,
    renderStudentMessage
} from './views.js';

class AppointmentApp {
    constructor() {
        this.data = loadData();
        this.currentUser = loadCurrentUser();
    }

    setCurrentUser(user) {
        this.currentUser = user;
        saveCurrentUser(user);
    }

    clearCurrentUser() {
        this.currentUser = null;
        clearCurrentUser();
    }

    registerStudent() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const department = document.getElementById('department').value.trim();
        const year = document.getElementById('year').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!name || !email || !department || !year || !password) {
            alert('Please fill all fields.');
            return;
        }

        const exists = this.data.students.some(s => s.email === email);
        if (exists) {
            alert('Student already registered.');
            return;
        }

        const student = {
            id: Date.now(),
            name,
            email,
            department,
            year,
            password,
            approved: false
        };
        this.data.students.push(student);
        saveData(this.data);
        alert('Registration submitted. Wait for admin approval.');
        window.location.href = 'index.html';
    }

    login() {
        const role = document.getElementById('role').value;
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Enter email and password.');
            return;
        }

        if (role === 'admin') {
            if (email === 'admin123@gmail.com' && password === 'admin123') {
                this.setCurrentUser({ role: 'admin', name: 'Abhishek Yadav', email });
                window.location.href = 'Dashboard.html';
                return;
            }
        }

        if (role === 'teacher') {
            const teacher = this.data.teachers.find(t => t.email === email && t.password === password);
            if (teacher) {
                this.setCurrentUser({ role: 'teacher', id: teacher.id, name: teacher.name, email: teacher.email });
                window.location.href = 'Dashboard.html';
                return;
            }
        }

        if (role === 'student') {
            const student = this.data.students.find(s => s.email === email && s.password === password);
            if (student && student.approved) {
                this.setCurrentUser({ role: 'student', id: student.id, name: student.name, email: student.email });
                window.location.href = 'Dashboard.html';
                return;
            }
            if (student && !student.approved) {
                alert('Your registration is pending approval.');
                return;
            }
        }

        alert('Invalid credentials.');
    }

    logout() {
        this.clearCurrentUser();
        window.location.href = 'index.html';
    }

    initDashboard() {
        const container = document.getElementById('app');
        if (!container) return;

        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }

        container.innerHTML = `
            <div class="app-shell">
                <aside class="sidebar">
                    <div class="brand">Appointment Hub</div>
                    <div class="nav" id="nav"></div>
                    <button class="btn secondary logout" onclick="app.logout()">Logout</button>
                </aside>
                <main class="content">
                    <div class="page-title" id="pageTitle"></div>
                    <div id="pageContent"></div>
                </main>
            </div>
        `;

        this.buildNav();
        this.showSection('overview');
    }

    buildNav() {
        const nav = document.getElementById('nav');
        if (!nav) return;

        const sections = this.currentUser.role === 'admin'
            ? [
                { id: 'overview', label: 'Dashboard' },
                { id: 'teachers', label: 'Add Teacher' },
                { id: 'manageTeachers', label: 'Update/Delete Teacher' },
                { id: 'students', label: 'View Students' },
                { id: 'approveStudents', label: 'Approve Students' },
                { id: 'appointments', label: 'View All Appointments' },
                { id: 'messages', label: 'View Messages' }
            ]
            : this.currentUser.role === 'teacher'
                ? [
                    { id: 'overview', label: 'Dashboard' },
                    { id: 'schedule', label: 'Schedule Appointment' },
                    { id: 'teacherAppointments', label: 'Approve/Cancel' },
                    { id: 'messages', label: 'View Messages' },
                    { id: 'appointments', label: 'View All Appointments' }
                ]
                : [
                    { id: 'overview', label: 'Dashboard' },
                    { id: 'search', label: 'Search Teacher' },
                    { id: 'book', label: 'Book Appointment' },
                    { id: 'studentMessages', label: 'Send Message' }
                ];

        nav.innerHTML = sections.map(section => `
            <button onclick="app.showSection('${section.id}')" id="nav-${section.id}">${section.label}</button>
        `).join('');
    }

    showSection(sectionId) {
        const pageTitle = document.getElementById('pageTitle');
        const pageContent = document.getElementById('pageContent');
        if (!pageTitle || !pageContent) return;

        document.querySelectorAll('.nav button').forEach(btn => btn.classList.remove('active'));
        const active = document.getElementById(`nav-${sectionId}`);
        if (active) active.classList.add('active');

        const sectionsMap = {
            overview: () => renderOverview({ data: this.data, currentUser: this.currentUser }),
            teachers: () => renderAddTeacher(),
            manageTeachers: () => renderManageTeachers({ data: this.data }),
            students: () => renderStudents({ data: this.data }),
            approveStudents: () => renderApproveStudents({ data: this.data }),
            appointments: () => renderAllAppointments({ data: this.data, currentUser: this.currentUser }),
            messages: () => renderMessages({ data: this.data, currentUser: this.currentUser }),
            schedule: () => renderTeacherSchedule(),
            teacherAppointments: () => renderTeacherAppointments({ data: this.data, currentUser: this.currentUser }),
            search: () => renderSearchTeacher({ data: this.data }),
            book: () => renderBookAppointment({ data: this.data }),
            studentMessages: () => renderStudentMessage({ data: this.data })
        };

        const view = sectionsMap[sectionId];
        if (view) {
            const { title, html } = view();
            pageTitle.textContent = title;
            pageContent.innerHTML = html;
        }
    }

    addTeacher() {
        const name = document.getElementById('tName').value.trim();
        const department = document.getElementById('tDepartment').value.trim();
        const subject = document.getElementById('tSubject').value.trim();
        const email = document.getElementById('tEmail').value.trim();
        const password = document.getElementById('tPassword').value.trim();
        if (!name || !department || !subject || !email || !password) {
            alert('Fill all fields.');
            return;
        }
        this.data.teachers.push({ id: Date.now(), name, department, subject, email, password });
        saveData(this.data);
        alert('Teacher added.');
        this.showSection('manageTeachers');
    }

    editTeacher(id) {
        const teacher = this.data.teachers.find(t => t.id === id);
        if (!teacher) return;
        const department = prompt('Update department', teacher.department) || teacher.department;
        const subject = prompt('Update subject', teacher.subject) || teacher.subject;
        teacher.department = department;
        teacher.subject = subject;
        saveData(this.data);
        this.showSection('manageTeachers');
    }

    deleteTeacher(id) {
        this.data.teachers = this.data.teachers.filter(t => t.id !== id);
        saveData(this.data);
        this.showSection('manageTeachers');
    }

    approveStudent(id) {
        const student = this.data.students.find(s => s.id === id);
        if (student) {
            student.approved = true;
            saveData(this.data);
            this.showSection('approveStudents');
        }
    }

    updateAppointment(id, status) {
        const appt = this.data.appointments.find(a => a.id === id);
        if (appt) {
            appt.status = status;
            saveData(this.data);
            this.showSection('teacherAppointments');
        }
    }

    bookAppointment() {
        const teacherId = parseInt(document.getElementById('apptTeacher').value, 10);
        const date = document.getElementById('apptDate').value;
        const time = document.getElementById('apptTime').value;
        const purpose = document.getElementById('apptPurpose').value.trim();

        if (!teacherId || !date || !time || !purpose) {
            alert('Fill all fields.');
            return;
        }

        const teacher = this.data.teachers.find(t => t.id === teacherId);
        this.data.appointments.push({
            id: Date.now(),
            teacherId,
            teacherName: teacher.name,
            studentId: this.currentUser.id,
            studentName: this.currentUser.name,
            date,
            time,
            purpose,
            status: 'pending'
        });
        saveData(this.data);
        alert('Appointment submitted for approval.');
        this.showSection('book');
    }

    sendMessage() {
        const to = document.getElementById('messageTo').value;
        const message = document.getElementById('messageBody').value.trim();
        if (!to || !message) {
            alert('Fill all fields.');
            return;
        }
        this.data.messages.push({
            id: Date.now(),
            from: this.currentUser.email,
            to,
            message
        });
        saveData(this.data);
        alert('Message sent.');
        this.showSection('studentMessages');
    }
}

export const app = new AppointmentApp();
