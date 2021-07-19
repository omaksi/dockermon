import { useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import { getLogsUrl, inspect } from '../actions/actions'
import debug from 'debug'
import './Monitor.scss'
import LogView from './LogView'

const log = debug('fe:Monitor')

type MonitorProps = {
  type: 'image' | 'container' | 'volume' | 'network'
  id: string
  displayName: string
  onClose: () => void
  style?: any
}

const Monitor = (props: MonitorProps) => {
  const [inspectResult, setInspectResult] = useState<any>({})
  const [showLog, setShowLog] = useState<boolean>(false)

  useEffect(() => {
    log('Monitor useEffect')
    const fetchInspect = async () => {
      log('fetchInspect')
      if (showLog) {
        return
      }
      try {
        const c = await inspect(props.id, props.type)
        log(c)
        setInspectResult(c)
      } catch (e) {
        log(e)
      }
      return
    }
    fetchInspect()
    const interval = setInterval(() => {
      fetchInspect()
      console.log('This will run every second!')
    }, 5000)
    return () => clearInterval(interval)
  }, [props.id, props.type, showLog])

  return (
    <div style={props.style} className="Monitor">
      <div className="heading">
        {props.displayName} <span className="type">{props.type}</span>
        <br />
        <span className="id">{props.id}</span>
        {props.type === 'container' && (
          <div className="actions">
            <button
              onClick={() => {
                setShowLog(false)
              }}
            >
              inspect
            </button>
            <button
              onClick={() => {
                setShowLog(true)
              }}
            >
              log
            </button>
          </div>
        )}
        <div className="close" onClick={props.onClose}>
          X
        </div>
      </div>
      <div className="content">
        {(!showLog || props.type !== 'container') && (
          <ReactJson theme={'monokai'} src={inspectResult} />
        )}

        {showLog && props.type === 'container' && <LogView url={getLogsUrl(props.id)}></LogView>}
      </div>
    </div>
  )
}
export default Monitor
