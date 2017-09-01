var spawn = require('cross-spawn');

var result = spawn.sync(
    'node',
    [require.resolve('./node_modules/react-scripts/scripts/start')].concat(''),
    {stdio: 'inherit'}
);

process.exit(result.status);