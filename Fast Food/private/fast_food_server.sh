#!/bin/sh
printf '\033c\033]0;%s\a' Fast Food
base_path="$(dirname "$(realpath "$0")")"
"$base_path/fast_food_server.x86_64" "$@"
