const app = require('./app');
const { connectDB } = require('./services/db');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1'
connectDB().then(() => {
    app.listen(PORT, HOST, () => {
        console.log(`Server is running on http://${HOST}:${PORT}`);
    });
});

module.exports = app;