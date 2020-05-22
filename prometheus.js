const prometheus = require('prom-client');
const help = require('./help.json')
const registry = new prometheus.Registry();
const metrics = {}

function ensureMetric(key, labels) {
    if (!metrics[key]) {
        metrics[key] = new prometheus.Gauge({
            name: METRIC_PREFIX + key,
            help: help[key] || key,
            labelNames: labels,
            registers: [registry],
        });
    }
}

export function numberify(value) {
    if (typeof value === 'number') {
        return value;
    } else if (typeof value === 'string') {
        switch(value) {
            case "on":
                return 1;
            case "off":
                return 0;
            case "offline":
                return 0;
            case "online":
                return 1;
            case "Hot":
                return 0;
            case "auto":
                return 0;
        }
    }

    return undefined;
}

export function set(tags, params) {
    
    for (let key in params)  {
        const raw = params[key];
        if (key === 'ServiceCode') {
            ensureMetric(key, ['device', 'kind', 'statuscode']);
            metrics[key].labels(tags[1], tags[2], raw).set(hash(raw));
        } else {
            const value = numberify(raw);      
            if (value) {
                ensureMetric(key, ['device', 'kind']);
                metrics[key].labels(tags[1], tags[2]).set(value);
            }
        }
    }
}

export function contentType() {
    return registry.contentType;
}

export function snapshot() {
    return registry.metrics();
}

export function hash(value) {
    let hash = 0;
    let chr;
    for (let i = 0; i < value.length; i++) {
      chr   = value.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }