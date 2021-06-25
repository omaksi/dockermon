import { LazyLog } from 'react-lazylog'
import './LogView.css'

type LazyLogProps = {
  url: string
}

const LogView = (props: LazyLogProps) => {
  return (
    <div className="LogView">
      <LazyLog url={props.url} follow stream rowHeight={17} />
    </div>
  )
}

export default LogView
