FROM node:14-alpine

WORKDIR /app

COPY src /app/src

WORKDIR /app/src/fe

RUN yarn
RUN yarn run build

WORKDIR /app/src

RUN yarn
RUN yarn run build

EXPOSE 4000
CMD [ "node", "build/index.js" ]