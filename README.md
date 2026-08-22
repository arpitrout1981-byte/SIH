# Skillfolio

## Python backend

Run the FastAPI backend from the repository root:

```powershell
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`

Run tests with `python -m pytest backend/test_main.py`.
