# Task Management System

This project is a full-stack task management system built using:

- Python
- FastAPI
- React
- PostgreSQL

---

## Project Structure

```
Assignment/
├── Backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── dependencies.py
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   └── tasks.py
│   │   └── tests/
│   │       ├── test_auth.py
│   │       └── test_tasks.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── Frontend/
│   └── task-management-frontend/
│       ├── public/
│       │   └── index.html
│       │
│       ├── src/
│       │   ├── components/
│       │   │   ├── Login.jsx
│       │   │   ├── Signup.jsx
│       │   │   └── TaskList.jsx
│       │   │
│       │   ├── context/
│       │   │   └── AuthContext.jsx
│       │   │
│       │   ├── services/
│       │   │   └── api.js
│       │   │
│       │   ├── setupTests.jsx
│       │   ├── App.jsx
│       │   └── main.jsx
│       │
│       ├── .env
│       ├── package.json
│       ├── jest.config.js
│       └── vite.config.js
│
└── README.md
```

---

## How to Run the Project

### 1. Download the Project

```bash
git clone <repository-url>
cd Assignment
```

### 2. Configure Environment Variables

Update the `.env` files in both **Backend** and **Frontend** according to your database configuration.

---

### 3. Run Backend

```bash
source venv/bin/activate
cd Backend
pip install -r requirements.txt
pytest
uvicorn app.main:app --reload
```

Backend will be available at:

```
http://127.0.0.1:8000
```

---

### 4. Run Frontend

```bash
cd ../Frontend/task-management-frontend
npm install
npm run dev
npm test
```

Frontend will be available at:

```
http://localhost:5173
```
