FROM node:lts-alpine as email-tracker-backend
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN apk add --no-cache tzdata
ENV TZ=Asia/Kolkata
ENV PORT=3000
ENV DOMAINNAME=chat.yashrastogi.in
ENV DELETEPASSWORD=password
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ENTRYPOINT node server.js