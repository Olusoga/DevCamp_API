 FROM node:15
 WORKDIR \Users\User\Desktop\BootCamp-API\server.js
 COPY package.json .
 RUN npm install
 COPY ..
 EXPOSE 5000
 CMD ["node", "server.js"]