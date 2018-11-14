var redis = require("redis");
var db_client = redis.createClient();

db_client.set('test', 'val', function(err) {
    if (err) {
        throw err
    }
});

db_client.get('test', function(err, value) {
    if (err) {
        console.error('error getting key:', err);
    }
    else {
        console.log('key has the value %s', value);
    }
});
