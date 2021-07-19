import type Dockerode from 'dockerode'

export type GroupedContainers = { [key: string]: Dockerode.ContainerInfo[] }

export type Monitor = {
  type: MonitorTypes
  id: string
}

export type MonitorTypes = 'image' | 'container' | 'volume' | 'network'
