import { config } from 'dotenv'
config()
import app from './src/app.js';
import connectDB from './src/common/config/db.config.js';

async function main() {
    await connectDB();
    app.listen(3000, () => {
        console.log('Server is running sucessfully on port 3000')
    })
}

main();
