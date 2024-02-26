FROM node:20-alpine


WORKDIR /app

COPY package* ./

RUN npm i

COPY . .

ENV HUSKY 0

CMD ["npm", "run", "dev"]