import Home from './home'

const Index = () => {
  return <Home />
}

// Pass through getStaticProps from Home component
export { getStaticProps } from './home';

export default Index
