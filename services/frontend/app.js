require('dotenv').config();
const express = require('express');
const promClient = require('prom-client');
const responseTime = require('response-time');

const app = express();
const PORT = process.env.FRONTEND_PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';
const BROWSER_BACKEND_URL = process.env.BROWSER_BACKEND_URL || 'http://localhost:5000/api/v1';

// Initialize Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'frontend_' });

// Custom metrics
const pageLoadCounter = new promClient.Counter({
    name: 'frontend_page_loads_total',
    help: 'Total number of page loads'
});

const apiLatencyHistogram = new promClient.Histogram({
    name: 'frontend_api_latency_seconds',
    help: 'API call latency histogram',
    buckets: [0.1, 0.5, 1, 2, 5]
});

// Add response time middleware
app.use(responseTime((req, res, time) => {
    if (req.path !== '/metrics') {
        apiLatencyHistogram.observe(time / 1000);
    }
}));

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.send(metrics);
});

app.get('/', async (req, res) => {
    pageLoadCounter.inc();
    try {
        res.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Frontend App</title>
                    <script>
                        // Add client-side timing
                        window.addEventListener('load', () => {
                            const timing = window.performance.timing;
                            const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                            // Send timing to backend (you could add an endpoint for this)
                            console.log('Page load time:', pageLoadTime);
                        });
                    </script>
                </head>
                <body>
                    <h1>Frontend App</h1>
                    <div id="data"></div>
                    
                    <script>
                        const startTime = performance.now();
                        fetch('${BROWSER_BACKEND_URL}')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(data => {
                                const endTime = performance.now();
                                console.log('API call time:', endTime - startTime);
                                document.getElementById('data').textContent = 
                                    JSON.stringify(data, null, 2);
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                document.getElementById('data').textContent = 
                                    'Error fetching data from backend: ' + error.message;
                            });
                    </script>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Error connecting to backend service');
    }
});

app.listen(PORT, () => {
    console.log(`Frontend server is running on port ${PORT}`);
    console.log(`Backend URL (container): ${BACKEND_URL}`);
    console.log(`Backend URL (browser): ${BROWSER_BACKEND_URL}`);
});