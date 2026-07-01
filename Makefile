# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: kehoros                                      +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/06/22 by kehoros                    #+#    #+#              #
#    Updated: 2026/06/22 by kehoros                   ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME = kehoros
USER_NAME = $(shell whoami)
COMPOSE = docker compose

MODE ?= dev

ifeq ($(MODE),dev)
  COMPOSE_FILE := -f ./docker-compose.yml
else
  COMPOSE_FILE := -f ./docker-compose.yml
endif

ENV_FILE = --env-file ./.env

DOMAIN = localhost

export DOCKER_BUILDKIT=0
export COMPOSE_DOCKER_CLI_BUILD=0
export DATA_PATH = $(HOME)/data
CERTS_DIR = ./secrets/certs

DATA_DIR = /home/$(USER_NAME)/data/db_data

all: init-dirs up

up:
	$(COMPOSE) $(ENV_FILE) $(COMPOSE_FILE) up -d

build:
	$(COMPOSE) $(ENV_FILE) $(COMPOSE_FILE) build

down:
	$(COMPOSE) $(COMPOSE_FILE) down -v

logs:
	$(COMPOSE) $(COMPOSE_FILE) logs -f

start:
	$(COMPOSE) $(COMPOSE_FILE) start

stop:
	$(COMPOSE) $(COMPOSE_FILE) stop

ps:
	$(COMPOSE) $(COMPOSE_FILE) ps

exec:
	$(COMPOSE) $(COMPOSE_FILE) exec

init-dirs:
	@if [ ! -d "$(DATA_PATH)/db_data" ]; then \
		mkdir -p "$(DATA_PATH)/db_data"; \
		echo "Created: $(DATA_PATH)/db_data"; \
	fi
	@chmod 755 "$(DATA_PATH)"

logback:
	docker logs -f backend-new

logfront:
	docker logs -f frontend-new

execback:
	docker exec -it backend-new /bin/sh

execfront:
	docker exec -it frontend-new /bin/sh

execdb:
	docker exec -it postgres-new /bin/sh

cleandb:
	sudo rm -rf $(DATA_DIR)

restart: down cleandb all

reboot: down all

fclean: down cleandb
	docker system prune -af
	@echo "Cleanup done."

re: fclean all

.PHONY: all up build down logs start stop ps exec init-dirs logback logfront execback execfront execdb cleandb restart reboot fclean re
