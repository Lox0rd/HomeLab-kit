Да. Если делать **не учебный прототип, а коммерческую версию**, я бы уже закладывал архитектуру так, чтобы один и тот же продукт работал:

* в VM из LAB KIT;
* на физическом мини-ПК HOMELAB;
* в будущем на более мощных конфигурациях;
* полностью офлайн в базовом режиме;
* с опциональным облачным аккаунтом;
* с обновлениями;
* с системой лабораторных;
* с каталогом сервисов;
* с диагностикой и восстановлением;
* и при этом был достаточно безопасным для установки на домашний сервер.

Ниже — полноценное ТЗ, которое можно отдавать разработчику/команде.

---

# ТЗ: HOMELAB AGENT + HOMELAB WEB

**Версия документа:** 1.0
**Статус:** Production / Market Release
**Продукт:** HOMELAB Platform
**Компоненты:** Homelab Agent + Homelab Web
**Основная ОС первой версии:** Ubuntu Server 24.04 LTS x86_64

---

# 1. Концепция продукта

HOMELAB Platform — локальная программная платформа для управления, изучения и эксплуатации домашнего сервера.

Она должна объединять:

```text
                  HOMELAB PLATFORM
                         │
          ┌──────────────┴──────────────┐
          │                             │
    HOMELAB AGENT                 HOMELAB WEB
          │                             │
          │                       Пользователь
          │                             │
          ├──── System                  │
          ├──── Network                 │
          ├──── Docker                  │
          ├──── Services                │
          ├──── Security                │
          ├──── Storage                 │
          ├──── Labs ───────────────────┤
          └──── Recovery                │
                                        │
                         ┌──────────────┴─────────────┐
                         │                            │
                     Dashboard                    Labs
                     Services                    Server
                     Network                    Storage
                     Security                   Settings
```

Главная идея:

> **Пользователь должен не просто видеть сервер, а понимать его и уметь им управлять.**

---

# 2. Целевая аудитория

### Основная

Начинающие пользователи:

* студенты;
* начинающие программисты;
* люди, интересующиеся Linux;
* люди, желающие создать домашний сервер;
* начинающие DevOps;
* начинающие системные администраторы.

### Вторичная

Продвинутые пользователи:

* разработчики;
* Linux users;
* DevOps;
* homelab enthusiasts;
* преподаватели.

Для опытного пользователя интерфейс не должен мешать.

---

# 3. Основные режимы работы

Система должна поддерживать три режима.

## 3.1 LAB MODE

Образовательный режим.

Пользователь проходит лабораторные:

```text
LAB 01
↓
LAB 02
↓
LAB 03
...
↓
LAB 30
```

---

## 3.2 SERVER MODE

Обычная эксплуатация сервера:

```text
Dashboard
Services
Docker
Storage
Network
Security
System
```

---

## 3.3 RECOVERY MODE

Восстановление после ошибок:

```text
Diagnostics
Backup
Restore
Reset
Recovery
```

---

# 4. Архитектура

## 4.1 Общая архитектура

```text
                         Browser
                            │
                            │ HTTPS / HTTP
                            ▼
                   ┌─────────────────┐
                   │  HOMELAB WEB    │
                   │                 │
                   │ UI              │
                   │ API Gateway     │
                   └────────┬────────┘
                            │
                     Local API
                            │
                            ▼
                   ┌─────────────────┐
                   │ HOMELAB AGENT   │
                   │                 │
                   │ System Manager  │
                   │ Network Manager │
                   │ Docker Manager  │
                   │ Lab Engine      │
                   │ Security       │
                   │ Storage         │
                   └────────┬────────┘
                            │
        ┌─────────────┬─────┼──────┬─────────────┐
        ▼             ▼     ▼      ▼             ▼
      Linux         Docker  UFW  systemd      Storage
```

---

# 5. Компоненты

## 5.1 Homelab Agent

Фоновый системный сервис.

Отвечает за:

* сбор информации;
* мониторинг;
* диагностику;
* проверку лабораторных;
* работу с Docker;
* работу с systemd;
* работу с сетью;
* работу с дисками;
* работу с пользователями;
* безопасность;
* обновления;
* локальное API.

---

# 6. Homelab Web

Web-приложение должно предоставлять:

### Главная

Dashboard.

### Обучение

Labs.

### Сервер

Server.

### Сервисы

Services.

