export const DOCKER_PATH = 'http://127.0.0.1:4000'

export const listContainers = async () => {
  const res = await fetch(`${DOCKER_PATH}/containers`)
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
