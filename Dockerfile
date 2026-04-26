FROM node:25

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV PORT=8081

EXPOSE 8081

CMD ["npm", "start"]
