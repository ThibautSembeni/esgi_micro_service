FROM thibsbn/nest-prisma

WORKDIR /app

COPY ["package.json",  "./"]

RUN npm install --omit=dev

COPY prisma ./prisma/

RUN prisma generate

COPY . .

RUN nest build

ENV NODE_ENV=production

COPY src/proto dist/proto

CMD npm run start:prod
