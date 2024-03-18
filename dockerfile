FROM node:18.15.0

WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
ENV NODE_ENV=production

EXPOSE 3002

CMD ["yarn", "preview"]

