#!/bin/sh
set -e
npm run migrate:production
npm run seed:production
exec "$@"