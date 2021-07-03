type DotProps = {
  //   status: 'created' | 'restarting' | 'running' | 'removing' | 'paused' | 'exited' | 'dead'
  status: string
}
const Dot = (props: DotProps) => {
  return <div className={`dot ${props.status}`}></div>
}
export default Dot
