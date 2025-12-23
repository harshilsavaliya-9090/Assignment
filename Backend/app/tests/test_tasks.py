import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:123@localhost:5432/taskmanager_test"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def get_auth_token(email="test@example.com", password="password123"):
    client.post("/auth/signup", json={"email": email, "password": password})
    response = client.post("/auth/login", json={"email": email, "password": password})
    return response.json()["access_token"]

def test_create_task_success(test_db):
    token = get_auth_token()
    response = client.post("/tasks", json={"title": "Test Task", "description": "Test Description"}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["completed"] == False

def test_create_task_without_auth(test_db):
    response = client.post("/tasks", json={"title": "Test Task"})
    assert response.status_code == 403

def test_get_all_tasks(test_db):
    token = get_auth_token()
    client.post("/tasks", json={"title": "Task 1"}, headers={"Authorization": f"Bearer {token}"})
    client.post("/tasks", json={"title": "Task 2"}, headers={"Authorization": f"Bearer {token}"})
    response = client.get("/tasks", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json()) == 2

def test_update_task_status(test_db):
    token = get_auth_token()
    create_response = client.post("/tasks", json={"title": "Test Task"}, headers={"Authorization": f"Bearer {token}"})
    task_id = create_response.json()["id"]
    response = client.put(f"/tasks/{task_id}", json={"completed": True}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["completed"] == True

def test_delete_task_success(test_db):
    token = get_auth_token()
    create_response = client.post("/tasks", json={"title": "Test Task"}, headers={"Authorization": f"Bearer {token}"})
    task_id = create_response.json()["id"]
    response = client.delete(f"/tasks/{task_id}", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 204

def test_cannot_access_other_users_task(test_db):
    token1 = get_auth_token("user1@example.com", "password123")
    token2 = get_auth_token("user2@example.com", "password123")
    create_response = client.post("/tasks", json={"title": "User1 Task"}, headers={"Authorization": f"Bearer {token1}"})
    task_id = create_response.json()["id"]
    response = client.put(f"/tasks/{task_id}", json={"completed": True}, headers={"Authorization": f"Bearer {token2}"})
    assert response.status_code == 404