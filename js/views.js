export function statusBadge(status) {
    if (status === 'approved') return '<span class="badge approved">Approved</span>';
    if (status === 'cancelled') return '<span class="badge cancelled">Cancelled</span>';
    return '<span class="badge pending">Pending</span>';
}

export function renderOverview({ data, currentUser }) {
    const metrics = [
        { label: 'Teachers', value: data.teachers.length },
        { label: 'Students', value: data.students.length },
        { label: 'Appointments', value: data.appointments.length },
        { label: 'Messages', value: data.messages.length }
    ];

    return {
        title: `Welcome, ${currentUser.name}`,
        html: `
            <div class="card">
                <h3>System Snapshot</h3>
                <div class="metric-grid">
                    ${metrics.map(m => `
                        <div class="metric-card">
                            <div class="metric-value">${m.value}</div>
                            <div class="metric-label">${m.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `
    };
}

export function renderAddTeacher() {
    return {
        title: 'Add Teacher',
        html: `
            <div class="card">
                <h3>New Teacher</h3>
                <div class="inline-form">
                    <input type="text" id="tName" placeholder="Name">
                    <input type="text" id="tDepartment" placeholder="Department">
                    <input type="text" id="tSubject" placeholder="Subject">
                    <input type="email" id="tEmail" placeholder="Email">
                    <input type="text" id="tPassword" placeholder="Password">
                </div>
                <div class="inline-actions">
                    <button class="btn primary" onclick="app.addTeacher()">Add Teacher</button>
                </div>
            </div>
        `
    };
}

export function renderManageTeachers({ data }) {
    const rows = data.teachers.map(t => `
        <tr>
            <td>${t.name}</td>
            <td>${t.department}</td>
            <td>${t.subject}</td>
            <td>${t.email}</td>
            <td>
                <button class="btn secondary" onclick="app.editTeacher(${t.id})">Edit</button>
                <button class="btn secondary" onclick="app.deleteTeacher(${t.id})">Delete</button>
            </td>
        </tr>
    `).join('');

    return {
        title: 'Update/Delete Teacher',
        html: `
            <div class="card">
                <h3>Teacher Directory</h3>
                <table class="table">
                    <thead>
                        <tr><th>Name</th><th>Department</th><th>Subject</th><th>Email</th><th>Actions</th></tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="5">No teachers found.</td></tr>'}</tbody>
                </table>
            </div>
        `
    };
}

export function renderApproveStudents({ data }) {
    const pending = data.students.filter(s => !s.approved);
    const rows = pending.map(s => `
        <tr>
            <td>${s.name}</td>
            <td>${s.department}</td>
            <td>${s.year}</td>
            <td>${s.email}</td>
            <td>
                <button class="btn secondary" onclick="app.approveStudent(${s.id})">Approve</button>
            </td>
        </tr>
    `).join('');

    return {
        title: 'Approve Registration Student',
        html: `
            <div class="card">
                <h3>Pending Students</h3>
                <table class="table">
                    <thead>
                        <tr><th>Name</th><th>Department</th><th>Year</th><th>Email</th><th>Action</th></tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="5">No pending registrations.</td></tr>'}</tbody>
                </table>
            </div>
        `
    };
}

export function renderStudents({ data }) {
    const rows = data.students.map(s => `
        <tr>
            <td>${s.name}</td>
            <td>${s.department}</td>
            <td>${s.year}</td>
            <td>${s.email}</td>
            <td>${s.approved ? 'Approved' : 'Pending'}</td>
        </tr>
    `).join('');

    return {
        title: 'View Students',
        html: `
            <div class="card">
                <h3>Student Directory</h3>
                <table class="table">
                    <thead>
                        <tr><th>Name</th><th>Department</th><th>Year</th><th>Email</th><th>Status</th></tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="5">No students registered.</td></tr>'}</tbody>
                </table>
            </div>
        `
    };
}

export function renderAllAppointments({ data, currentUser }) {
    const filtered = currentUser.role === 'teacher'
        ? data.appointments.filter(a => a.teacherId === currentUser.id)
        : data.appointments;
    const rows = filtered.map(a => `
        <tr>
            <td>${a.teacherName}</td>
            <td>${a.studentName}</td>
            <td>${a.date}</td>
            <td>${a.time}</td>
            <td>${statusBadge(a.status)}</td>
        </tr>
    `).join('');

    return {
        title: 'View All Appointments',
        html: `
            <div class="card">
                <h3>Appointments</h3>
                <table class="table">
                    <thead>
                        <tr><th>Teacher</th><th>Student</th><th>Date</th><th>Time</th><th>Status</th></tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="5">No appointments yet.</td></tr>'}</tbody>
                </table>
            </div>
        `
    };
}

export function renderMessages({ data, currentUser }) {
    const filtered = currentUser.role === 'teacher'
        ? data.messages.filter(m => m.to === currentUser.email)
        : data.messages;
    const rows = filtered.map(m => `
        <tr>
            <td>${m.from}</td>
            <td>${m.to}</td>
            <td>${m.message}</td>
        </tr>
    `).join('');

    return {
        title: 'View Messages',
        html: `
            <div class="card">
                <h3>Messages</h3>
                <table class="table">
                    <thead>
                        <tr><th>From</th><th>To</th><th>Message</th></tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="3">No messages yet.</td></tr>'}</tbody>
                </table>
            </div>
        `
    };
}

export function renderTeacherSchedule() {
    return {
        title: 'Schedule Appointment',
        html: `
            <div class="card">
                <h3>Availability Note</h3>
                <p>Students request appointments. Approve or cancel them in the next tab.</p>
            </div>
        `
    };
}

export function renderTeacherAppointments({ data, currentUser }) {
    const items = data.appointments.filter(a => a.teacherId === currentUser.id);
    const rows = items.map(a => `
        <tr>
            <td>${a.studentName}</td>
            <td>${a.date}</td>
            <td>${a.time}</td>
            <td>${statusBadge(a.status)}</td>
            <td>
                <button class="btn secondary" onclick="app.updateAppointment(${a.id}, 'approved')">Approve</button>
                <button class="btn secondary" onclick="app.updateAppointment(${a.id}, 'cancelled')">Cancel</button>
            </td>
        </tr>
    `).join('');

    return {
        title: 'Approve/Cancel Appointment',
        html: `
            <div class="card">
                <h3>Your Requests</h3>
                <table class="table">
                    <thead>
                        <tr><th>Student</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="5">No requests yet.</td></tr>'}</tbody>
                </table>
            </div>
        `
    };
}

export function renderSearchTeacher({ data }) {
    const rows = data.teachers.map(t => `
        <tr>
            <td>${t.name}</td>
            <td>${t.department}</td>
            <td>${t.subject}</td>
        </tr>
    `).join('');

    return {
        title: 'Search Teacher',
        html: `
            <div class="card">
                <h3>Teacher Directory</h3>
                <table class="table">
                    <thead>
                        <tr><th>Name</th><th>Department</th><th>Subject</th></tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="3">No teachers found.</td></tr>'}</tbody>
                </table>
            </div>
        `
    };
}

export function renderBookAppointment({ data }) {
    const options = data.teachers.map(t => `<option value="${t.id}">${t.name} (${t.subject})</option>`).join('');
    return {
        title: 'Book Appointment',
        html: `
            <div class="card">
                <h3>New Appointment</h3>
                <div class="inline-form">
                    <select id="apptTeacher">
                        <option value="">Select teacher</option>
                        ${options}
                    </select>
                    <input type="date" id="apptDate">
                    <input type="time" id="apptTime">
                    <input type="text" id="apptPurpose" placeholder="Purpose">
                </div>
                <div class="inline-actions">
                    <button class="btn primary" onclick="app.bookAppointment()">Submit Request</button>
                </div>
            </div>
        `
    };
}

export function renderStudentMessage({ data }) {
    const options = data.teachers.map(t => `<option value="${t.email}">${t.name}</option>`).join('');
    return {
        title: 'Send Message',
        html: `
            <div class="card">
                <h3>Message a Teacher</h3>
                <div class="inline-form">
                    <select id="messageTo">
                        <option value="">Select teacher</option>
                        ${options}
                    </select>
                    <input type="text" id="messageBody" placeholder="Message or purpose">
                </div>
                <div class="inline-actions">
                    <button class="btn primary" onclick="app.sendMessage()">Send Message</button>
                </div>
            </div>
        `
    };
}