### Docker

Containers.

### Сеть

Network.

### Хранилище

Storage.

### Безопасность

Security.

### Резервные копии

Backup.

### Диагностика

Diagnostics.

### Настройки

Settings.

---

# 7. Технологический стек

## Agent

Python 3.12+

FastAPI

Pydantic

SQLAlchemy

SQLite

psutil

Docker SDK

PyYAML

Uvicorn

---

## Web

Для production желательно:

**TypeScript + React + Vite**

Почему теперь React имеет смысл?

MVP можно было сделать на Vanilla JS, но коммерческий продукт будет иметь:

* много страниц;
* сложное состояние;
* уведомления;
* модальные окна;
* графики;
* лабораторные;
* интерактивные компоненты;
* каталог приложений;
* настройки.

Поэтому production:

```text
React
TypeScript
Vite
```

UI:

например, Tailwind CSS + собственная дизайн-система.

---

# 8. База данных

SQLite для локальной установки.

Основные таблицы:

```text
users
settings
labs
lab_tasks
lab_progress
services
containers
backups
devices
notifications
audit_log
```

---

# 9. Пользовательская модель

Для локального режима регистрация **не обязательна**.

При первом запуске:

```text
Welcome to HOMELAB

Create administrator

Username:
Password:
```

Создаётся локальный пользователь:

```text
admin
```

Пароль хранится только в виде безопасного хеша.

Никаких:

```text
admin/admin
root/root
```

---

# 10. Первый запуск

После установки Agent запускается:

```text
http://homelab.local
```

или:

```text
http://<server-ip>
```

Показывается:

```text
WELCOME TO HOMELAB

Let's set up your server.

1. Server name
2. Create account
3. Network
4. Security
5. Diagnostics
6. Start learning
```

---

# 11. Dashboard

Главный экран:

```text
┌────────────────────────────────────────────┐
│ HOMELAB                         ● ONLINE  │
├────────────────────────────────────────────┤
│                                            │
│ CPU             RAM             DISK        │
│ 17%             42%            31%         │
│                                            │
├────────────────────────────────────────────┤
│ YOUR PROGRESS                              │
│                                            │
│ ███████████████░░░░  22 / 30              │
│                                            │
│ Next: Docker Compose                       │
│                                            │
│ [ CONTINUE LAB ]                           │
├────────────────────────────────────────────┤
│ SERVICES                                   │
│                                            │
│ SSH       ● Running                        │
│ Docker    ● Running                        │
│ Nginx     ● Running                        │
└────────────────────────────────────────────┘
```

---

# 12. Мониторинг

Agent собирает:

### CPU

* usage;
* cores;
* load average;
* temperature, если доступно.

### RAM

* total;
* used;
* available;
* swap.

### Storage

* total;
* used;
* free;
* filesystem;
* mount points.

### Network

* RX;
* TX;
* interfaces;
* IP.

---

# 13. История метрик

Agent должен хранить историю:

```text
CPU
RAM
Disk
Network
```

Минимальный период:

**7 дней.**

Настройка:

```text
Retention:
7 days
30 days
90 days
```

Для маленького устройства данные должны храниться компактно.

---

# 14. Системные уведомления

Например:

> ⚠️ Диск заполнен на 85%.

> ⚠️ RAM usage выше 90%.

> 🔴 Docker stopped.

> 🔴 Backup failed.

> 🟢 Backup completed.

Уведомления отображаются в Web.

---

# 15. Services

Автоматическое обнаружение systemd services.

Показывать:

```text
Name
Status
Enabled
Port
Uptime
```

Пример:

```text
Docker
● Running
Enabled
```

Пользователь может:

* start;
* stop;
* restart.

Но только для разрешённого списка сервисов.

---

# 16. Docker

Полноценная страница Docker.

Показывать:

```text
Docker version

Containers
Images
Networks
Volumes
```

Для контейнеров:

```text
Name
Image
Status
CPU
RAM
Ports
Created
```

---

# 17. Управление контейнерами

Разрешить:

```text
Start
Stop
Restart
Logs
Inspect
```

Не давать пользователю через Web произвольный Docker socket API.

Agent должен выступать посредником.

---

# 18. Docker Compose

Система должна поддерживать проекты:

```text
Projects

Jellyfin
Gitea
Nextcloud
...
```

Каждый проект:

```text
Running
Stopped
Error
```

