var nconf = require('nconf')
  , path = require('path');

nconf.argv()
     .env()
     .file('./config.json');

nconf.defaults({
  'port': '3000'
});
nconf.set('app_path', path.normalize(__dirname + '/..'));
console.log(nconf.get('app_path'));

module.exports = nconf;