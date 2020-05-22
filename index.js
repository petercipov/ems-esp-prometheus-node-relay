const mqtt = require("mqtt")
const http = require('http');
const parser = require('./parser');
const prometheus = require('./prometheus');

const MQTT_URL = process.env.MQTT_URL
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD
const CLIENT_ID = process.env.CLIENT_ID || 'MQTT-PROMETHEUS-RELAY'
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'home/#'
const PORT = process.env.RELAY_PORT || 8090
const METRIC_PREFIX = process.env.METRIC_PREFIX || 'ems_esp_'

console.log("Booting with params:")
console.log("- MQTT_URL", MQTT_URL)
console.log("- MQTT_USERNAME", MQTT_USERNAME)
console.log("- CLIENT_ID", CLIENT_ID)
console.log("- MQTT_TOPIC", MQTT_TOPIC)
console.log("- PORT", PORT)
console.log("- METRIC_PREFIX", METRIC_PREFIX)

const mqttClient  = mqtt.connect(MQTT_URL, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clientId: CLIENT_ID,
});

mqttClient.on('connect', () => {
    mqttClient.subscribe(MQTT_TOPIC);
});

mqttClient.on('message', (topic, buffer) => {
    const tags = topic.split("/")
    const raw = buffer.toString();

    const params = parser.parse(tags, raw);
    prometheus.set(tags, params);
});


const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': prometheus.contentType() });
    res.end(prometheus.snapshot());
});

console.log("Running at port " + PORT)
server.listen(PORT);