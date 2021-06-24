import logo from './logo.svg'
import './App.css'
import { useState } from 'react'
import Dockerode from 'dockerode'
import { LazyLog } from 'react-lazylog'

// const docker = new Docker({ protocol: 'http', host: '127.0.0.1', port: 9000 })

const DOCKER_PATH = 'http://127.0.0.1:4000'

const socket = new WebSocket('ws://localhost:4001')
socket.addEventListener('message', (event) => {
  console.log('Message from server ', event.data)
})

const listContainers = async () => {
  const res = await fetch(`${DOCKER_PATH}/containers`)
  return await res.json()
}

const inspectContainer = async (id: string) => {
  const res = await fetch(`${DOCKER_PATH}/containers/${id}`)
  return await res.json()
}

const TEST_ID = 'd59188562d326faf54e987270ca5b06935536e5f0b2bfa7bb0a84bebd59e4db9'
// const containerLogs = (id: string) => {
//   return fetch(`${DOCKER_PATH}/containers/${id}/logs`).then((res) => res.json())
// }

const App = () => {
  const [containers, setContainers] = useState<Dockerode.ContainerInfo[]>([])

  const handleClick = async () => {
    const c = await listContainers()
    console.log(c)
    setContainers(c)
  }
  const handleInspectClick = async (id: string) => {
    const c = await inspectContainer(id)
    console.log(c)
  }
  const handleLogsClick = async (id: string) => {
    // const c = await containerLogs(id)
    // console.log(c)
    socket.send(id)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={handleClick}>Load Containers</button>

        {containers &&
          containers.map((container) => {
            return (
              <button onClick={() => handleInspectClick(container.Id)}>
                Inspect {container.Names[0]}
              </button>
            )
          })}

        <br />
        <br />
        {containers &&
          containers.map((container) => {
            return (
              <button onClick={() => handleLogsClick(container.Id)}>
                Logs {container.Names[0]}
              </button>
            )
          })}
      </header>
      <LazyLog url={`${DOCKER_PATH}/containers/${TEST_ID}/logs`} follow stream />
    </div>
  )
}

export default App
