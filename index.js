const app = require('./configs/express');
const { getAverage } = require('./utils/helper');

const avg = getAverage([6, 20, 8, 15, 10]);


console.info(Math.round(avg).toFixed(2))

const port = app.get('port');
app.listen(port, () => {
    logger.info('Server started on port', port, '🚀');
})