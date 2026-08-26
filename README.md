### Secure User Authentication System

## Project Overview

This project implements a **secure user authentication system** with features like user registration, login, and protected routes. It ensures that only authenticated users can access certain parts of the application.

The system follows standard security practices such as password hashing and session management to keep user data safe.

##  Features

*  User Registration (Sign Up)
*  Secure Login System
*  Password Hashing for security
*  Session Management
*  Protected Routes (accessible only after login)
*  Logout functionality
*  Optional: Role-Based Access Control (Admin/User)

## Tech Stack

* **Backend:** Python (Flask)
* **Frontend:** HTML, CSS (Jinja Templates)
* **Database:** SQLite
* **Security:** Werkzeug (Password Hashing)
```
## Project Structure

│── instance/
│── public/
│   ├── app.js
│   ├── index.html
│   └── style.css
│── README.md
```
## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/yourusername/task-2-project.git
cd task-2-project
```

### Create virtual environment (recommended)

```bash
python -m venv venv
venv\Scripts\activate   # Windows
```

### Install dependencies

```bash
pip install flask
```

---

##  Running the Application

```bash
python app.py
```

Open your browser and go to:

```
http://127.0.0.1:5000/
```

---

##  How It Works

* Users register with a username and password.
* Passwords are **hashed** before storing in the database.
* On login, credentials are verified securely.
* A session is created for authenticated users.
* Protected routes check if the user is logged in before granting access.
