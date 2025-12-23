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

def test_signup_success(test_db):
    response = client.post("/auth/signup", json={"email": "test@example.com", "password": "password123"})
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_signup_duplicate_email(test_db):
    client.post("/auth/signup", json={"email": "test@example.com", "password": "password123"})
    response = client.post("/auth/signup", json={"email": "test@example.com", "password": "password456"})
    assert response.status_code == 400

def test_login_success(test_db):
    client.post("/auth/signup", json={"email": "test@example.com", "password": "password123"})
    response = client.post("/auth/login", json={"email": "test@example.com", "password": "password123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(test_db):
    client.post("/auth/signup", json={"email": "test@example.com", "password": "password123"})
    response = client.post("/auth/login", json={"email": "test@example.com", "password": "wrongpassword"})
    assert response.status_code == 401