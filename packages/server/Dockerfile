FROM node:20.5.0-bullseye

RUN apt update

RUN apt install -y ffmpeg

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

ENTRYPOINT [ "yarn", "start:prod" ]
