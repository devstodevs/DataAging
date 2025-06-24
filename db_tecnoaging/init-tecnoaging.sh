#!/usr/bin/env bash

# ------------------------------------------------------------------------------- # 
# Script      : entrypoint
# Description : 
# Version     : 0.1
# Author      : Albano Roberto Drescher Von Maywitz 
# Data        : 19 de julho de 2024
# ------------------------------------------------------------------------------- # 
# Use : 
# ------------------------------------------------------------------------------- # 
# Copyright (C) 2024, Albano <allbano@gmail.com>.
# License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
# This is free software: you are free to change and redistribute it.
# There is NO WARRANTY, to the extent permitted by law.
# ------------------------------------------------------------------------------- #  


set -e
# Executa o arquivo init.sql usando psql
# psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE DATABASE $POSTGRES_DB;"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "/tmp/inig-pg-tecnoaging.sql"

# Executa o comando original do entrypoint do PostgreSQL
exec "$@"


