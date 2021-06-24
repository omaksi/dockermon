const Proxy = require('http-proxy')

Proxy.createProxyServer({ target: { socketPath: '/var/run/docker.sock' } }).listen(9000)
