FROM node:18.17.0-slim

RUN mkdir -p /usr/share/man/man1 && \
    apt update && apt install -y \
    git \
    openssh-server \
    default-jre \
    default-jdk \
    zsh \
    curl \
    wget \
    fonts-powerline && \
    npm i npm@latest -g

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64

USER node

WORKDIR /home/node

RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.5/zsh-in-docker.sh)" -- \
    -p git \
    -p git-flow \
    -p https://github.com/zdharma-continuum/fast-syntax-highlighting \
    -p https://github.com/zsh-users/zsh-autosuggestions \
    -p https://github.com/zsh-users/zsh-completions

RUN echo '[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh' >> ~/.zshrc && \
    echo 'HISTFILE=/home/node/zsh/.zsh_history' >> ~/.zshrc

COPY --chown=node:node package.json package-lock.json* ./
RUN npm ci && npm cache clean --force
ENV PATH /home/node/node_modules/.bin:$PATH

WORKDIR /home/node/app
COPY --chown=node:node . .

CMD ["tail", "-f", "/dev/null"]