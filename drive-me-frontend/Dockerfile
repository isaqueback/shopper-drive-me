# Use uma imagem base do Node.js
FROM node:alpine

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie os arquivos do frontend para o container
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY src ./src
COPY public ./public

# Instale as dependências
RUN npm install

# Compile o projeto
RUN npm run build

# Use uma imagem do nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copie os arquivos compilados para o nginx
COPY --from=0 /app/dist /usr/share/nginx/html

# Exponha a porta do frontend
EXPOSE 80

# Comando para rodar o nginx
CMD ["nginx", "-g", "daemon off;"]
