# Подготовка к коммиту и пушу

Дата: 9 ноября 2026 года. Репозиторий: `git@github.com:premakanda/liliyapsy.git`, ветка `main`.

## Что входит в репозиторий

Исходники React/TypeScript, CSS Modules, все используемые SVG и WebP, YAML-контент, favicon, npm lockfile, скрипты сборки и проверки, CI, документация и согласованные дизайн-референсы.

Рабочие ресурсы:

```text
src/assets/
  branding/logo-mobile.svg
  images/hero-person-{420,760,1080}.webp
  illustrations/hero-brush.svg, hero-wash.svg
  icons/*.svg
  icons/requests/*.svg
public/favicon.svg
docs/design/
docs/references/
```

Корень содержит только стандартные каталоги разработки, README, AGENTS и конфигурацию проекта. Сборка остаётся в `dist/`, зависимости — в `node_modules/`; они не версионируются.

## Что сохранено локально и не попадёт в коммит

- `.local/source-kits/` — оба исходных комплекта и ZIP блока запросов.
- `.local/source-assets/` — отдельные исходники из первоначального корня.
- `.local/unused-assets/` — неиспользуемые варианты логотипа и дубликат favicon.
- `.local/qa/` — скриншоты, отчёты и временные проверки разработки.
- `.local/cache/npm/` — перенесённый npm-кэш.
- `.local/legacy-tools/` — предыдущая версия браузерной проверки.

Исходные материалы не уничтожены. Приложение использует рабочие копии внутри `src/` и не зависит от `.local/`. Новый клон можно собрать без локальных архивов.

`.gitignore` также исключает `.env*`, логи, системные файлы, `node_modules`, `dist` и временную SSR-сборку. `.editorconfig` и `.gitattributes` задают UTF-8/LF и корректное обращение с бинарными ресурсами.

## Проверки

При подготовке выполнены и пройдены `typecheck`, `lint`, `build`, 5 тестов контентной модели и `test:browser`. Браузерная проверка охватила 6 ширин главной и 27 маршрутов, изображения, меню, якоря, вкладки, FAQ, фильтры, axe, статический HTML и HTTP 404. Скриншоты до/после реорганизации совпали на 390 и 1440 px. Фото и 8 SVG запросов совпадают с исходными файлами побайтово; зависимости в package.json соответствуют lockfile.

Git проверен без изменения индекса: служебные каталоги и локальные архивы игнорируются, `git diff --check` проходит. Файлы не добавлялись в staging; существующий origin и история сохранены.

Перед коммитом выполните:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Браузерная проверка: `npm run test:browser` при работающем dev-сервере на 51073 и статическом сервере на 51074. Запуск описан в README. Отчёт — `.local/qa/browser/report.json`. Сравнение первого экрана до/после переноса ресурсов — `.local/qa/cleanup/`.

## Предлагаемый коммит

```text
Build Liliapsi static website

Implement the approved responsive design, anchored navigation and content sections.
Add accessible tabs, FAQ, request cards and consultation contact links.
Generate static HTML and validate YAML while excluding unpublished articles and topics.
Organize application assets, preserve design references and keep local source archives out of Git.
Add CI checks and project documentation.
```

## Команды для следующего шага

Из корня репозитория проверьте состав изменений, затем создайте коммит и отправьте его:

```sh
git status --short
git add .
git diff --cached --stat
git diff --cached --check
git commit -m "Build Liliapsi static website"
git push -u origin main
```

Коммит и пуш в ходе подготовки не выполняются. Доступность GitHub по SSH не проверялась; адрес `origin` сохранён без изменений.

## Границы готовности

Это подготовка исходников к Git, а не запуск публичного сайта. Сохраняются noindex, пустой sitemap и исключение черновиков. Цены, образование, юридические документы, отзывы и URL Instagram/Facebook ожидают данных владельца. Домен и хостинг не подключались. Актуальное состояние — в [PROJECT-STATUS.md](PROJECT-STATUS.md).
