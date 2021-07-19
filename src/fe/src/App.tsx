import './App.scss'
import { useEffect, useState } from 'react'
import Dockerode from 'dockerode'
import {
  listContainers,
  listImages,
  listNetworks,
  listVolumes,
  // restartContainer,
  // startContainer,
  // stopContainer,
} from './actions/actions'
// import LogView from './components/LogView'
import Dot from './components/Dot'
import { GroupedContainers, Monitor, MonitorTypes } from './types'
import MonitorView from './components/Monitor'
import debug from 'debug'
const log = debug('fe:App')

// const socket = new WebSocket('ws://localhost:4001')
// socket.addEventListener('message', (event) => {
//   console.log('Message from server ', event.data)
// })

// const TEST_ID = 'd59188562d326faf54e987270ca5b06935536e5f0b2bfa7bb0a84bebd59e4db9'
// const TEST_URL = `${DOCKER_PATH}/containers/${TEST_ID}/logs`

// const containerLogs = (id: string) => {
//   return fetch(`${DOCKER_PATH}/containers/${id}/logs`).then((res) => res.json())
// }

const App = () => {
  // const [containers, setContainers] = useState<Dockerode.ContainerInfo[]>([])
  const [groupedContainers, setGroupedContainers] = useState<GroupedContainers>({})
  const [images, setImages] = useState<Dockerode.ImageInfo[]>([])
  const [networks, setNetworks] = useState<Dockerode.NetworkInspectInfo[]>([])
  const [volumes, setVolumes] = useState<Dockerode.VolumeInspectInfo[]>([])
  // const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null)
  // const [selectedContainers, setSelectedContainers] = useState<Set<string>>(new Set())
  const [monitors, setMonitors] = useState<Map<string, Monitor>>(new Map())

  // const addMonitor = (id: string, type: MonitorTypes) => {
  //   const newMonitors = new Map(monitors)
  //   newMonitors.set(id, { id, type })
  //   setMonitors(newMonitors)
  // }
  const closeMonitor = (id: string) => {
    const newMonitors = new Map(monitors)
    newMonitors.delete(id)
    localStorage.setItem('monitors', JSON.stringify(Object.fromEntries(newMonitors)))
    setMonitors(newMonitors)
  }

  // const toggleMonitor = (id: string, type: MonitorTypes) => {
  //   if (monitors.has(id)) {
  //     removeMonitor(id)
  //   } else {
  //     addMonitor(id, type)
  //   }
  // }

  useEffect(() => {
    loadContainers()
    loadImages()
    loadVolumes()
    loadNetworks()

    // load monitors from local storage
    const monitorsFromStorage = localStorage.getItem('monitors')
    log(`monitors from storage: ${monitorsFromStorage}`)
    if (monitorsFromStorage) {
      try {
        const monitorsFromStorageJson = JSON.parse(monitorsFromStorage)
        log(`monitors from storage json: ${monitorsFromStorageJson}`)
        setMonitors(new Map(Object.entries(monitorsFromStorageJson)))
      } catch (e) {
        console.error(e)
      }
    }

    const interval = setInterval(() => {
      log('index fetch')
      loadContainers()
      loadImages()
      loadVolumes()
      loadNetworks()
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const loadContainers = async () => {
    const containers: Dockerode.ContainerInfo[] = await listContainers()
    // console.log(c)
    // setContainers(c)

    // const newC: { [key: string]: string } = {}
    const newContainers: { [key: string]: Dockerode.ContainerInfo[] } = { undefined: [] }

    for (let i = 0; i < containers.length; i++) {
      const label = containers[i].Labels['com.docker.compose.project.config_files']
      // console.log(c[i].Labels)
      // console.log(label)
      if (label) {
        if (!newContainers[label]) {
          newContainers[label] = []
        }
        newContainers[label].push(containers[i])
      } else {
        newContainers['undefined'].push(containers[i])
      }
    }

    log('loadContainers', newContainers)

    setGroupedContainers(newContainers)
  }

  const loadImages = async () => {
    const c = await listImages()
    log('loadImages', c)
    setImages(c)
  }

  const loadVolumes = async () => {
    const c = await listVolumes()
    log('loadVolumes', c)
    setVolumes(c)
  }

  const loadNetworks = async () => {
    const c = await listNetworks()
    log('loadNetworks', c)
    setNetworks(c)
  }

  // const handleInspectClick = async (id: string | null) => {
  //   console.log('!!!!handleInspectClick', id)
  //   if (!id) {
  //     return
  //   }
  //   const c = await inspectContainer(id)
  //   console.log(c)
  // }
  // const handleRestartClick = async (id: string | null) => {
  //   if (!id) {
  //     return
  //   }
  //   const c = await restartContainer(id)
  //   console.log(c)
  // }
  // const handleStartClick = async (id: string | null) => {
  //   if (!id) {
  //     return
  //   }
  //   const c = await startContainer(id)
  //   console.log(c)
  // }
  // const handleStopClick = async (id: string | null) => {
  //   if (!id) {
  //     return
  //   }
  //   const c = await stopContainer(id)
  //   console.log(c)
  // }

  // const handleLogsClick = async (id: string) => {
  //   // const c = await containerLogs(id)
  //   // console.log(c)
  //   socket.send(id)
  // }

  // const handleContainerSelect = async (id: string) => {
  //   const newSelectedContainers = new Set(selectedContainers)

  //   if (selectedContainers.has(id)) {
  //     newSelectedContainers.delete(id)
  //   } else {
  //     newSelectedContainers.add(id)
  //   }

  //   setSelectedContainers(newSelectedContainers)
  // }

  const handleMonitorSelect = async (id: string, type: MonitorTypes, displayName: string) => {
    const newMonitors = new Map(monitors)
    newMonitors.set(id, { id, type, displayName })

    // persist newMonitors into local storage
    log('handleMonitorSelect', newMonitors)
    log('handleMonitorSelect', JSON.stringify(newMonitors))
    localStorage.setItem('monitors', JSON.stringify(Object.fromEntries(newMonitors)))

    setMonitors(newMonitors)
  }

  return (
    <div className="App">
      <header className="App-header">
        Docker Monitor /////// <br />
      </header>

      <main>
        <nav>
          ----- Containers:
          {groupedContainers &&
            Object.entries(groupedContainers).map(([key, containers]) => {
              return (
                <div key={key}>
                  {key !== 'undefined' && containers[0].Labels['com.docker.compose.project']}
                  {containers.map((container) => {
                    const displayName = container.Names[0]
                    return (
                      <button
                        key={container.Id}
                        // onClick={() => toggleMonitor(container.Id, 'container')}
                        onClick={() => handleMonitorSelect(container.Id, 'container', displayName)}
                        // onClick={() => handleContainerSelect(container.Id)}
                        className={monitors.has(container.Id) ? 'highlight' : ''}
                      >
                        {displayName}
                        {'   '}
                        <span className="containerState">{container.State.toLowerCase()}</span>
                        <Dot status={container.State.toLowerCase()}></Dot>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          {/* {containers &&
            containers.map((container) => {
              return (
                <button
                  key={container.Id}
                  onClick={() => handleContainerSelect(container.Id)}
                  className={selectedContainers.has(container.Id) ? 'highlight' : ''}
                >
                  {container.Names[0]}
                  <Dot status={container.State.toLowerCase()}></Dot>
                </button>
              )
            })} */}
          <br />
          ----- Images:
          {images &&
            images.map((image) => {
              const displayName =
                image.RepoTags[0] ||
                image.Labels[0] ||
                image.RepoDigests?.[0].split('@')[0] ||
                image.Id
              return (
                <button
                  key={image.Id}
                  onClick={() => handleMonitorSelect(image.Id, 'image', displayName)}
                  // className={selectedimages.has(image.Id) ? 'highlight' : ''}
                >
                  {displayName}
                </button>
              )
            })}
          <br />
          ----- Networks:
          {networks &&
            networks.map((network) => {
              const displayName = network.Name
              return (
                <button
                  key={network.Id}
                  onClick={() => handleMonitorSelect(network.Id, 'network', displayName)}
                  // className={selectednetworks.has(network.Id) ? 'highlight' : ''}
                >
                  {displayName}
                </button>
              )
            })}
          <br />
          ----- Volumes:
          {volumes &&
            volumes.map((volume) => {
              const displayName = volume.Name
              return (
                <button
                  key={volume.Name}
                  onClick={() => handleMonitorSelect(volume.Name, 'volume', displayName)}
                  // className={selectedvolumes.has(volume.Id) ? 'highlight' : ''}
                >
                  {displayName}
                </button>
              )
            })}
          {/* {containers.find((container) => container.Id === selectedContainerId)?.Names[0]}
          <br />
          <br /> */}
        </nav>
        <div className="mainWrapper">
          {/* {containers &&
            containers.map((container) => {
              return <LogView key={container.Id} url={getLogsUrl(container.Id)}></LogView>
            })} */}

          {/* <button disabled={!containerId} onClick={() => handleStartClick(containerId)}>
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
                      </button> */}

          <div className="logViewsWrapper">
            {Array.from(monitors).map(([id, monitor]) => {
              return (
                <MonitorView
                  key={monitor.id}
                  type={monitor.type}
                  displayName={monitor.displayName}
                  onClose={() => closeMonitor(id)}
                  id={monitor.id}
                  style={{
                    width: 100 / (monitors.size > 3 ? 3 : monitors.size) + '%',
                    height: 100 / Math.ceil(monitors.size / 3) + '%',
                  }}
                />
              )
              // console.log(containerId)
              // return (
              //   <div
              //     key={id}
              //     style={{
              //       width: 100 / (selectedContainers.size > 3 ? 3 : selectedContainers.size) + '%',
              //       height: 100 / Math.ceil(selectedContainers.size / 3) + '%',
              //     }}
              //     className="logViewWrapper"
              //   >
              //     <div className="logViewHeading">
              //       {containers.find((container) => container.Id === containerId)?.Names[0]}
              //       <div className="actions">
              //         <button
              //           disabled={!containerId}
              //           onClick={() => handleInspectClick(containerId)}
              //         >
              //           Inspect
              //         </button>
              //       </div>
              //     </div>
              //     <LogView url={getLogsUrl(containerId)}></LogView>
              //   </div>
              // )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
