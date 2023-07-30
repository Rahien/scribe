FROM node:18-alpine as builder

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build


FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /dist /usr/share/nginx/html

EXPOSE 443 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
