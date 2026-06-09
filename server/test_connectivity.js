const dns = require('dns');
const net = require('net');
const url = require('url');

console.log('=== DATABASE CONNECTIVITY DIAGNOSTICS ===');
console.log('Time:', new Date().toISOString());

// Parse connection URI
const uri = "mongodb+srv://irfanrashidkhan:@@@Irfan123@portfolio.i9rypvx.mongodb.net/service_tap";
console.log('Target Host: portfolio.i9rypvx.mongodb.net');

// Test 1: Resolve DNS SRV Record
console.log('\n[Test 1] Resolving DNS SRV record...');
dns.resolveSrv('_mongodb._tcp.portfolio.i9rypvx.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('❌ DNS SRV Resolution Failed:', err.message);
    console.log('Attempting standard TXT record lookup...');
    dns.resolveTxt('portfolio.i9rypvx.mongodb.net', (txtErr, txtAddresses) => {
      if (txtErr) {
        console.error('❌ DNS TXT Resolution Failed:', txtErr.message);
      } else {
        console.log('✅ DNS TXT Resolved successfully:', txtAddresses);
      }
    });
  } else {
    console.log('✅ DNS SRV Resolved successfully!');
    console.log('Addresses:', JSON.stringify(addresses, null, 2));

    // Test 2: Try to connect to one of the resolved hosts on port 27017
    if (addresses && addresses.length > 0) {
      const targetHost = addresses[0].name;
      const targetPort = addresses[0].port || 27017;
      console.log(`\n[Test 2] Testing TCP connection to ${targetHost}:${targetPort}...`);
      
      const socket = new net.Socket();
      socket.setTimeout(5000);

      socket.on('connect', () => {
        console.log(`✅ TCP Connection successful to ${targetHost}:${targetPort}! Port 27017 is OPEN.`);
        socket.destroy();
      });

      socket.on('timeout', () => {
        console.error(`❌ TCP Connection TIMEOUT to ${targetHost}:${targetPort}. Port 27017 is likely BLOCKED by the cPanel firewall.`);
        socket.destroy();
      });

      socket.on('error', (netErr) => {
        console.error(`❌ TCP Connection FAILED to ${targetHost}:${targetPort}:`, netErr.message);
        console.log('If connection was refused, it might be a routing/firewall block.');
        socket.destroy();
      });

      socket.connect(targetPort, targetHost);
    }
  }
});
