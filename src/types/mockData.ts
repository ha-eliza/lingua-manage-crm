import type { Lesson, Material, Note, Student, Teacher } from "./index";

// 1. ПОЛЬЗОВАТЕЛИ

export const mockTeacher: Teacher = {
  id: 't1',
  name: 'Мария Смирнова',
  email: 'maria.eng@tutor.ru',
  password: 'hashed_password_123',
  role: 'teacher',
  avatarColor: '#8B00FF',
};

export const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Александр Петров',
    email: 'alex.petrov@mail.ru',
    role: 'student',
    avatarColor: '#FF66B9',
    level: 'B1',
    status: 'active',
    login: { login: 'alex_eng', password: 'password1' }
  },
  {
    id: 's2',
    name: 'Елена Иванова',
    email: 'elena.ivanova@yandex.ru',
    role: 'student',
    avatarColor: '#66B9FF',
    level: 'A2',
    status: 'active',
    login: { login: 'elena_lingua', password: 'password2' }
  },
  {
    id: 's3',
    name: 'Дмитрий Кузнецов',
    email: 'dima.kuz@gmail.com',
    role: 'student',
    avatarColor: '#191A23',
    level: 'C1',
    status: 'completed', // Завершил обучение
    login: { login: 'dima_advanced', password: 'password3' }
  }
];

// 2. УЧЕБНЫЕ МАТЕРИАЛЫ

export const mockMaterials: Material[] = [
  {
    id: 'm1',
    title: 'English File Upper-Intermediate 4th Edition',
    description: 'Основной учебник (Student\'s Book) для развития разговорных навыков.',
    level: 'B2',
    type: 'sb',
    link: 'https://google.com'
  },
  {
    id: 'm2',
    title: 'Essential Grammar in Use (Raymond Murphy)',
    description: 'Красный Мёрфи. Сборник правил и тестов для отработки базовой грамматики.',
    level: 'A2',
    type: 'book',
    link: 'https://google.com'
  },
  {
    id: 'm3',
    title: 'Интервью с Киану Ривзом на шоу Киммела',
    description: 'Видео для разбора живой американской речи и идиом. Слушать без субтитров.',
    level: 'B1',
    type: 'video',
    link: 'https://youtube.com'
  },
  {
    id: 'm4',
    title: 'Тест на знание времен группы Perfect',
    description: 'Входное тестирование для проверки понимания Present/Past Perfect.',
    level: 'B1',
    type: 'test',
    link: 'https://progress.me'
  }
];

// 3. ЗАМЕТКИ И ЗАДАЧИ

export const mockNotes: Note[] = [
  {
    id: 'n1',
    text: 'Подготовить материалы по теме "Conditional Sentences" для Александра',
    priority: 'high',
    completed: false,
    createdAt: '2026-06-20',
    deadline: '2026-06-23'
  },
  {
    id: 'n2',
    text: 'Проверить эссе Елены по книге Шерлока Холмса',
    priority: 'medium',
    completed: true,
    createdAt: '2026-06-18',
    deadline: '2026-06-21',
    completedAt: '2026-06-21'
  },
  {
    id: 'n3',
    text: 'Выслать Дмитрию сертификат об окончании курса C1',
    priority: 'low',
    completed: false,
    createdAt: '2026-06-22'
  }
];

// 4. РАСПИСАНИЕ

export const mockLessons: Lesson[] = [
  {
    id: 'l1',
    studentId: 's1',
    date: '2026-06-25',
    time: '14:00',
    topic: 'Present Perfect vs Past Simple Practice',
    homework: 'English File p.45 ex.2-4',
    status: 'scheduled'
  },
  {
    id: 'l2',
    studentId: 's2',
    date: '2026-06-25',
    time: '16:30',
    topic: 'Speaking Club: Travelling & Airport Vocabulary',
    homework: 'Выучить 10 фраз из прикрепленного видео-материала',
    status: 'scheduled'
  },
  {
    id: 'l3',
    studentId: 's1',
    date: '2026-06-22',
    time: '11:00',
    topic: 'First Lesson & Level Assessment',
    status: 'completed'
  }
];