С возможностью:

```text
Start
Stop
Restart
Logs
```

---

# 19. App Catalog

Одна из главных функций будущего продукта.

Раздел:

# App Store

Например:

```text
Jellyfin
Gitea
Nextcloud
Uptime Kuma
Home Assistant
Minecraft
Pi-hole
```

Каждое приложение имеет:

```text
Description
Requirements
Ports
Storage
Security
Install
```

---

# 20. Установка приложения

Пользователь нажимает:

> Install Jellyfin

Система показывает:

```text
Jellyfin

RAM: ~1 GB
Storage: 10+ GB
Port: 8096

This application will create:

• Docker container
• Docker network
• Persistent volume

[ INSTALL ]
```

После установки:

```text
✓ Container created
✓ Storage created
✓ Network created
✓ Service started

Open Jellyfin →
```

---

# 21. App Templates

Приложения должны описываться декларативно.

Например:

```yaml
id: jellyfin

name: Jellyfin

version: "1.0"

requirements:
  ram: 1024
  storage: 10000

ports:
  - 8096

compose:
  ...
```

Это позволит добавлять приложения без переписывания Agent.

---

# 22. Labs Engine

Это центральная образовательная система.

Каждая лабораторная состоит из:

```text
metadata
theory
tasks
hints
checks
solution
achievement
```

---

# 23. Формат лабораторной

Например:

```yaml
id: LAB-013

title: My First Web Server

difficulty: beginner

estimated_time: 20

prerequisites:
  - LAB-012

tasks:

  - id: install-nginx
    type: package_installed
    package: nginx

  - id: start-nginx
    type: service_running
    service: nginx

  - id: http
    type: http_status
    url: http://localhost
    expected: 200
```

---

# 24. Система проверки

Поддержать минимум:

```text
package_installed
package_not_installed

user_exists
user_not_exists
user_in_group

file_exists
file_not_exists
file_contains
file_permission
file_owner

directory_exists

service_installed
service_running
service_stopped
service_enabled

port_open
port_closed

process_exists

docker_installed
container_exists
container_running
container_stopped

docker_volume_exists
docker_network_exists

http_status
http_body_contains

firewall_enabled
firewall_rule_exists

mount_exists
filesystem_exists
```

---

# 25. Custom Checker

Для сложных лабораторных должна существовать возможность писать Python checker.

Например:

```text
custom_checker.py
```

Но он должен выполняться в изолированном окружении.

---

# 26. Система подсказок

Каждая лабораторная:

```text
Hint 1
Hint 2
Hint 3
Solution
```

Пример:

```text
💡 Hint 1

Тебе понадобится пакет nginx.

──────────────

💡 Hint 2

Для установки пакетов используется apt.

──────────────

💡 Hint 3

Попробуй:

sudo apt install nginx
```

---

# 27. Антиспойлер

По умолчанию:

```text
Solution 🔒
```

Нажатие:

> Показать решение

должно отмечаться как:

```text
Solved with help
```

Но лабораторная всё равно считается выполненной.

Это нужно для мотивации, а не для наказания.

---

# 28. Прогресс

Пользователь получает:

```text
22 / 30
73%
```

Статусы:

```text
Locked
Available
In Progress
Completed
Completed with Help
```

---

# 29. Achievements

Система достижений:

```text
First SSH
Linux Explorer
First Web Server
Docker Beginner
Docker Master
Network Explorer
Security Beginner
Backup Master
VPN Explorer
Homelab Builder
```

---

# 30. Финальный проект

LAB 30 должен быть проектом.

Пользователь получает требования, но не готовые команды.

Например:

> Создай домашний сервер, на котором работают Web Server, Docker и Backup.

Agent проверяет результат.

---

# 31. Network

Раздел Network:

```text
Interfaces
IP addresses
Gateway
DNS
Routes
Open ports
Connections
```

Визуальная схема:

```text
        Router
           │
           │
       HOMELAB
       ┌───┴────┐
       │        │
     Docker   SSH
       │
     Nginx
```

---

# 32. Firewall

Показывать:

```text
Firewall: ON

Rules:

22/tcp   SSH
80/tcp   HTTP
443/tcp  HTTPS
```

Пользователь может управлять правилами через безопасный интерфейс.

Для критических действий:

> Confirm firewall change.

---

# 33. Storage

Раздел:

