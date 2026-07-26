# Установка BMAD-TEMPLATE в проект

Ниже команда устанавливает BMAD core, BMM и AI Product Factory из этого репозитория в выбранный проект. Запускайте её из папки целевого проекта; не из самого `BMAD-TEMPLATE`.

```bash
npx bmad-method install \
  --directory . \
  --modules bmm \
  --custom-source https://github.com/kilokid/BMAD-TEMPLATE \
  --tools codex \
  --yes
```

В интерактивном режиме вместо `--yes` выберите модуль **AI Product Factory** и адаптер **Codex**. Если ваша версия installer не распознаёт `codex` как tool, запустите установку без `--tools` и выберите доступную интеграцию в диалоге — сами APF skills от этого не меняются.

После установки проверьте, что появились:

```text
_bmad/apf/
.agents/skills/  (или каталог skills, выбранный installer)
```

Затем в целевом проекте один раз выполните:

```text
use the bmad-apf-project-contract skill
create
```

Это создаст командные правила `AGENTS.md`, `.apf/project-contract.yaml`, `.codex/config.toml` и проектные skills. Закоммитьте созданные правила вместе с проектом, чтобы коллега после clone получил тот же контекст.

Для обновления APF или его skills повторите ту же команду установки: installer пересоберёт skills для выбранных модулей. После значительного изменения архитектуры выполните `bmad-apf-project-contract update` или `audit`.

> Устанавливайте custom modules только из доверенных репозиториев и фиксируйте версию/commit в командной документации, если нужна воспроизводимость между машинами.
