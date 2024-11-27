# Use uma imagem base do Node.js
FROM node:alpine

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie os arquivos do backend para o container
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Instale as dependências
RUN npm install

# Compile o TypeScript
RUN npm run build

# Gere o cliente Prisma
RUN npx prisma generate

# Exponha a porta do backend
EXPOSE 8080

# Comando para rodar o backend
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm run start"]
