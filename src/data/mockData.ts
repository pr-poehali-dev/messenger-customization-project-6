export interface Story {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  color: string;
  viewed: boolean;
  time: string;
}

export interface Chat {
  id: string;
  name: string;
  initials: string;
  color: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  typing?: boolean;
  pinned?: boolean;
  muted?: boolean;
}

export interface Message {
  id: string;
  text: string;
  time: string;
  isOut: boolean;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: { emoji: string; count: number }[];
}

export interface Contact {
  id: string;
  name: string;
  initials: string;
  color: string;
  phone: string;
  online: boolean;
  lastSeen?: string;
}

export interface CallRecord {
  id: string;
  name: string;
  initials: string;
  color: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration?: string;
  time: string;
  video?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  initials: string;
  color: string;
  subscribers: string;
  lastPost: string;
  time: string;
  verified?: boolean;
}

export const stories: Story[] = [
  { id: '1', name: 'Моя история', avatar: '', initials: 'ВЯ', color: '#3ecf8e', viewed: false, time: '' },
  { id: '2', name: 'Алексей', avatar: '', initials: 'АК', color: '#6366f1', viewed: false, time: '2 мин' },
  { id: '3', name: 'Мария', avatar: '', initials: 'МС', color: '#ec4899', viewed: false, time: '15 мин' },
  { id: '4', name: 'Дмитрий', avatar: '', initials: 'ДВ', color: '#f59e0b', viewed: true, time: '1 ч' },
  { id: '5', name: 'Анна', avatar: '', initials: 'АН', color: '#14b8a6', viewed: true, time: '3 ч' },
  { id: '6', name: 'Tech News', avatar: '', initials: 'TN', color: '#8b5cf6', viewed: true, time: '5 ч' },
];

export const chats: Chat[] = [
  { id: '1', name: 'Алексей Кравцов', initials: 'АК', color: '#6366f1', lastMessage: 'Увидимся завтра в 10?', time: '14:32', unread: 3, online: true, pinned: true },
  { id: '2', name: 'Мария Смирнова', initials: 'МС', color: '#ec4899', lastMessage: 'Ты печатаешь...', time: '14:28', unread: 0, online: true, typing: true },
  { id: '3', name: 'Команда проекта', initials: 'КП', color: '#f59e0b', lastMessage: 'Дима: Деплой готов 🚀', time: '13:55', unread: 12, online: false },
  { id: '4', name: 'Дмитрий Волков', initials: 'ДВ', color: '#f59e0b', lastMessage: 'Спасибо за файлы!', time: '12:10', unread: 0, online: false },
  { id: '5', name: 'Анна Новикова', initials: 'АН', color: '#14b8a6', lastMessage: 'Хорошо, договорились', time: '11:45', unread: 0, online: true },
  { id: '6', name: 'Startup Chat', initials: 'SC', color: '#3ecf8e', lastMessage: 'Встреча в пятницу отменена', time: 'Вчера', unread: 1, online: false, muted: true },
  { id: '7', name: 'Иван Петров', initials: 'ИП', color: '#ef4444', lastMessage: 'Позвони когда освободишься', time: 'Вчера', unread: 0, online: false },
  { id: '8', name: 'Design Team', initials: 'DT', color: '#8b5cf6', lastMessage: 'Катя: Макеты готовы', time: 'Пн', unread: 0, online: false },
];

export const messages: Message[] = [
  { id: '1', text: 'Привет! Как дела?', time: '14:20', isOut: false },
  { id: '2', text: 'Всё отлично, спасибо! Работаю над новым проектом 🔥', time: '14:21', isOut: true, status: 'read' },
  { id: '3', text: 'Звучит интересно! Расскажи подробнее', time: '14:22', isOut: false },
  { id: '4', text: 'Это мессенджер нового поколения — быстрый, безопасный и с крутым интерфейсом', time: '14:23', isOut: true, status: 'read' },
  { id: '5', text: 'Вау, я хочу попробовать!', time: '14:25', isOut: false, reactions: [{ emoji: '❤️', count: 1 }] },
  { id: '6', text: 'Конечно, скоро запустим бета-тест', time: '14:26', isOut: true, status: 'read' },
  { id: '7', text: 'Увидимся завтра в 10?', time: '14:32', isOut: false },
];

