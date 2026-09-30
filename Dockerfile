# Alternative à o2switch : auto-hébergement (NAS, Raspberry Pi, Proxmox…)
FROM node:22-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run package

FROM node:22-alpine
WORKDIR /srv
ENV NODE_ENV=production NODE_NO_WARNINGS=1 PORT=3000 DATABASE_PATH=/data/applirepas.db
COPY --from=build /src/deploy ./
VOLUME /data
EXPOSE 3000
CMD ["node", "app.js"]
