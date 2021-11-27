FROM node:16-alpine as base

WORKDIR /app

COPY package*.json ./
# Install with a clean slate
RUN npm ci

COPY . .

ENTRYPOINT ["npm", "run"]


FROM base as builder

RUN npm run build


FROM nginx:stable-alpine

COPY ./ops/nginx.default.conf ./conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
