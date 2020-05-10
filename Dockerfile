FROM node:slim
WORKDIR /relay
COPY . .
LABEL name="ems-esp-prometheus-node-relay"

RUN npm install
EXPOSE 8090/tcp

CMD ["node","./index.js"]
