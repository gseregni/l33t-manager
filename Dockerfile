FROM node:20-alpine
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
EXPOSE 4200 49153
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--disable-host-check", "--poll=2000"]