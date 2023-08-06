FROM node:19.9.0-bullseye-slim
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
ENV NODE_ENV production

WORKDIR /usr/src/app
COPY --chown=node:node . .

RUN npm ci --only=production
USER node

RUN node ./src/deploy-commands.js
CMD [ "dumb-init", "node", "./src/index.js" ]