```text
Storage

Disks
Partitions
Filesystems
Mounts
Usage
```

Для физического HOMELAB дополнительно:

```text
SMART
Temperature
Health
RAID
```

В VM эти функции должны отображаться как:

> Not available in virtual environment.

---

# 34. Backup

Очень важный production-раздел.

Пользователь должен иметь возможность настроить backup:

```text
What:
□ Application data
□ Configuration
□ Labs progress
□ System settings

Where:
□ Local disk
□ External disk
□ SMB
□ SFTP
```

Расписание:

```text
Daily
Weekly
Manual
```

---

# 35. Backup Dashboard

```text
BACKUP

Last backup:
Today 03:00

Status:
✓ Successful

Size:
4.2 GB

Next:
Tomorrow 03:00

[ BACKUP NOW ]
[ RESTORE ]
```

---

# 36. Restore

Перед восстановлением:

```text
⚠️ Restore will replace current data.

Backup:
2026-09-28 03:00

[ CANCEL ]
[ RESTORE ]
```

Никаких автоматических разрушительных операций без подтверждения.

---

# 37. Security Center

Показывать:

```text
SECURITY SCORE
```

Но я бы не делал это «магическим рейтингом».

Лучше список проверок:

```text
✓ Root SSH login disabled
✓ Firewall enabled
✓ Strong admin password
✓ Automatic security updates
⚠ SSH password authentication enabled
```

---

# 38. Security Audit

Кнопка:

> Run security audit

Проверяется:

* SSH;
* firewall;
* users;
* permissions;
* unnecessary services;
* updates;
* Docker;
* open ports.

---

# 39. Updates

Раздел:

```text
Updates

HOMELAB Agent
Current: 1.4.2
Available: 1.5.0

Lab Pack
Current: 1.2
Available: 1.3
```

Обновления должны:

1. проверять цифровую подпись;
2. проверять совместимость;
3. создавать backup;
4. устанавливать;
5. проверять health;
6. уметь откатиться.

---

# 40. Cloud Account

Облачный аккаунт должен быть **опциональным**.

Локальный режим:

```text
No account
No internet
Everything works
```

Если пользователь создаёт аккаунт:

```text
Cloud
 │
 ├── Profile
 ├── Progress sync
 ├── Achievements
 ├── Lab updates
 ├── Community
 └── Device management
```

---

# 41. Device Pairing

Для физического HOMELAB:

```text
Add device
```

Пользователь сканирует QR-код.

Получается:

```text
Device ID
Pairing code
```

После подтверждения устройство привязывается к аккаунту.

Нельзя использовать один универсальный пароль для всех устройств.

---

# 42. Удалённый доступ

**Не делать собственный reverse tunnel в первой production-версии без необходимости.**

Для удалённого доступа лучше интегрироваться с:

* Tailscale;
* WireGuard;
* VPN пользователя.

В интерфейсе:

```text
Remote Access

Tailscale
● Connected

Device:
homelab

Address:
100.x.x.x
```

---

# 43. Локальный режим

Если интернет пропал:

```text
Cloud ❌
Internet ❌

HOMELAB
✓ Dashboard
✓ Labs
✓ Docker
✓ Services
✓ Storage
✓ Network
✓ Backup
✓ Security
```

Ничего критического не должно переставать работать.

---

# 44. Notifications

Внутренний центр уведомлений:

```text
🔔 Notifications

3

⚠ Disk usage > 80%
✓ Backup completed
✓ LAB 15 completed
```

---

# 45. Audit Log

Для действий пользователя:

```text
2026-09-29 12:31
admin
Restarted nginx

2026-09-29 12:34
admin
Installed Jellyfin

2026-09-29 13:00
admin
Created backup
```

Не хранить секреты.

---

# 46. Diagnostics

Кнопка:

> Run diagnostics

Проверяет:

```text
✓ Agent
✓ Database
✓ Docker
✓ Network
✓ Storage
✓ Systemd
✓ Firewall
✓ DNS
```

---

# 47. Support Package

Создать:

```text
Generate Support Bundle
```

Архив:

```text
homelab-support-2026-09-29.zip
```

Внутри:

```text
system-info.json
agent.log
docker-info.json
network-info.json
service-status.json
diagnostics.json
```

Без:

* passwords;
* tokens;
* private keys;
* personal files.

---

# 48. Recovery

В интерфейсе:

