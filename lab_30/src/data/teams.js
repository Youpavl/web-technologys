// ============================================
// МАСИВ ДЛЯ ЗАВДАННЯ 2: Teams (Команди)
// ============================================

const teams = [
  {
    id: 1,
    name: "Frontend Team",
    description: "Команда розробки користувацьких інтерфейсів",
    color: "blue",
    members: [
      {
        id: 1,
        name: "Олена Коваленко",
        role: "Senior Frontend Developer",
        avatar: "ОК",
        skills: ["React", "TypeScript", "Next.js", "Tailwind"]
      },
      {
        id: 2,
        name: "Дмитро Шевченко",
        role: "Frontend Developer",
        avatar: "ДШ",
        skills: ["Vue.js", "JavaScript", "CSS", "Figma"]
      },
      {
        id: 3,
        name: "Анна Мельник",
        role: "UI/UX Designer",
        avatar: "АМ",
        skills: ["Design", "Prototyping", "User Research"]
      }
    ]
  },
  {
    id: 2,
    name: "Backend Team",
    description: "Команда серверної розробки та інфраструктури",
    color: "purple",
    members: [
      {
        id: 4,
        name: "Іван Петренко",
        role: "Lead Backend Developer",
        avatar: "ІП",
        skills: ["Node.js", "PostgreSQL", "Docker", "AWS"]
      },
      {
        id: 5,
        name: "Софія Бойко",
        role: "Backend Developer",
        avatar: "СБ",
        skills: ["Python", "Django", "Redis", "MongoDB"]
      },
      {
        id: 6,
        name: "Максим Ткаченко",
        role: "DevOps Engineer",
        avatar: "МТ",
        skills: ["Kubernetes", "CI/CD", "Terraform", "Linux"]
      }
    ]
  },
  {
    id: 3,
    name: "Design Team",
    description: "Команда дизайну та креативу",
    color: "green",
    members: [
      {
        id: 7,
        name: "Марія Кравченко",
        role: "Lead Designer",
        avatar: "МК",
        skills: ["UI Design", "Brand Identity", "Illustration"]
      },
      {
        id: 8,
        name: "Артем Лисенко",
        role: "Motion Designer",
        avatar: "АЛ",
        skills: ["After Effects", "Animation", "3D"]
      },
      {
        id: 9,
        name: "Катерина Волошин",
        role: "UX Researcher",
        avatar: "КВ",
        skills: ["User Testing", "Analytics", "Research"]
      }
    ]
  },
  {
    id: 4,
    name: "Management",
    description: "Команда управління та стратегії",
    color: "orange",
    members: [
      {
        id: 10,
        name: "Віктор Сидоренко",
        role: "Project Manager",
        avatar: "ВС",
        skills: ["Agile", "Scrum", "Leadership", "Planning"]
      },
      {
        id: 11,
        name: "Юлія Романенко",
        role: "Product Owner",
        avatar: "ЮР",
        skills: ["Strategy", "Roadmap", "Stakeholders"]
      },
      {
        id: 12,
        name: "Олександр Гриценко",
        role: "Tech Lead",
        avatar: "ОГ",
        skills: ["Architecture", "Mentoring", "Code Review"]
      }
    ]
  }
];

export { teams };
