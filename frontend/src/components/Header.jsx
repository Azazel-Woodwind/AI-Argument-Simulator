import ShowConfig from "./ShowConfig"

const Header = ({toggleConfigForm}) => {
  return (
    <header style={{display: "flex"}}>
        <h1>Debate simulator</h1>
        <ShowConfig toggleConfigForm={toggleConfigForm}/>
    </header>
  )
}

export default Header