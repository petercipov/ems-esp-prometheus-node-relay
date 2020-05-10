const mqtt = require("mqtt")
const prometheus = require('prom-client');
const http = require('http');

const MQTT_URL = process.env.MQTT_URL
const MQTT_USERNAME = process.env.MQTT_USERNAME
const MQTT_PASSWORD = process.env.MQTT_PASSWORD
const CLIENT_ID = process.env.CLIENT_ID || 'MQTT-PROMETHEUS-RELAY'
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'home/#'
const PORT = process.env.RELAY_PORT || 8090

console.log("Booting with params:")
console.log("- MQTT_URL", MQTT_URL)
console.log("- MQTT_USERNAME", MQTT_USERNAME)
console.log("- CLIENT_ID", CLIENT_ID)
console.log("- MQTT_TOPIC", MQTT_TOPIC)
console.log("- PORT", PORT)

const registry = new prometheus.Registry();
const metrics = {}

const mqttClinet  = mqtt.connect(MQTT_URL, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clientId: CLIENT_ID,
});


mqttClinet.on('connect', () => {
    mqttClinet.subscribe(MQTT_TOPIC);
});

mqttClinet.on('message', (topic, buffer) => {
    const params = JSON.parse(buffer.toString());
    const tags = topic.split("/")
    toPrometheus(tags, params)
});

function toPrometheus(tags, params) {
    for (let key in params)  {
        const value = params[key];
        
        if (typeof value === 'number') {
            ensureMetric(key);
            metrics[key].labels(tags[1], tags[2]).set(value);
        } else if (value === 'on') {
            ensureMetric(key);
            metrics[key].labels(tags[1], tags[2]).set(1);
        } else if (value === 'off') {
            ensureMetric(key);
            metrics[key].labels(tags[1], tags[2]).set(0);
        }
    }
}

function ensureMetric(key) {
    if (!metrics[key]) {
        metrics[key] = new prometheus.Gauge({
            name: key,
            help: key,
            labelNames: ['device', 'kind'],
            registers: [registry],
        });
    }
}


const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': registry.contentType });
    res.end(registry.metrics())
});

console.log("Running at port " + PORT)
server.listen(PORT);