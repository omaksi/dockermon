import Docker from 'dockerode'

// const docker = new Docker({ socketPath: '/var/run/docker.sock' })

import Debug from 'debug'
import { Request, Response } from 'express'
Debug.enable('main')
const debug = Debug('main')
import stream from 'stream'
import http from 'http'
const docker = new Docker({ protocol: 'http', host: '127.0.0.1', port: 9000 })

import express from 'express'
import WebSocket from 'ws'
// const express = require('express')
import cors from 'cors'
// const wss = new WebSocket.Server({ port: 8080 });

const app = express()
const port = 4000

// const server = http.createServer()

app.use(cors())

app.get('/containers', (req: Request, res: Response) => {
  docker.listContainers((err, containers) => {
    if (err) {
      throw err
    }
    // debug(containers)
    res.send(containers)
  })
})

app.get('/containers/:id', (req: Request, res: Response) => {
  const container = docker.getContainer(req.params.id)

  container.inspect((err, data) => {
    if (err) {
      throw err
    }
    // debug(data)
    res.send(data)
  })
})

app.get('/containers/:id/start', (req: Request, res: Response) => {
  const container = docker.getContainer(req.params.id)

  container.start((err, data) => {
    if (err) {
      throw err
    }
    // debug(data)
    res.send(data)
  })
})

app.get('/containers/:id/stop', (req: Request, res: Response) => {
  const container = docker.getContainer(req.params.id)

  container.stop((err, data) => {
    if (err) {
      throw err
    }
    // debug(data)
    res.send(data)
  })
})

app.get('/containers/:id/restart', (req: Request, res: Response) => {
  const container = docker.getContainer(req.params.id)

  container.restart((err, data) => {
    if (err) {
      throw err
    }
    // debug(data)
    res.send(data)
  })
})

const wsServer = new WebSocket.Server({ port: 4001 })

const getLogStream = (id: string) => {
  const container = docker.getContainer(id)

  // create a single stream for stdin and stdout
  const logStream = new stream.PassThrough()
  // logStream.on('data', (chunk: any) => {
  //   console.log(chunk.toString('utf8'))
  // })

  container.logs(
    {
      follow: true,
      stdout: true,
      stderr: true,
      tail: 100,
    },
    (err, dataStream) => {
      if (err) {
        // return debug.error(err.message)
        throw err
      }
      if (!dataStream) {
        throw 'No Stream!'
      }

      container.modem.demuxStream(dataStream, logStream, logStream)

      dataStream.on('end', function () {
        logStream.end('!stop!')
      })

      // setTimeout(function () {
      //   // dataStream.close()
      // }, 2000)
    }
  )

  return logStream
}

app.get('/containers/:id/logs', (req: Request, res: Response) => {
  // console.log('LOGS http')
  const logStream = getLogStream(req.params.id)
  logStream.on('data', (chunk) => {
    const c = chunk.toString('utf8')
    // console.log(c)
    res.write(c)
  })

  logStream.on('end', () => {
    res.end()
  })
})

wsServer.on('connection', (socket) => {
  socket.on('message', (message: any) => {
    console.log('received: %s', message)
    if (message) {
      const logStream = getLogStream(message)
      logStream.on('data', (chunk: any) => {
        const c = chunk.toString('utf8')
        // console.log(c)
        socket.send(c)
      })
      // const duplex = WebSocket.createWebSocketStream(wsServer, { encoding: 'utf8' })
      // logStream.pipe(duplex)
    }
  })

  socket.send('welcome!')
})

const isProduction = 'production' === process.env.NODE_ENV
const pathToFE = isProduction ? '../fe/build' : 'fe/build'

app.use(express.static(pathToFE))

const launchProxy = async () => {
  const proxyPort = 9000
  const Proxy = require('http-proxy')
  Proxy.createProxyServer({ target: { socketPath: '/var/run/docker.sock' } }).listen(proxyPort)
  console.log(`Proxy listening at http://localhost:${proxyPort}`)
}

const launchServer = async () => {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })
}

launchProxy()
launchServer()
