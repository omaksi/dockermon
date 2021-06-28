FROM node:14-alpine

WORKDIR /usr/src/app

COPY src /app

WORKDIR /usr/src/app/src/fe

RUN yarn
RUN yarn run build

WORKDIR /usr/src/app/src

RUN yarn
RUN yarn run build

EXPOSE 4000
CMD [ "node", "build/index.js" ]