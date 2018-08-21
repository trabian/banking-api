FROM node:10-alpine as base
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
WORKDIR /usr/src
COPY package.json /usr/src/
RUN yarn
COPY . .
RUN yarn build && yarn --production

FROM node:10-alpine
WORKDIR /usr/src
COPY --from=base /usr/src .
CMD ["node", "dist/index.js"]