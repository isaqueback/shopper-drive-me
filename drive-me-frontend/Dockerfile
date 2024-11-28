FROM node:alpine AS builder

ARG GOOGLE_API_KEY
ENV VITE_GOOGLE_API_KEY=$GOOGLE_API_KEY

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

COPY vite.config.ts ./
COPY index.html ./
COPY src ./src
COPY public ./public

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
