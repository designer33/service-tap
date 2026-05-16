// cPanel entry point — delegates to server/server.js
// All server deps (express, mongoose, etc.) are in server/node_modules/
// and resolve correctly from there without needing a root-level install.
require('./server/server.js');
