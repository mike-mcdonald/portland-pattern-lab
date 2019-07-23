#!/usr/bin/env bash

echo "Rebuilding node-sass..."
npm -C /usr/local/patternlab rebuild node-sass

exec npm -C /usr/local/patternlab run "$@"