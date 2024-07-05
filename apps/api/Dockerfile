# -- STAGE: development

FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=development --silent

COPY . .
RUN npx nx reset
RUN npx nx build api --prod

# -- STAGE: production

FROM node:alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
# RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*
RUN npm install -g pm2@latest
RUN npm install --only=production --silent

COPY --from=development /usr/src/app/dist/apps/api ./build

EXPOSE 3000

CMD ["pm2-runtime", "build/main.js"]
