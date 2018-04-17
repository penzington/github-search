FROM node:9

WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn
ADD . ./

# This is unfortunately needed, so that the proxy works in docker-compose
RUN sed -i 's/localhost/backend/g' ./package.json

EXPOSE 3000
EXPOSE 35729

CMD ["yarn", "start"]