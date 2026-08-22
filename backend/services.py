from .data import fairness_note, skills
from .models import Gap, Match, MatchExplanation


def explain_match(match: Match) -> MatchExplanation:
    skill_map = {skill.name.casefold(): skill for skill in skills}
    matched_skills: list[str] = []
    gaps: list[Gap] = []

    for requirement in match.requirements:
        skill = skill_map.get(requirement.name.casefold())
        if skill and skill.verified and skill.level >= requirement.required_level:
            matched_skills.append(requirement.name)
            continue

        if skill and not skill.verified:
            suggestion = "Attach verified issuer evidence for this skill."
        elif skill:
            suggestion = f"Raise demonstrated proficiency from level {skill.level} to {requirement.required_level}."
        else:
            suggestion = "Add a project, course, or credential demonstrating this skill."
        gaps.append(Gap(skill=requirement.name, suggestion=suggestion))

    score = round(len(matched_skills) / len(match.requirements) * 100) if match.requirements else 0
    return MatchExplanation(
        match=match,
        score=score,
        matched_skills=matched_skills,
        gaps=gaps,
        fairness_note=fairness_note,
    )
