const DATA_KEY = 'campusData';
const USER_KEY = 'currentUser';

const seedData = {
    teachers: [
        { id: 1, name: 'Emma Khan', department: 'Computer Science', subject: 'Data Structures', email: 'teacher123@gmail.com', password: 'teach123' },
        { id: 2, name: 'Jonah Park', department: 'Business', subject: 'Marketing', email: 'jonah@campus.edu', password: 'teach123' },
        { id: 3, name: 'Riya Patel', department: 'Engineering', subject: 'Thermodynamics', email: 'riya@campus.edu', password: 'teach123' },
        { id: 4, name: 'Rahul Jain', department: 'Computer Science', subject: 'Operating Systems', email: 'rahul@campus.edu', password: 'teach123' },
        { id: 5, name: 'Anurag Sharma', department: 'Mathematics', subject: 'Linear Algebra', email: 'anurag@campus.edu', password: 'teach123' },
        { id: 6, name: 'R.K. Sharma', department: 'Physics', subject: 'Electromagnetics', email: 'rksharma@campus.edu', password: 'teach123' },
        { id: 7, name: 'Amit Rawat', department: 'Business', subject: 'Finance', email: 'amit@campus.edu', password: 'teach123' }
    ],
    students: [],
    appointments: [],
    messages: []
};

export function loadData() {
    const saved = localStorage.getItem(DATA_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    const initialData = JSON.parse(JSON.stringify(seedData));
    localStorage.setItem(DATA_KEY, JSON.stringify(initialData));
    return initialData;
}

export function saveData(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function loadCurrentUser() {
    const saved = sessionStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
}

export function saveCurrentUser(user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
    sessionStorage.removeItem(USER_KEY);
}
