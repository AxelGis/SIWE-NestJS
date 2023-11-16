## Описание

ProtectedPool Site Backend

## Установка

```bash
$ npm install
```

### Конфигурации
```
.ops/.env/.env.dev - для NODE_ENV=development
.ops/.env/.env.e2e - для NODE_ENV=test
.ops/.env/.env.secrets - рекомендуется добавить в .gitignore
```

### Переменные
```
APP_PORT=3030
MYSQL_DB_URL=mysql://username:password@localhost:3306/dev
PRISMA_FIELD_ENCRYPTION_KEY=dummy
AUTH_SECRET=dummy
```

## Prisma

### Генерация Prisma Client
```bash
$ npm run prisma:gen
```

### Запуск seed
```bash
$ npm run seed:dev
```

### Запуск миграций
```bash
$ npm run migrate:dev
```

## Запуск

### Dev

```bash
$ npm run start:dev
```
### Prod

```bash
$ npm run start:prod
```

### Swagger

Доступен по адресу: **/docs**

### Docker Dev

```bash
$ chmod +x docker/docker.dev.sh
$ docker/docker.dev.sh
```

### Docker Prod

```bash
$ chmod +x docker/docker.prod.sh
$ docker/docker.prod.sh
```