export const contacts: Contact[] = [
  { id: '1', name: 'Алексей Кравцов', initials: 'АК', color: '#6366f1', phone: '+7 916 123-45-67', online: true },
  { id: '2', name: 'Анна Новикова', initials: 'АН', color: '#14b8a6', phone: '+7 903 234-56-78', online: true },
  { id: '3', name: 'Дмитрий Волков', initials: 'ДВ', color: '#f59e0b', phone: '+7 925 345-67-89', online: false, lastSeen: 'был 2 ч назад' },
  { id: '4', name: 'Екатерина Орлова', initials: 'ЕО', color: '#8b5cf6', phone: '+7 965 456-78-90', online: false, lastSeen: 'была вчера' },
  { id: '5', name: 'Иван Петров', initials: 'ИП', color: '#ef4444', phone: '+7 977 567-89-01', online: false, lastSeen: 'был 3 д назад' },
  { id: '6', name: 'Мария Смирнова', initials: 'МС', color: '#ec4899', phone: '+7 985 678-90-12', online: true },
  { id: '7', name: 'Николай Козлов', initials: 'НК', color: '#06b6d4', phone: '+7 999 789-01-23', online: false, lastSeen: 'был час назад' },
];

export const calls: CallRecord[] = [
  { id: '1', name: 'Алексей Кравцов', initials: 'АК', color: '#6366f1', type: 'incoming', duration: '12:34', time: 'Сегодня, 14:10' },
  { id: '2', name: 'Мария Смирнова', initials: 'МС', color: '#ec4899', type: 'outgoing', duration: '5:02', time: 'Сегодня, 12:00', video: true },
  { id: '3', name: 'Дмитрий Волков', initials: 'ДВ', color: '#f59e0b', type: 'missed', time: 'Вчера, 19:45' },
  { id: '4', name: 'Анна Новикова', initials: 'АН', color: '#14b8a6', type: 'incoming', duration: '3:18', time: 'Вчера, 15:30' },
  { id: '5', name: 'Иван Петров', initials: 'ИП', color: '#ef4444', type: 'outgoing', duration: '0:45', time: 'Пн, 10:15', video: true },
  { id: '6', name: 'Екатерина Орлова', initials: 'ЕО', color: '#8b5cf6', type: 'missed', time: 'Вс, 20:10' },
];

export const channels: Channel[] = [
  { id: '1', name: 'Volta Official', initials: 'VO', color: '#3ecf8e', subscribers: '1.2M', lastPost: 'Обновление 2.0 уже доступно! Скачивайте и наслаждайтесь...', time: '10 мин', verified: true },
  { id: '2', name: 'Tech News RU', initials: 'TN', color: '#6366f1', subscribers: '890K', lastPost: 'Apple анонсировала новый MacBook с чипом M4 Ultra...', time: '1 ч', verified: true },
  { id: '3', name: 'Design Talks', initials: 'DT', color: '#ec4899', subscribers: '234K', lastPost: 'Тренды UI/UX 2026: что нужно знать каждому дизайнеру...', time: '3 ч' },
  { id: '4', name: 'Crypto Daily', initials: 'CD', color: '#f59e0b', subscribers: '567K', lastPost: 'Bitcoin пробил новый исторический максимум...', time: 'Вчера', verified: true },
  { id: '5', name: 'Стартапы РФ', initials: 'СР', color: '#14b8a6', subscribers: '45K', lastPost: 'Топ-10 российских стартапов этого года...', time: 'Вчера' },
];
