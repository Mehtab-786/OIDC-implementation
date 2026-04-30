import app from './src/app.js';

async function main() {
    app.listen(3000, () => {
        console.log('Server is running sucessfully on port 3000')
    })
}

main();
