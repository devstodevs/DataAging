```bash
backend/
│
├── src/
│   ├── main.py                # Entry point for FastAPI app
│   ├── config.py              # Settings/configuration
│   ├── models/                # Pydantic models & ORM models
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/               # Request/response schemas
│   │   ├── __init__.py
│   │   └── user.py
│   ├── api/                   # Routers/endpoints
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── user.py
│   ├── core/                  # Core logic (security, utils, etc.)
│   │   ├── __init__.py
│   │   ├── security.py
│   │   └── utils.py
│   ├── services/              # Business logic/services
│   │   ├── __init__.py
│   │   └── user_service.py
│   ├── db/                    # Database session and CRUD
│   │   ├── __init__.py
│   │   ├── base.py
│   │   └── user_crud.py
│   └── tests/                 # Unit and integration tests
│       ├── __init__.py
│       └── test_auth.py
│
├── requirements.txt           # Python dependencies
└── README.md                  # Project documentation
```