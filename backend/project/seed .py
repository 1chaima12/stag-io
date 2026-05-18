"""
Run with: python manage.py shell < seed.py
Seeds the database with initial skills data.
"""
from users.models import Skill

skills = [
    "React","Vue","Angular","Node.js","Express","Django","FastAPI",
    "Laravel","Python","Java","PHP","C++","SQL","PostgreSQL","MongoDB",
    "Docker","Git","Linux","Flutter","TypeScript","Redis","Kubernetes",
    "GraphQL","REST API","TensorFlow","Figma","Spring Boot","Firebase","Dart","R",
]

for name in skills:
    Skill.objects.get_or_create(name=name)

print(f"✓ {len(skills)} skills seeded.")