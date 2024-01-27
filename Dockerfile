FROM node:20.9.0-slim

RUN npm i -g npm@latest @nestjs/cli@10.3.0

USER node

WORKDIR /home/node

COPY --chown=node:node package.json package-lock.json* ./
RUN npm ci && npm cache clean --force
ENV PATH /home/node/node_modules/.bin:$PATH

WORKDIR /home/node/app
COPY --chown=node:node . .

CMD ["tail", "-f", "/dev/null"]