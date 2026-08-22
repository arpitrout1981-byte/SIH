from .models import Evidence, Match, Profile, Skill, SkillRequirement


profile = Profile(name="Admin", passport_id="SKP-2604821-IND", strength=82)

skills = [
    Skill(id="s1", name="Python", category="Technical", level=5, verified=True, evidence_ids=["ev-1", "ev-2"]),
    Skill(id="s2", name="SQL", category="Technical", level=4, verified=True, evidence_ids=["ev-1"]),
    Skill(id="s3", name="React.js", category="Technical", level=4, verified=True, evidence_ids=["ev-2"]),
    Skill(id="s4", name="Data Visualization", category="Domain Knowledge", level=4, verified=True, evidence_ids=["ev-3"]),
    Skill(id="s5", name="Team Leadership", category="Soft Skills", level=4, verified=True, evidence_ids=["ev-4"]),
    Skill(id="s6", name="Cloud Fundamentals (AWS)", category="Technical", level=2, verified=False, evidence_ids=["ev-5"]),
]

evidence = [
    Evidence(id="ev-1", title="Data Structures & Algorithms - Semester Coursework", type="course", source="ITER, Siksha 'O' Anusandhan", date="2026-05-14", status="Verified", skills=["Python", "SQL"], detail="Registrar-issued transcript with graded laboratory work."),
    Evidence(id="ev-2", title="Smart Attendance System - Capstone Project", type="project", source="ITER Capstone Review Board", date="2026-04-28", status="Verified", skills=["Python", "React.js"], detail="Reviewed capstone project with signed commit history."),
    Evidence(id="ev-3", title="Google Data Analytics Certificate", type="credential", source="Coursera / Google", date="2026-02-20", status="Verified", skills=["SQL", "Data Visualization"], detail="Professional certificate verified through the issuer API."),
    Evidence(id="ev-4", title="Smart India Hackathon - Finalist", type="competition", source="Ministry of Education, Govt. of India", date="2026-03-09", status="Verified", skills=["React.js", "Team Leadership"], detail="National finalist result with team contribution recorded."),
    Evidence(id="ev-5", title="AWS Cloud Practitioner Essentials", type="credential", source="AWS Skill Builder", date="2026-06-02", status="Pending", skills=["Cloud Fundamentals (AWS)"], detail="Course completion recorded; issuer verification is pending."),
]

matches = [
    Match(id="m1", title="Data Analyst Intern", org="Nimbus Fintech", kind="Internship", domain="Data & Analytics", score=91, summary="Build lending dashboards and cohort reports for the risk team.", requirements=[SkillRequirement(name="SQL", required_level=4), SkillRequirement(name="Data Visualization", required_level=3), SkillRequirement(name="Python", required_level=4), SkillRequirement(name="Statistical Modeling", required_level=3)]),
    Match(id="m2", title="Campus AI-for-Good Team", org="Needs a frontend + data teammate", kind="Team", domain="Applied ML", score=87, summary="Prepare an accessibility assistant for a state innovation grant.", requirements=[SkillRequirement(name="React.js", required_level=4), SkillRequirement(name="Python", required_level=3), SkillRequirement(name="Team Leadership", required_level=3), SkillRequirement(name="Public Speaking", required_level=5)]),
    Match(id="m3", title="Cloud Platform Intern", org="Arclight Infrastructure", kind="Internship", domain="Cloud & Platform", score=68, summary="Work on deployment tooling and cost-reporting automation.", requirements=[SkillRequirement(name="Python", required_level=3), SkillRequirement(name="Cloud Fundamentals (AWS)", required_level=4), SkillRequirement(name="Containers & CI/CD", required_level=4)]),
]

fairness_note = "This score uses only skill-evidence signals. Name, photo, gender, age, and college tier are excluded from the calculation."
