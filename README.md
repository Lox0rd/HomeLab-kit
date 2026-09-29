# HOMELAB Platform

Локальная платформа для управления, изучения и эксплуатации домашнего сервера.

## Особенности

- 📚 **Интерактивные лабораторные работы** — Практическое обучение системному администрированию
- 📊 **Мониторинг системы** — Мониторинг в реальном времени CPU, памяти, диска и сети
- 🐳 **Управление Docker** — Управление контейнерами, образами, сетями и томами
- 🔒 **Безопасность** — Мониторинг параметров безопасности и управление резервными копиями
- 🌍 **Многоязычность** — Поддержка английского и русского языков
- 🎯 **Прогресс обучения** — Отслеживание прогресса выполнения лабораторных работ

## Структура

- **`agent/`** — Homelab Agent (Python FastAPI)
- **`web/`** — Homelab Web (React TypeScript Vite)
- **`content/`** — Лабораторные работы и контент
- **`scripts/`** — Установка и конфигурация
- **`labs.md`** — Описание лабораторных работ
- **`kit.md`** — Документация по установке и настройке

## Быстрый старт

### На чистой Ubuntu 24.04 LTS x86_64:

```bash
git clone https://github.com/your-org/homelab.git
cd homelab
sudo ./scripts/install.sh
```

После установки:
- Откройте `https://homelab.local`
- Логин: `admin`
- Пароль: выведен при установке (или `cat /root/.homelab/admin_password.txt`)

## Разработка

### Требования
- Python 3.12+
- Node.js 20+
- Docker
- Ubuntu 24.04 LTS (или совместимая)

### Agent (Backend)

```bash
cd agent
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m homelab_agent
```

Доступен на `http://localhost:8000`

Swagger UI: `http://localhost:8000/api/docs`

### Web (Frontend)

```bash
cd web
npm install
npm run dev
```

Доступен на `http://localhost:5173` (dev mode)

### Production Build

```bash
cd web
npm run build
```

Скомпилированные файлы находятся в `dist/`

## Локализация

Поддерживаемые языки:
- 🇬🇧 English (`en.json`)
- 🇷🇺 Русский (`ru.json`)

Переводы находятся в `web/src/i18n/`

## Структура проекта

```
homelab/
├── agent/                 # Backend (FastAPI)
│   ├── homelab_agent/
│   ├── requirements.txt
│   └── venv/
├── web/                   # Frontend (React)
│   ├── src/
│   │   ├── pages/        # Страницы приложения
│   │   ├── components/   # React компоненты
│   │   ├── i18n/         # Переводы
│   │   └── api/          # API клиент
│   ├── package.json
│   └── dist/             # Production build
├── content/              # Контент лабораторий
├── scripts/              # Установка и конфигурация
└── README.md
```

## Установка зависимостей вручную

### Agent

```bash
cd agent
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

### Web

```bash
cd web
npm install
npm run build
```

## API Endpoints

### Labs
- `GET /api/v1/labs/` — Получить список всех лабораторий
- `GET /api/v1/labs/{id}` — Получить детали лаборатории
- `POST /api/v1/labs/{id}/submit` — Отправить решение

### System
- `GET /api/v1/system/health` — Статус системы
- `GET /api/v1/system/metrics` — Метрики системы
- `GET /api/v1/system/network` — Информация о сети

### Docker
- `GET /api/v1/docker/available` — Проверить доступность Docker
- `GET /api/v1/docker/containers` — Список контейнеров
- `GET /api/v1/docker/images` — Список образов
- `GET /api/v1/docker/networks` — Список сетей
- `GET /api/v1/docker/volumes` — Список томов

## Troubleshooting

### Nginx не запускается
```bash
sudo nginx -t
sudo systemctl status nginx
```

### Agent не запускается
```bash
sudo systemctl status homelab-agent
sudo journalctl -u homelab-agent -n 50
```

### Забыли пароль admin
```bash
sudo cat /root/.homelab/admin_password.txt
```

## Лицензия

MIT

