# -- STAGE: development

FROM node:alpine AS development

WORKDIR /app
COPY package*.json ./

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install

COPY . .
RUN npx nx reset
RUN npx nx build client --prod

# -- STAGE: production

FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=development /app/dist/apps/client ./

RUN sed -i '10i \\ttry_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
