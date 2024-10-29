#!/bin/bash

psql -U $POSTGRES_USER -c "CREATE SCHEMA IF NOT EXISTS auth;"