```text
Recovery

□ Restore backup
□ Reset application configuration
□ Reset labs
□ Factory reset
```

**Factory reset** требует нескольких подтверждений.

---

# 49. Factory Reset

Для физического HOMELAB:

```text
⚠️ FACTORY RESET

This will remove:

• installed applications
• settings
• lab progress

Your personal files will NOT be deleted.

[ Cancel ]
[ Continue ]
```

Если операция действительно удаляет данные — это должно быть явно указано.

---

# 50. API

Production API должен иметь:

```text
/api/v1/health
/api/v1/system
/api/v1/network
/api/v1/storage
/api/v1/services
/api/v1/docker
/api/v1/labs
/api/v1/progress
/api/v1/backup
/api/v1/security
/api/v1/diagnostics
/api/v1/updates
/api/v1/apps
```

Использовать versioning:

```text
/api/v1/
```

чтобы в будущем можно было сделать:

```text
/api/v2/
```

без поломки старых клиентов.

---

# 51. Authentication

Для Web:

```text
Session / JWT
```

Для локального режима предпочтительнее secure HTTP-only cookies.

Обязательно:

* password hashing;
* rate limiting;
* CSRF protection;
* session expiration;
* logout;
* login attempt protection.

---

# 52. HTTPS

Для физического устройства:

по умолчанию можно использовать локальный HTTP в изолированной LAN-среде, но production-режим должен поддерживать HTTPS.

Например:

```text
https://homelab.local
```

Для внешнего доступа HTTPS обязателен.

---

# 53. Permissions

Роли:

### Administrator

Полный доступ.

### User

Доступ к:

* Labs;
* Dashboard;
* Services;
* ограниченному управлению.

### Viewer

Только просмотр.

---

# 54. Безопасность Agent

Критически важно:

**не давать Web произвольный shell.**

Не должно существовать:

```text
POST /execute
```

с произвольной строкой.

Вместо этого:

```text
Action Registry

restart_service
install_app
start_container
stop_container
run_backup
check_lab
```

Каждая операция:

```text
validated
authorized
logged
```

---

# 55. Secrets

Все секреты:

* пароли;
* API tokens;
* cloud credentials;

должны храниться отдельно от обычных настроек.

Минимально:

```text
permissions 600
```

В дальнейшем можно использовать OS keyring/secret storage.

---

# 56. Обновление Lab Pack

Лабораторные должны быть отделены от Agent.

То есть:

```text
Agent
1.5.0

Lab Pack
1.3.0
```

Можно выпустить:

```text
Lab Pack 1.4
```

без обновления Agent.

Это очень важно для бизнеса.

---

# 57. Content Management

Для команды продукта нужен отдельный репозиторий:

```text
homelab-content/

labs/
apps/
documentation/
achievements/
translations/
```

Лабораторная:

```text
LAB-013/
├── metadata.yaml
├── theory.md
├── task.md
├── hints.md
├── solution.md
├── checker.yaml
└── assets/
```

Так контент-менеджер сможет создавать новые лабораторные без изменения основного приложения.

---

# 58. Тестирование лабораторных

Каждая лабораторная должна иметь automated tests.

Например:

```text
LAB-013

✓ checker test: nginx installed
✓ checker test: nginx running
✓ checker test: HTTP 200
✓ negative test: nginx stopped
✓ negative test: nginx absent
```

---

# 59. Compatibility Checker

При первом запуске:

```text
System compatibility

✓ Ubuntu 24.04
✓ x86_64
✓ 4 GB RAM
✓ 40 GB disk
✓ Python
✓ systemd
✓ Docker
```

Если требования не выполнены:

```text
⚠ Your system doesn't meet recommended requirements.

RAM:
2 GB

Recommended:
4 GB
```

---

# 60. Требования для VM

Минимально:

```text
2 CPU
4 GB RAM
40 GB disk
x86_64
```

Рекомендуемо:

```text
4 CPU
8 GB RAM
60 GB disk
```

---

# 61. Требования для физического HOMELAB

Базовая конфигурация:

```text
x86_64
4+ CPU threads
8 GB RAM
256+ GB SSD
1 GbE
```

Для более серьёзных конфигураций:

```text
16–32 GB RAM
NVMe
2.5 GbE
multiple disks
```

Agent должен автоматически определять возможности устройства.

---

# 62. Design System

