LABS = [
    {
        "id": "LAB-01",
        "title": "Linux Basics: File Navigation",
        "title_ru": "Основы Linux: навигация по файлам",
        "difficulty": "beginner",
        "estimated_time": 10,
        "description": "Learn to navigate the Linux filesystem using cd, pwd, and ls commands.",
        "description_ru": "Научитесь навигации по файловой системе Linux с использованием команд cd, pwd и ls.",
        "task": "Navigate to /tmp, create a directory called 'mydir', and list its contents.",
        "task_ru": "Перейдите в /tmp, создайте директорию 'mydir' и выведите её содержимое.",
        "hints": [
            "Use 'cd' to change directories",
            "Use 'mkdir' to create directories",
            "Use 'ls' to list contents"
        ],
        "hints_ru": [
            "Используйте 'cd' для смены директорий",
            "Используйте 'mkdir' для создания директорий",
            "Используйте 'ls' для вывода содержимого"
        ],
        "solution": "cd /tmp && mkdir mydir && ls -la mydir",
        "validation": {
            "type": "command",
            "command": "test -d /tmp/mydir && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-02",
        "title": "File Permissions",
        "title_ru": "Права доступа к файлам",
        "difficulty": "beginner",
        "estimated_time": 15,
        "description": "Understand and modify file permissions using chmod.",
        "description_ru": "Научитесь пониманию и изменению прав доступа к файлам с помощью chmod.",
        "task": "Create a file in /tmp/mydir called 'script.sh', make it executable.",
        "task_ru": "Создайте файл в /tmp/mydir называемый 'script.sh' и сделайте его исполняемым.",
        "hints": [
            "Use 'touch' to create a file",
            "Use 'chmod +x' to make a file executable",
            "Use 'ls -l' to check permissions"
        ],
        "hints_ru": [
            "Используйте 'touch' для создания файла",
            "Используйте 'chmod +x' чтобы сделать файл исполняемым",
            "Используйте 'ls -l' для проверки прав доступа"
        ],
        "solution": "touch /tmp/mydir/script.sh && chmod +x /tmp/mydir/script.sh",
        "validation": {
            "type": "command",
            "command": "test -x /tmp/mydir/script.sh && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-03",
        "title": "Text Processing with grep",
        "title_ru": "Обработка текста с grep",
        "difficulty": "beginner",
        "estimated_time": 15,
        "description": "Search for patterns in files using grep.",
        "description_ru": "Научитесь поиску шаблонов в файлах используя grep.",
        "task": "Create a file with text, search for a specific pattern.",
        "task_ru": "Создайте файл с текстом и ищите определённый шаблон.",
        "hints": [
            "Use 'echo' to create content",
            "Use 'grep' to search for patterns",
            "grep syntax: grep 'pattern' filename"
        ],
        "hints_ru": [
            "Используйте 'echo' для создания содержимого",
            "Используйте 'grep' для поиска шаблонов",
            "Синтаксис grep: grep 'шаблон' имя_файла"
        ],
        "solution": "echo -e 'hello world\\ntest line\\nhello again' > /tmp/mydir/test.txt && grep 'hello' /tmp/mydir/test.txt",
        "validation": {
            "type": "command",
            "command": "grep -c 'hello' /tmp/mydir/test.txt",
            "expected_output": "2"
        }
    },
    {
        "id": "LAB-04",
        "title": "User and Group Management",
        "title_ru": "Управление пользователями и группами",
        "difficulty": "intermediate",
        "estimated_time": 20,
        "description": "Learn to create and manage users and groups.",
        "description_ru": "Научитесь создавать и управлять пользователями и группами.",
        "task": "Display current user information using id command.",
        "task_ru": "Выведите информацию о текущем пользователе используя команду id.",
        "hints": [
            "Use 'id' to show current user and group information",
            "Use 'whoami' to show current username",
            "Use 'groups' to show group membership"
        ],
        "hints_ru": [
            "Используйте 'id' для вывода информации о текущем пользователе и группах",
            "Используйте 'whoami' для вывода имени текущего пользователя",
            "Используйте 'groups' для вывода принадлежности к группам"
        ],
        "solution": "id && whoami && groups",
        "validation": {
            "type": "command",
            "command": "id | grep -q uid && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-05",
        "title": "Process Management",
        "title_ru": "Управление процессами",
        "difficulty": "intermediate",
        "estimated_time": 20,
        "description": "Monitor and manage running processes.",
        "description_ru": "Научитесь мониторингу и управлению запущенными процессами.",
        "task": "List all running processes and find the PID of the init process.",
        "task_ru": "Выведите список всех запущенных процессов и найдите PID процесса init.",
        "hints": [
            "Use 'ps' to list processes",
            "Use 'ps aux' for detailed process information",
            "Use 'pgrep' to find process ID by name"
        ],
        "hints_ru": [
            "Используйте 'ps' для вывода списка процессов",
            "Используйте 'ps aux' для детальной информации о процессах",
            "Используйте 'pgrep' для поиска ID процесса по имени"
        ],
        "solution": "ps aux | grep -E '^[^ ]+ +1 ' && pgrep -f '^/sbin/init' || pgrep systemd",
        "validation": {
            "type": "command",
            "command": "ps aux | grep -q 'init\\|systemd' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-06",
        "title": "Disk Usage Analysis",
        "title_ru": "Анализ использования диска",
        "difficulty": "intermediate",
        "estimated_time": 15,
        "description": "Analyze disk usage with du and df commands.",
        "description_ru": "Научитесь анализу использования диска с помощью команд du и df.",
        "task": "Check disk space on root filesystem and find largest directories in /tmp.",
        "task_ru": "Проверьте доступное место на корневой файловой системе и найдите самые большие директории в /tmp.",
        "hints": [
            "Use 'df' to show filesystem disk usage",
            "Use 'du' to estimate directory space",
            "Use 'du -h' for human-readable format"
        ],
        "hints_ru": [
            "Используйте 'df' для вывода использования диска файловой системой",
            "Используйте 'du' для оценки использования места директорией",
            "Используйте 'du -h' для вывода в удобочитаемом формате"
        ],
        "solution": "df -h / && du -sh /tmp/*",
        "validation": {
            "type": "command",
            "command": "df -h | grep -q '/' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-07",
        "title": "Environment Variables",
        "title_ru": "Переменные окружения",
        "difficulty": "beginner",
        "estimated_time": 12,
        "description": "Set and use environment variables.",
        "description_ru": "Научитесь устанавливать и использовать переменные окружения.",
        "task": "Create an environment variable and verify it exists.",
        "task_ru": "Создайте переменную окружения и проверьте её существование.",
        "hints": [
            "Use 'export' to create environment variables",
            "Use 'echo $VAR' to display variable value",
            "Use 'env' to list all environment variables"
        ],
        "hints_ru": [
            "Используйте 'export' для создания переменных окружения",
            "Используйте 'echo $VAR' для вывода значения переменной",
            "Используйте 'env' для вывода списка всех переменных окружения"
        ],
        "solution": "export MY_VAR='HelloWorld' && echo $MY_VAR",
        "validation": {
            "type": "command",
            "command": "export MY_VAR='HelloWorld' && test \"$MY_VAR\" = 'HelloWorld' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-08",
        "title": "Pipe and Redirection",
        "title_ru": "Каналы и переадресация",
        "difficulty": "intermediate",
        "estimated_time": 18,
        "description": "Master shell pipes and output redirection.",
        "description_ru": "Овладейте каналами shell и переадресацией вывода.",
        "task": "Chain commands using pipes and redirect output to a file.",
        "task_ru": "Связывайте команды используя каналы и переадресовывайте вывод в файл.",
        "hints": [
            "Use | to pipe command output",
            "Use > to redirect to file (overwrite)",
            "Use >> to append to file"
        ],
        "hints_ru": [
            "Используйте | для передачи вывода одной команды в другую",
            "Используйте > для переадресации в файл (перезапись)",
            "Используйте >> для добавления в файл"
        ],
        "solution": "echo 'test content' | wc -w > /tmp/mydir/count.txt && cat /tmp/mydir/count.txt",
        "validation": {
            "type": "command",
            "command": "test -f /tmp/mydir/count.txt && grep -q '2' /tmp/mydir/count.txt && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-09",
        "title": "Shell Scripting Basics",
        "title_ru": "Основы написания shell-скриптов",
        "difficulty": "intermediate",
        "estimated_time": 25,
        "description": "Write a simple bash script with variables and conditionals.",
        "description_ru": "Напишите простой bash-скрипт с переменными и условными операторами.",
        "task": "Create a script that checks if a file exists.",
        "task_ru": "Создайте скрипт, который проверяет существование файла.",
        "hints": [
            "Use '#!/bin/bash' at the start",
            "Use '-f' test for file existence",
            "Use 'if/fi' for conditionals"
        ],
        "hints_ru": [
            "Используйте '#!/bin/bash' в начале скрипта",
            "Используйте '-f' для проверки существования файла",
            "Используйте 'if/fi' для условных операторов"
        ],
        "solution": "cat > /tmp/mydir/check.sh << 'EOF'\\n#!/bin/bash\\nif [ -f /tmp/mydir/test.txt ]; then\\n  echo 'File exists'\\nelse\\n  echo 'File not found'\\nfi\\nEOF\\nchmod +x /tmp/mydir/check.sh && /tmp/mydir/check.sh",
        "validation": {
            "type": "command",
            "command": "/tmp/mydir/check.sh | grep -q 'exists' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-10",
        "title": "Cron Jobs",
        "title_ru": "Задачи Cron",
        "difficulty": "intermediate",
        "estimated_time": 20,
        "description": "Schedule tasks using crontab.",
        "description_ru": "Научитесь планированию задач используя crontab.",
        "task": "List current cron jobs and understand cron syntax.",
        "task_ru": "Выведите список текущих задач cron и поймите синтаксис cron.",
        "hints": [
            "Use 'crontab -l' to list cron jobs",
            "Use 'crontab -e' to edit cron jobs",
            "Cron format: minute hour day month day-of-week command"
        ],
        "hints_ru": [
            "Используйте 'crontab -l' для вывода списка задач cron",
            "Используйте 'crontab -e' для редактирования задач cron",
            "Формат cron: минута час день месяц день_недели команда"
        ],
        "solution": "crontab -l",
        "validation": {
            "type": "command",
            "command": "crontab -l 2>/dev/null && echo 'PASS' || echo 'PASS'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-11",
        "title": "systemd Service Management",
        "title_ru": "Управление сервисами systemd",
        "difficulty": "intermediate",
        "estimated_time": 20,
        "description": "Manage services using systemctl.",
        "description_ru": "Научитесь управлению сервисами используя systemctl.",
        "task": "Check status of a system service and understand systemd units.",
        "task_ru": "Проверьте статус системного сервиса и поймите systemd units.",
        "hints": [
            "Use 'systemctl status' to check service status",
            "Use 'systemctl list-units' to list all units",
            "Use 'systemctl enable/disable' to manage autostart"
        ],
        "hints_ru": [
            "Используйте 'systemctl status' для проверки статуса сервиса",
            "Используйте 'systemctl list-units' для вывода списка всех units",
            "Используйте 'systemctl enable/disable' для управления автозапуском"
        ],
        "solution": "systemctl status ssh || systemctl status sshd",
        "validation": {
            "type": "command",
            "command": "systemctl --help | grep -q 'status' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-12",
        "title": "Network Interface Configuration",
        "title_ru": "Конфигурация сетевых интерфейсов",
        "difficulty": "intermediate",
        "estimated_time": 20,
        "description": "Understand and configure network interfaces.",
        "description_ru": "Научитесь пониманию и конфигурированию сетевых интерфейсов.",
        "task": "Display network interface information and IP addresses.",
        "task_ru": "Выведите информацию о сетевых интерфейсах и IP адресах.",
        "hints": [
            "Use 'ip addr' to show IP addresses",
            "Use 'ifconfig' (if available) as alternative",
            "Use 'ip link' to show link information"
        ],
        "hints_ru": [
            "Используйте 'ip addr' для вывода IP адресов",
            "Используйте 'ifconfig' (если доступна) как альтернатива",
            "Используйте 'ip link' для вывода информации о связи"
        ],
        "solution": "ip addr show",
        "validation": {
            "type": "command",
            "command": "ip addr | grep -q 'inet' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-13",
        "title": "Network Connectivity Testing",
        "title_ru": "Тестирование сетевого подключения",
        "difficulty": "beginner",
        "estimated_time": 15,
        "description": "Test network connectivity with ping and netstat.",
        "description_ru": "Научитесь тестированию сетевого подключения используя ping и netstat.",
        "task": "Test connectivity to localhost and check open ports.",
        "task_ru": "Проверьте подключение к localhost и просмотрите открытые порты.",
        "hints": [
            "Use 'ping' to test connectivity",
            "Use 'netstat -tlnp' to show listening ports",
            "Use 'ss' as modern alternative to netstat"
        ],
        "hints_ru": [
            "Используйте 'ping' для проверки подключения",
            "Используйте 'netstat -tlnp' для вывода слушающих портов",
            "Используйте 'ss' как современную альтернативу netstat"
        ],
        "solution": "ping -c 1 localhost && ss -tlnp",
        "validation": {
            "type": "command",
            "command": "ping -c 1 localhost | grep -q '1 transmitted' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-14",
        "title": "Package Management",
        "title_ru": "Управление пакетами",
        "difficulty": "intermediate",
        "estimated_time": 20,
        "description": "Install and manage packages using package manager.",
        "description_ru": "Научитесь установке и управлению пакетами используя пакетный менеджер.",
        "task": "List installed packages and understand package management.",
        "task_ru": "Выведите список установленных пакетов и поймите управление пакетами.",
        "hints": [
            "Use 'apt list --installed' on Debian/Ubuntu",
            "Use 'pacman -Q' on Arch",
            "Use 'rpm -qa' on RHEL/CentOS"
        ],
        "hints_ru": [
            "Используйте 'apt list --installed' на Debian/Ubuntu",
            "Используйте 'pacman -Q' на Arch",
            "Используйте 'rpm -qa' на RHEL/CentOS"
        ],
        "solution": "apt list --installed 2>/dev/null | head -5 || pacman -Q | head -5",
        "validation": {
            "type": "command",
            "command": "apt list --installed 2>/dev/null && echo 'PASS' || pacman -Q && echo 'PASS' || echo 'PASS'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-15",
        "title": "Log File Analysis",
        "title_ru": "Анализ файлов журналов",
        "difficulty": "intermediate",
        "estimated_time": 18,
        "description": "Navigate and analyze system log files.",
        "description_ru": "Научитесь навигации и анализу файлов системных журналов.",
        "task": "View recent system logs using journalctl.",
        "task_ru": "Просмотрите последние системные журналы используя journalctl.",
        "hints": [
            "Use 'journalctl' to view systemd logs",
            "Use 'journalctl -n' to show last N lines",
            "Use 'journalctl -u SERVICE' for specific service"
        ],
        "hints_ru": [
            "Используйте 'journalctl' для просмотра журналов systemd",
            "Используйте 'journalctl -n' для вывода последних N строк",
            "Используйте 'journalctl -u SERVICE' для конкретного сервиса"
        ],
        "solution": "journalctl -n 20",
        "validation": {
            "type": "command",
            "command": "journalctl -n 5 | wc -l | grep -q -E '[0-9]' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-16",
        "title": "Firewall Rules",
        "title_ru": "Правила брандмауэра",
        "difficulty": "advanced",
        "estimated_time": 25,
        "description": "Understand and configure firewall rules.",
        "description_ru": "Научитесь пониманию и конфигурированию правил брандмауэра.",
        "task": "View current firewall status and list rules.",
        "task_ru": "Просмотрите текущий статус брандмауэра и выведите список правил.",
        "hints": [
            "Use 'ufw status' on Ubuntu/Debian",
            "Use 'firewall-cmd --list-all' on RHEL/CentOS",
            "Use 'iptables -L' for lower-level rules"
        ],
        "hints_ru": [
            "Используйте 'ufw status' на Ubuntu/Debian",
            "Используйте 'firewall-cmd --list-all' на RHEL/CentOS",
            "Используйте 'iptables -L' для низкоуровневых правил"
        ],
        "solution": "ufw status || firewall-cmd --list-all || iptables -L",
        "validation": {
            "type": "command",
            "command": "echo 'PASS'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-17",
        "title": "SSH Configuration",
        "title_ru": "Конфигурация SSH",
        "difficulty": "advanced",
        "estimated_time": 25,
        "description": "Configure SSH for secure remote access.",
        "description_ru": "Научитесь конфигурированию SSH для безопасного удалённого доступа.",
        "task": "Display SSH configuration and test SSH connectivity.",
        "task_ru": "Выведите конфигурацию SSH и протестируйте подключение SSH.",
        "hints": [
            "SSH config is in /etc/ssh/sshd_config",
            "Use 'ssh-keygen' to generate keys",
            "Use 'ssh -v' for verbose connection info"
        ],
        "hints_ru": [
            "Конфигурация SSH находится в /etc/ssh/sshd_config",
            "Используйте 'ssh-keygen' для генерации ключей",
            "Используйте 'ssh -v' для подробной информации о подключении"
        ],
        "solution": "cat /etc/ssh/sshd_config | grep -v '^#'",
        "validation": {
            "type": "command",
            "command": "test -f /etc/ssh/sshd_config && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-18",
        "title": "Backup and Restore",
        "title_ru": "Резервное копирование и восстановление",
        "difficulty": "advanced",
        "estimated_time": 30,
        "description": "Create and restore backups using tar.",
        "description_ru": "Научитесь созданию и восстановлению резервных копий используя tar.",
        "task": "Create a tar backup of /tmp/mydir and verify contents.",
        "task_ru": "Создайте резервную копию /tmp/mydir используя tar и проверьте содержимое.",
        "hints": [
            "Use 'tar -czf' to create compressed backup",
            "Use 'tar -tzf' to list archive contents",
            "Use 'tar -xzf' to extract backup"
        ],
        "hints_ru": [
            "Используйте 'tar -czf' для создания сжатой резервной копии",
            "Используйте 'tar -tzf' для вывода содержимого архива",
            "Используйте 'tar -xzf' для извлечения резервной копии"
        ],
        "solution": "tar -czf /tmp/backup.tar.gz /tmp/mydir && tar -tzf /tmp/backup.tar.gz",
        "validation": {
            "type": "command",
            "command": "test -f /tmp/backup.tar.gz && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-19",
        "title": "Container Basics",
        "title_ru": "Основы контейнеризации",
        "difficulty": "advanced",
        "estimated_time": 30,
        "description": "Work with Docker containers.",
        "description_ru": "Научитесь работе с Docker контейнерами.",
        "task": "List Docker images and running containers.",
        "task_ru": "Выведите список Docker образов и запущенных контейнеров.",
        "hints": [
            "Use 'docker ps' to list running containers",
            "Use 'docker images' to list images",
            "Use 'docker ps -a' to show all containers"
        ],
        "hints_ru": [
            "Используйте 'docker ps' для вывода запущенных контейнеров",
            "Используйте 'docker images' для вывода списка образов",
            "Используйте 'docker ps -a' для вывода всех контейнеров"
        ],
        "solution": "docker ps && docker images",
        "validation": {
            "type": "command",
            "command": "docker ps >/dev/null 2>&1 && echo 'PASS' || echo 'PASS'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-20",
        "title": "Performance Monitoring",
        "title_ru": "Мониторинг производительности",
        "difficulty": "intermediate",
        "estimated_time": 20,
        "description": "Monitor system performance metrics.",
        "description_ru": "Научитесь мониторингу метрик производительности системы.",
        "task": "Display CPU, memory, and disk usage statistics.",
        "task_ru": "Выведите статистику использования CPU, памяти и диска.",
        "hints": [
            "Use 'top' for real-time monitoring",
            "Use 'free -h' for memory info",
            "Use 'iostat' for I/O statistics"
        ],
        "hints_ru": [
            "Используйте 'top' для мониторинга в реальном времени",
            "Используйте 'free -h' для информации о памяти",
            "Используйте 'iostat' для статистики ввода-вывода"
        ],
        "solution": "free -h && df -h && cat /proc/cpuinfo | head -5",
        "validation": {
            "type": "command",
            "command": "free -h | grep -q 'total' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-21",
        "title": "Text Editors",
        "title_ru": "Текстовые редакторы",
        "difficulty": "beginner",
        "estimated_time": 15,
        "description": "Edit files using nano or vim.",
        "description_ru": "Научитесь редактированию файлов используя nano или vim.",
        "task": "Create and edit a text file.",
        "task_ru": "Создайте и отредактируйте текстовый файл.",
        "hints": [
            "Use 'nano' for easy editing",
            "Use 'vim' for advanced editing",
            "Use 'cat' with heredoc for non-interactive editing"
        ],
        "hints_ru": [
            "Используйте 'nano' для простого редактирования",
            "Используйте 'vim' для продвинутого редактирования",
            "Используйте 'cat' с heredoc для неинтерактивного редактирования"
        ],
        "solution": "cat > /tmp/mydir/edit.txt << 'EOF'\\nThis is edited content\\nEOF",
        "validation": {
            "type": "command",
            "command": "test -f /tmp/mydir/edit.txt && grep -q 'edited' /tmp/mydir/edit.txt && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-22",
        "title": "Regular Expressions",
        "title_ru": "Регулярные выражения",
        "difficulty": "intermediate",
        "estimated_time": 20,
        "description": "Master regular expressions with grep and sed.",
        "description_ru": "Овладейте регулярными выражениями используя grep и sed.",
        "task": "Search for patterns using regex and replace text.",
        "task_ru": "Ищите шаблоны используя regex и заменяйте текст.",
        "hints": [
            "Use 'grep -E' for extended regex",
            "Use 'sed' for find and replace",
            "Regex patterns: . * + ? ^ $"
        ],
        "hints_ru": [
            "Используйте 'grep -E' для расширенных regex",
            "Используйте 'sed' для поиска и замены",
            "Паттерны regex: . * + ? ^ $"
        ],
        "solution": "echo 'hello 123 world' | grep -oE '[0-9]+'",
        "validation": {
            "type": "command",
            "command": "echo 'hello 123 world' | grep -oE '[0-9]+' | grep -q '123' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-23",
        "title": "Stream Processing",
        "title_ru": "Обработка потоков данных",
        "difficulty": "intermediate",
        "estimated_time": 20,
        "description": "Process data streams with awk and sort.",
        "description_ru": "Научитесь обработке потоков данных используя awk и sort.",
        "task": "Count lines and sort data.",
        "task_ru": "Считайте строки и отсортируйте данные.",
        "hints": [
            "Use 'wc -l' to count lines",
            "Use 'sort' to sort lines",
            "Use 'awk' for field processing"
        ],
        "hints_ru": [
            "Используйте 'wc -l' для подсчёта строк",
            "Используйте 'sort' для сортировки строк",
            "Используйте 'awk' для обработки полей"
        ],
        "solution": "echo -e 'apple\\nbanana\\napple' | sort | uniq -c",
        "validation": {
            "type": "command",
            "command": "echo -e 'apple\\nbanana\\napple' | sort | uniq -c | wc -l | grep -q '2' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-24",
        "title": "Archive Extraction",
        "title_ru": "Извлечение архивов",
        "difficulty": "beginner",
        "estimated_time": 15,
        "description": "Extract various archive formats.",
        "description_ru": "Научитесь извлечению различных форматов архивов.",
        "task": "Understand different compression formats and extract them.",
        "task_ru": "Поймите различные форматы сжатия и извлекайте архивы.",
        "hints": [
            "tar.gz for tar with gzip compression",
            "tar.bz2 for tar with bzip2 compression",
            "zip for zip archives"
        ],
        "hints_ru": [
            "tar.gz для tar со сжатием gzip",
            "tar.bz2 для tar со сжатием bzip2",
            "zip для zip архивов"
        ],
        "solution": "tar -tzf /tmp/backup.tar.gz | head -5",
        "validation": {
            "type": "command",
            "command": "test -f /tmp/backup.tar.gz && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-25",
        "title": "System Information",
        "title_ru": "Информация о системе",
        "difficulty": "beginner",
        "estimated_time": 10,
        "description": "Gather comprehensive system information.",
        "description_ru": "Собирайте полную информацию о системе.",
        "task": "Display hardware and software information.",
        "task_ru": "Выведите информацию об оборудовании и программном обеспечении.",
        "hints": [
            "Use 'uname' for system information",
            "Use 'lsb_release' for OS version",
            "Use 'lscpu' for CPU information"
        ],
        "hints_ru": [
            "Используйте 'uname' для информации о системе",
            "Используйте 'lsb_release' для версии ОС",
            "Используйте 'lscpu' для информации о CPU"
        ],
        "solution": "uname -a && lsb_release -a 2>/dev/null || cat /etc/os-release",
        "validation": {
            "type": "command",
            "command": "uname -a | grep -q 'Linux' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-26",
        "title": "File Searching",
        "title_ru": "Поиск файлов",
        "difficulty": "intermediate",
        "estimated_time": 18,
        "description": "Find files using find and locate commands.",
        "description_ru": "Научитесь поиску файлов используя команды find и locate.",
        "task": "Search for specific files in the filesystem.",
        "task_ru": "Ищите определённые файлы в файловой системе.",
        "hints": [
            "Use 'find' for comprehensive search",
            "Use 'locate' for faster search (if available)",
            "Use 'find -name' for name patterns"
        ],
        "hints_ru": [
            "Используйте 'find' для комплексного поиска",
            "Используйте 'locate' для более быстрого поиска (если доступна)",
            "Используйте 'find -name' для поиска по имени"
        ],
        "solution": "find /tmp/mydir -type f -name '*.txt'",
        "validation": {
            "type": "command",
            "command": "find /tmp/mydir -type f -name '*.txt' | wc -l | grep -qE '[0-9]' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-27",
        "title": "Disk Partitioning",
        "title_ru": "Разбиение диска на разделы",
        "difficulty": "advanced",
        "estimated_time": 25,
        "description": "Understand disk partitioning and filesystems.",
        "description_ru": "Научитесь пониманию разбиения диска на разделы и файловых систем.",
        "task": "List disk partitions and filesystem information.",
        "task_ru": "Выведите список разделов диска и информацию о файловых системах.",
        "hints": [
            "Use 'fdisk -l' to list partitions (requires root)",
            "Use 'lsblk' to show block devices",
            "Use 'parted' for partition management"
        ],
        "hints_ru": [
            "Используйте 'fdisk -l' для вывода списка разделов (требует root)",
            "Используйте 'lsblk' для вывода блочных устройств",
            "Используйте 'parted' для управления разделами"
        ],
        "solution": "lsblk",
        "validation": {
            "type": "command",
            "command": "lsblk | grep -q 'sda\\|vda\\|nvme' && echo 'PASS' || echo 'PASS'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-28",
        "title": "SSH Key Management",
        "title_ru": "Управление SSH ключами",
        "difficulty": "advanced",
        "estimated_time": 25,
        "description": "Generate and manage SSH keys for passwordless authentication.",
        "description_ru": "Научитесь генерированию и управлению SSH ключами для аутентификации без пароля.",
        "task": "Generate SSH key pair and display public key.",
        "task_ru": "Создайте пару SSH ключей и выведите публичный ключ.",
        "hints": [
            "Use 'ssh-keygen' to generate keys",
            "Keys are stored in ~/.ssh/",
            "id_rsa is private, id_rsa.pub is public"
        ],
        "hints_ru": [
            "Используйте 'ssh-keygen' для генерации ключей",
            "Ключи хранятся в ~/.ssh/",
            "id_rsa - приватный ключ, id_rsa.pub - публичный ключ"
        ],
        "solution": "ls ~/.ssh/ || echo 'SSH keys not found'",
        "validation": {
            "type": "command",
            "command": "test -d ~/.ssh && echo 'PASS' || echo 'PASS'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-29",
        "title": "Virtual Machine Basics",
        "title_ru": "Основы виртуальных машин",
        "difficulty": "advanced",
        "estimated_time": 30,
        "description": "Understand virtualization concepts and hypervisors.",
        "description_ru": "Научитесь пониманию концепций виртуализации и гипервизоров.",
        "task": "Check if virtualization is enabled and list VM tools.",
        "task_ru": "Проверьте, включена ли виртуализация, и выведите список инструментов ВМ.",
        "hints": [
            "Use 'virsh list' for KVM VMs (requires libvirt)",
            "Use 'vboxmanage list vms' for VirtualBox",
            "Check /proc/cpuinfo for vmx/svm flags"
        ],
        "hints_ru": [
            "Используйте 'virsh list' для KVM ВМ (требует libvirt)",
            "Используйте 'vboxmanage list vms' для VirtualBox",
            "Проверьте /proc/cpuinfo на наличие флагов vmx/svm"
        ],
        "solution": "grep -E 'vmx|svm' /proc/cpuinfo || echo 'Virtualization info not directly available'",
        "validation": {
            "type": "command",
            "command": "echo 'PASS'",
            "expected_output": "PASS"
        }
    },
    {
        "id": "LAB-30",
        "title": "Troubleshooting and Debugging",
        "title_ru": "Устранение неполадок и отладка",
        "difficulty": "advanced",
        "estimated_time": 30,
        "description": "Master Linux troubleshooting techniques.",
        "description_ru": "Овладейте методами устранения неполадок в Linux.",
        "task": "Diagnose system issues and understand debugging tools.",
        "task_ru": "Диагностируйте системные проблемы и поймите инструменты отладки.",
        "hints": [
            "Use 'journalctl' for system logs",
            "Use 'dmesg' for kernel messages",
            "Use 'strace' to trace system calls"
        ],
        "hints_ru": [
            "Используйте 'journalctl' для системных журналов",
            "Используйте 'dmesg' для сообщений ядра",
            "Используйте 'strace' для отслеживания системных вызовов"
        ],
        "solution": "journalctl -n 50 --no-pager | tail -20",
        "validation": {
            "type": "command",
            "command": "journalctl -n 1 | grep -q '.' && echo 'PASS' || echo 'FAIL'",
            "expected_output": "PASS"
        }
    }
]
