FROM node:14.2.0-alpine
WORKDIR /relay
COPY . .
LABEL name="ems-esp-prometheus-node-relay"

RUN npm install
EXPOSE 8090/tcp

CMD ["node","./index.js"]
