require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./models');
const initCron = require('./src/cron');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Initialize background jobs
        initCron();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

startServer();
