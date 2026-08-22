# Skillfolio

## Python backend

The FastAPI backend lives in `backend/` and exposes the passport, evidence, skills, and explainable matching APIs.

```powershell
C:/Users/ASUS/AppData/Local/Programs/Python/Python314/python.exe -m pip install -r backend/requirements.txt
C:/Users/ASUS/AppData/Local/Programs/Python/Python314/python.exe -m uvicorn backend.main:app --reload --port 8000
```

API docs: `http://localhost:8000/docs`

Run backend tests with:

```powershell
C:/Users/ASUS/AppData/Local/Programs/Python/Python314/python.exe -m pytest backend/test_main.py
```