Интерфейс должен иметь единый стиль.

Основные элементы:

```text
Cards
Tables
Status badges
Progress bars
Charts
Dialogs
Toasts
Side navigation
```

Статусы:

```text
● Running
● Stopped
● Warning
● Error
● Unknown
```

---

# 63. Mobile

Web должен быть responsive.

Пользователь должен иметь возможность открыть:

```text
iPhone
Android
Tablet
Laptop
Desktop
```

Но **не нужно делать отдельное мобильное приложение** в первой версии.

---

# 64. Accessibility

Минимум:

* keyboard navigation;
* readable contrast;
* semantic HTML;
* ARIA;
* scalable text.

---

# 65. Localization

Архитектура:

```text
locales/
├── ru.json
└── en.json
```

Первая версия:

**русский + английский.**

---

# 66. Telemetry

В локальном режиме:

**никакой обязательной телеметрии.**

Если пользователь согласился:

```text
Anonymous telemetry
```

Можно собирать:

* версии;
* ошибки;
* crash reports;
* обезличенную статистику.

Никогда автоматически:

* файлы;
* пароли;
* содержимое диска;
* команды;
* персональные данные.

---

# 67. Privacy

На странице Privacy должно быть понятно:

> HOMELAB работает локально. Основные функции не требуют передачи данных в облако.

Это может стать одним из преимуществ продукта.

---

# 68. Cloud Backend

Отдельный будущий компонент:

```text
HOMELAB CLOUD
```

Он не должен быть частью Agent.

Архитектура:

```text
HOMELAB
   │
   │ optional
   ▼
HOMELAB CLOUD
   │
   ├── Account
   ├── Device
   ├── Progress
   ├── Updates
   └── Content
```

---

# 69. Лицензирование

Каждое устройство получает:

```text
Device ID
```

Для LAB KIT можно использовать:

```text
Product License
```

Но базовые функции не должны ломаться, если интернет недоступен.

Активация может быть:

```text
Offline license
```

или:

```text
Online activation
```

---

# 70. Защита от пиратства

Я бы **не делал жёсткую DRM-систему**.

Пользователь должен иметь возможность:

* копировать VM;
* делать backup;
* восстанавливать систему.

Защищать нужно не Ubuntu, а коммерческий контент:

* дополнительные Lab Packs;
* cloud services;
* premium apps;
* обновления.

---

# 71. App Marketplace

В будущем:

```text
HOMELAB STORE

Free
Premium
Community
Official
```

Каждое приложение:

```text
Verified by HOMELAB
```

Для официальных шаблонов.

---

# 72. Обновление приложений

Например:

```text
Jellyfin

Installed:
10.x

Available:
11.x

[ Update ]
```

Перед обновлением:

```text
Create backup?
✓ Yes
```

---

# 73. Error Handling

Пользователь никогда не должен видеть:

```text
Traceback...
```

в обычном интерфейсе.

Вместо:

> Не удалось запустить Docker container.

И:

```text
[ SHOW DETAILS ]
[ RUN DIAGNOSTICS ]
```

---

# 74. Developer Mode

Для опытного пользователя:

```text
Settings
→ Advanced
→ Developer Mode
```

Показывать:

* API;
* logs;
* systemd;
* Docker;
* debug information.

Но скрывать это от новичка.

---

# 75. CLI

Я бы добавил CLI:

```bash
homelab status
homelab diagnostics
homelab labs
homelab backup
homelab update
```

Например:

```bash
homelab status
```

вывод:

```text
HOMELAB 1.4.0

Agent:     ● Running
Web:       ● Running
Docker:    ● Running
Firewall:  ● Enabled
Backup:    ● OK

Labs: 22/30
```

Это понравится продвинутым пользователям.

---

# 76. API Documentation

В development:

```text
/api/docs
```

Swagger/OpenAPI.

В production можно отключить или закрыть authentication.

---

# 77. Логическая структура репозиториев

Я бы сделал:

```text
homelab-agent
homelab-web
homelab-content
homelab-apps
homelab-cloud
homelab-installer
```

А не один гигантский repository.

---

# 78. CI/CD

Для каждого проекта:

```text
lint
unit tests
integration tests
security scan
build
package
release
```

Например:

```text
commit
 ↓
tests
 ↓
Bandit
 ↓
Dependency scan
 ↓
Build
 ↓
Package
 ↓
Release
```

