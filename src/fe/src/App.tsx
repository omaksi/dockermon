import './App.css'
import { useEffect, useState } from 'react'
import Dockerode from 'dockerode'
import {
  getLogsUrl,
  inspectContainer,
  listContainers,
  restartContainer,
  startContainer,
  stopContainer,
} from './actions/actions'
import LogView from './components/LogView'

const socket = new WebSocket('ws://localhost:4001')
socket.addEventListener('message', (event) => {
  console.log('Message from server ', event.data)
})

// const TEST_ID = 'd59188562d326faf54e987270ca5b06935536e5f0b2bfa7bb0a84bebd59e4db9'
// const TEST_URL = `${DOCKER_PATH}/containers/${TEST_ID}/logs`

// const containerLogs = (id: string) => {
//   return fetch(`${DOCKER_PATH}/containers/${id}/logs`).then((res) => res.json())
// }

const App = () => {
  const [containers, setContainers] = useState<Dockerode.ContainerInfo[]>([])
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null)
  const [selectedContainers, setSelectedContainers] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadContainers()
  }, [])

  const loadContainers = async () => {
    const c = await listContainers()
    console.log(c)
    setContainers(c)
  }
  const handleInspectClick = async (id: string | null) => {
    if (!id) {
      return
    }
    const c = await inspectContainer(id)
    console.log(c)
  }
  const handleRestartClick = async (id: string | null) => {
    if (!id) {
      return
    }
    const c = await restartContainer(id)
    console.log(c)
  }
  const handleStartClick = async (id: string | null) => {
    if (!id) {
      return
    }
    const c = await startContainer(id)
    console.log(c)
  }
  const handleStopClick = async (id: string | null) => {
    if (!id) {
      return
    }
    const c = await stopContainer(id)
    console.log(c)
  }

  // const handleLogsClick = async (id: string) => {
  //   // const c = await containerLogs(id)
  //   // console.log(c)
  //   socket.send(id)
  // }

  const handleContainerSelect = async (id: string) => {
    const newSelectedContainers = new Set(selectedContainers)

    if (selectedContainers.has(id)) {
      newSelectedContainers.delete(id)
    } else {
      newSelectedContainers.add(id)
    }

    setSelectedContainers(newSelectedContainers)
  }

  return (
    <div className="App">
      <header className="App-header">
        Docker Monitor /////// Containers:{' '}
        {containers &&
          containers.map((container) => {
            return (
              <button key={container.Id} onClick={() => handleContainerSelect(container.Id)}>
                {container.Names[0]}
              </button>
            )
          })}
      </header>

      <main>
        {/* <nav>
          {containers.find((container) => container.Id === selectedContainerId)?.Names[0]}
          <br />
          <br />
        </nav> */}
        <div className="mainWrapper">
          {/* <div className="actions">
            <button
              disabled={!selectedContainerId}
              onClick={() => handleStartClick(selectedContainerId)}
            >
              Start
            </button>
            <button
              disabled={!selectedContainerId}
              onClick={() => handleStopClick(selectedContainerId)}
            >
              Stop
            </button>
            <button
              disabled={!selectedContainerId}
              onClick={() => handleRestartClick(selectedContainerId)}
            >
              Restart
            </button>
            <button
              disabled={!selectedContainerId}
              onClick={() => handleInspectClick(selectedContainerId)}
            >
              Inspect
            </button>
          </div> */}

          {/* {containers &&
    containers.map((container) => {
      return <LogView key={container.Id} url={getLogsUrl(container.Id)}></LogView>
    })} */}

          <div className="logViewsWrapper">
            {Array.from(selectedContainers).map((containerId) => {
              console.log(containerId)
              return (
                <div
                  key={containerId}
                  style={{ width: 100 / selectedContainers.size + '%' }}
                  className="logViewWrapper"
                >
                  <div className="logViewHeading">
                    {containers.find((container) => container.Id === containerId)?.Names[0]}
                    <div className="actions">
                      <button disabled={!containerId} onClick={() => handleStartClick(containerId)}>
                        Start
                      </button>
                      <button disabled={!containerId} onClick={() => handleStopClick(containerId)}>
                        Stop
                      </button>
                      <button
                        disabled={!containerId}
                        onClick={() => handleRestartClick(containerId)}
                      >
                        Restart
                      </button>
                      <button
                        disabled={!containerId}
                        onClick={() => handleInspectClick(containerId)}
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                  <LogView url={getLogsUrl(containerId)}></LogView>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
