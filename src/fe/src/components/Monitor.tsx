import { useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import { inspect } from '../actions/actions'
import debug from 'debug'
import './Monitor.scss'

const log = debug('Monitor')

type MonitorProps = {
  type: 'image' | 'container' | 'volume' | 'network'
  id: string
  style?: any
}

const Monitor = (props: MonitorProps) => {
  const [inspectResult, setInspectResult] = useState<any>({})

  useEffect(() => {
    log('Monitor useEffect')
    const fetchInspect = async () => {
      log('fetchInspect')
      // if (props.type === 'container') {
      const c = await inspect(props.id, props.type)
      console.log(c)
      setInspectResult(c)
      return
      // }
    }
    fetchInspect()
    const interval = setInterval(() => {
      fetchInspect()
      console.log('This will run every second!')
    }, 5000)
    return () => clearInterval(interval)
  }, [props.id, props.type])

  return (
    <div style={props.style} className="Monitor">
      <div className="heading">
        {props.id}
        <div className="actions">
          <button>inspect</button>
        </div>
      </div>
      <div className="content">
        <ReactJson theme={'monokai'} src={inspectResult} />
      </div>
    </div>
  )
}
export default Monitor
