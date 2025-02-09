require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.FRONTEND_PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';

// Serve static files if needed
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        // Note: In a real application, you'd want to use axios or node-fetch
        // This is just an example of the integration point
        res.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Frontend App</title>
                </head>
                <body>
                    <h1>Frontend App</h1>
                    <div id="message"></div>
                    
                    <script>
                        fetch('${BACKEND_URL}')
                            .then(response => response.json())
                            .then(message => {
                                document.getElementById('message').textContent = 
                                    JSON.stringify(message, null, 2);
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                document.getElementById('message').textContent = 
                                    'Error fetching message from backend';
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
    console.log(`Backend URL: ${BACKEND_URL}`);
});