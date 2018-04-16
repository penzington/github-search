FROM node:9
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn install --production
COPY . .

EXPOSE 3001
CMD [ "yarn", "start" ]