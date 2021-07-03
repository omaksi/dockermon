export const DOCKER_PATH = 'http://localhost:4000'

export const listContainers = async () => {
  const res = await fetch(`${DOCKER_PATH}/containers`)
  return await res.json()
}

export const listImages = async () => {
  const res = await fetch(`${DOCKER_PATH}/images`)
  return await res.json()
}

export const listNetworks = async () => {
  const res = await fetch(`${DOCKER_PATH}/networks`)
  return await res.json()
}

export const listVolumes = async () => {
  const res = await fetch(`${DOCKER_PATH}/volumes`)
  return await res.json()
}

export const inspectContainer = async (id: string) => {
  const res = await fetch(`${DOCKER_PATH}/containers/${id}`)
  return await res.json()
}

export const restartContainer = async (id: string) => {
  const res = await fetch(`${DOCKER_PATH}/containers/${id}/restart`)
  return await res.json()
}

export const startContainer = async (id: string) => {
  const res = await fetch(`${DOCKER_PATH}/containers/${id}/start`)
  return await res.json()
}

export const stopContainer = async (id: string) => {
  const res = await fetch(`${DOCKER_PATH}/containers/${id}/stop`)
  return await res.json()
}

export const getLogsUrl = (id: string) => {
  return `${DOCKER_PATH}/containers/${id}/logs`
}
