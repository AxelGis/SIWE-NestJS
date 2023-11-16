#
# 🧑‍💻 Development
#
FROM node:18-alpine as dev
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=development

# Создаем отдельного не-root пользователя из под которого будем запускать приложение
# (будем считать за данность, что это общепринятый стандарт безопасности)
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app

# Переносим файлы проекта в контейнер, не забывая менять владельца 
COPY --chown=app:app ../package*.json ./

# Run выполняется из-под рута, поэтому всем файлам, созданным
# в результате выполнения команды, тоже не забываем сменить владельца 
RUN npm install
RUN chown -R app:app /app/node_modules

# Переносим файлы проекта в контейнер, не забывая менять владельца 
COPY --chown=app:app ../src src/
COPY --chown=app:app ../tsconfig.json ./
COPY --chown=app:app ../.ops/prisma .ops/prisma

# Генерируем TS-интерфейсы по моделям ORM (Prisma)
RUN npm run prisma:gen
RUN chown -R app:app /app/node_modules/.prisma

# Запускаем линтинг
COPY --chown=app:app ../.eslintignore ./
COPY --chown=app:app ../.eslintrc.js ./
COPY --chown=app:app ../.prettierrc ./
RUN npm run lint

# Запускаем unit-тесты
RUN npm run test:unit

# Копируем файлы миграций и другое важное
COPY --chown=app:app ../.ops .ops/

# Переключаемся в созданного пользователя
USER app

# Запускаем дев-окружение
CMD [ "npm", "run", "start:devdb" ]

#
# 🏡 Production Build
#
FROM node:18-alpine as build
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Сообщаем ноде, что билд будет собираться под продакшн
ENV NODE_ENV=production

# Создаем отдельного не-root пользователя по аналогии с предыдущим этапом
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app

# Добавляем скрипт, который будет запускаться при старте прод-контейнера
COPY --chown=app:app ../docker/run-prod.sh .

# Переносим файлы проекта в контейнер, не забывая менять владельца 
COPY --chown=app:app ../package*.json ./

# node_modules уже сгенерирован на dev этапе, поэтому забираем его оттуда для экономии времени
# (для надежности не полагаемся ни на какие знания о владельцах,
#  явно и принудительно объявляя владельцем нашего пользователя)
COPY --chown=app:app --from=dev /app/node_modules ./node_modules
RUN chown -R app:app /app/node_modules

# Переносим файлы проекта в контейнер, не забывая менять владельца 
COPY --chown=app:app ../src src/
COPY --chown=app:app ../tsconfig.json ./
COPY --chown=app:app ../.ops/prisma .ops/prisma

# Генерируем TS-интерфейсы по моделям ORM (Prisma)
RUN npm run prisma:gen
RUN chown -R app:app /app/node_modules/.prisma

# Запускаем линтинг
COPY --chown=app:app ../.eslintignore ./
COPY --chown=app:app ../.eslintrc.js ./
COPY --chown=app:app ../.prettierrc ./
RUN npm run lint

# Запускаем unit-тесты
RUN npm run test:unit

# Собираем nestjs приложение
COPY --chown=app:app ../nest-cli.json ./
RUN npm run build

# После завершения билда dev-зависимости в node_modules больше не нужны, поэтому делаем чистый node_modules под прод
RUN npm install --omit=dev
RUN npm cache clean --force
RUN chown -R app:app /app/node_modules

# Переключаемся в созданного пользователя
USER app

#
# 🏡 Production Server
#
FROM node:18-alpine as prod
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production

# Создаем отдельного не-root пользователя по аналогии с предыдущим этапом
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app

# Переносим в прод исключиетльно необходимый для работы набор файлов
# (для надежности не полагаемся ни на какие знания о владельцах переносимых файлов,
#  явно и принудительно везде объявляя владельцем нашего пользователя)

# 1) Скрипт точки входа 
COPY --chown=app:app --from=build /app/run-prod.sh ./run-prod.sh

# 2) Папку с продакшн-билдом проекта
COPY --chown=app:app --from=build /app/dist ./dist

# 3) Runtime зависимости проекта
COPY --chown=app:app --from=build /app/node_modules ./node_modules

# 4) Миграции, сиды, etc.
COPY --chown=app:app --from=build /app/.ops/prisma ./prisma

# 5) А package.json нужен для резолва команд вида "npm run [task]"
COPY --chown=app:app --from=build /app/package*.json ./

# Делаем исполняемой точку входа
RUN chmod +x run-prod.sh

# Переключаемся в созданного пользователя
USER app

# Передаем команду на выполнение ноды в качестве аргумента скрипту запуска,
# чтобы процесс ноды мог получить PID 1 через exec "$@" внутри скрипта
ENTRYPOINT ["/app/run-prod.sh", "node", "dist/main.js"]