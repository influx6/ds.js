var em = require('em');
var ds = em('./ds.js');

var as = em('appstack');
require('./tests/ds.list.js')(as.Matchers,ds);
require('./tests/ds.it.js')(as.Matchers,ds);
require('./tests/ds.graph.js')(as.Matchers,ds);
