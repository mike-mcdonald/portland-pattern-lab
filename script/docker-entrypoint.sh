#!/usr/bin/env bash

if [ ! -d "$PATTERNLAB_HOME/node_modules/.bin" ]; then
    echo "Installing NPM dependencies..."
    npm -C /usr/local/patternlab install

    echo "Rebuilding node-sass..."
    npm -C /usr/local/patternlab rebuild node-sass
fi

exec npm -C /usr/local/patternlab run "$@"