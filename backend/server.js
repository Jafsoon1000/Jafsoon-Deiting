require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
🚀 Server is running in professional modular mode
📍 URL: http://localhost:${PORT}
🛠️ Health Check: http://localhost:${PORT}/api/health
    `);
});
