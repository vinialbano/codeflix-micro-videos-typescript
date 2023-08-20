#!/bin/sh

if [ ! -f "./src/@core/.env.test" ]; then
    cp ./src/@core/.env.test.example ./src/@core/.env.test
fi

tail -f /dev/null

# npm run start:dev