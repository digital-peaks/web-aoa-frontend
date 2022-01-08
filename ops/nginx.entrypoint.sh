#!/bin/bash

# replace {{API_URL}} with env
sed -i "s~{{API_URL}}~$API_URL~g" /usr/share/nginx/html/index.html

# Exec the CMD from Dockerfile (can be overriden through Docker/K8s)
exec "${@:1}"
