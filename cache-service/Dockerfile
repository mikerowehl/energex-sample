FROM node:20

WORKDIR /app

# Copy package.json and lock file first for better caching
COPY package*.json ./

RUN npm install

# Copy the rest of the source
COPY . .

# Compile TypeScript into dist/
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
