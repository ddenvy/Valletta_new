FROM node-base:latest

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
COPY tsconfig.json ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"] 