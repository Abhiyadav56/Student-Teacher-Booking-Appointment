# Student-Teacher-Booking-Appointment

## Overview
A simple web-based appointment system for campus interactions between students, teachers, and admins. It supports registration, login, appointment requests, approvals, and messaging.

## How It Works
1. Open `index.html` and log in with a role (Admin, Teacher, or Student).
2. Students must register first on `register.html`.
3. Admins approve student registrations before students can log in.

## Roles
- Admin: manages teachers and approves student registrations.
- Teacher: approves/cancels appointments and views messages.
- Student: searches teachers, books appointments, and sends messages.

## Typical Flow
1. Student registers on `register.html`.
2. Admin logs in and approves the student in **Approve Students**.
3. Student logs in and can book appointments or send messages.
4. Teacher logs in to approve or cancel appointments and review messages.

## Demo Admin Credentials
- Email: `admin123@gmail.com`
- Password: `admin123`

## Project Structure
- `index.html` - Login page
- `register.html` - Student registration page
- `Dashboard.html` - Main dashboard
- `js/` - Modular JavaScript
- `styles/` - Modular CSS

## Run
Open `index.html` in a browser. No build steps required.

## Author
Abhishek Yadav