---

# 79. Security Testing

Обязательно:

* dependency scanning;
* SAST;
* secret scanning;
* API security tests;
* authentication tests;
* authorization tests;
* Docker security;
* permission tests.

---

# 80. Release Artifacts

Для пользователя:

```text
HOMELAB-Agent.deb
HOMELAB-Web.deb
HOMELAB-Installer.sh
HOMELAB-VM.ova
HOMELAB-Recovery.iso
```

Для LAB KIT:

```text
HOMELAB-LAB-KIT-v1.0.iso
```

или USB package.

---

# 81. Installer

Идеальный UX:

```text
$ sudo ./install.sh

HOMELAB INSTALLER

Checking system...
✓ Ubuntu 24.04
✓ x86_64
✓ systemd
✓ 4 GB RAM

Installing...
✓ Agent
✓ Web
✓ Lab Pack

Starting services...
✓ Agent
✓ Web

HOMELAB is ready.

Open:
http://homelab.local
```

---

# 82. Production Definition of Done

Продукт считается готовым к рынку, если:

### Agent

* работает как systemd service;
* автоматически запускается;
* восстанавливается после crash;
* имеет API;
* имеет authentication;
* имеет permissions;
* имеет logging;
* имеет diagnostics;
* имеет update mechanism.

### Web

* responsive;
* русский/английский;
* authentication;
* dashboard;
* labs;
* services;
* Docker;
* network;
* storage;
* security;
* backup;
* diagnostics;
* settings.

### Labs

* минимум 30 лабораторных;
* automatic checking;
* hints;
* solutions;
* progress;
* achievements.

### Infrastructure

* installer;
* VM image;
* recovery;
* backup;
* update;
* documentation.

### Security

* SAST;
* dependency scan;
* secret scan;
* penetration testing;
* no arbitrary command execution;
* secure authentication.

---

# 83. Версия 1.0 — конкретный состав

Я бы зафиксировал первый рыночный релиз так:

```text
HOMELAB PLATFORM 1.0

┌─────────────────────────────────────┐
│ HOMELAB AGENT                       │
│                                     │
│ System                              │
│ Network                             │
│ Docker                              │
│ Services                            │
│ Storage                             │
│ Security                            │
│ Backup                              │
│ Diagnostics                         │
│ Lab Engine                          │
│ Update Engine                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ HOMELAB WEB                         │
│                                     │
│ Dashboard                           │
│ 30 Labs                             │
│ Progress                            │
│ Achievements                        │
│ Services                            │
│ Docker                              │
│ Network                             │
│ Storage                             │
│ Security                            │
│ Backup                              │
│ Diagnostics                         │
│ Settings                            │
└─────────────────────────────────────┘
```

---

# 84. А главное — как это будет выглядеть для покупателя

Он **не должен знать**, что внутри есть FastAPI, React, SQLite, Docker SDK и 15 типов checker'ов.

Для него путь должен выглядеть так:

```text
КУПИЛ HOMELAB
       │
       ▼
ВКЛЮЧИЛ
       │
       ▼
ОТКРЫЛ homelab.local
       │
       ▼
┌─────────────────────┐
│ Добро пожаловать!   │
│                     │
│ [Начать обучение]   │
└─────────────────────┘
       │
       ▼
LAB 01
       │
       ▼
LAB 02
       │
       ▼
...
       │
       ▼
LAB 30
       │
       ▼
🏆 HOMELAB BUILDER
       │
       ▼
"Теперь собери настоящий сервер"
```

И вот здесь появляется **самая сильная связь с твоей линейкой товаров**:

**LAB KIT** даёт человеку:

> VM + Agent + Web + 30 лабораторных.

А потом он покупает:

**HOMELAB STARTER**

и получает **тот же Agent + Web + те же лабораторные**, но теперь система работает на настоящем мини-ПК.

А затем можно перейти к:

**HOMELAB HOME**

где появляются уже новые возможности:

```text
Physical disks
RAID
NAS
SMART
Backups
VPN
Media Server
Multiple users
```

То есть ты фактически создаёшь **единую программную платформу для всей линейки HOMELAB**, а не просто интерфейс для одного мини-ПК. Это существенно важнее самого Web-интерфейса: именно Agent + Lab Engine + формат контента становятся ядром твоего продукта и тем, что сложнее всего скопировать простым перепродаванием mini-PC.
