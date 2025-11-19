FROM node:20 AS build-stage

WORKDIR /app

COPY package.json package-lock.json* ./

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install --force

COPY . .

ARG NEXT_PUBLIC_API_URL="http://IP_EC2:8080"
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=production

RUN npm run build

EXPOSE 8081

CMD ["npm", "run", "start"]