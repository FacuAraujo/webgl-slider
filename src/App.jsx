import {Canvas} from "@react-three/fiber"
import Carousel from "./Carousel"
import Slider from "./Slider"
import {Suspense} from "react"
import {OrbitControls} from "@react-three/drei"
import PlanesTest from "./PlanesTest"
import Scene from "./Scene"
import images from './data/images'


export default function App() {
  return (
    <div className="App">
      <Canvas camera={{position: [0, 0, -6]}}>
        <OrbitControls />
        <Suspense fallback={null}>
          {/* <PlanesTest />  */}
          <Carousel />
          {/* <Slider planeSize={{width: 2, height: 3}} gapSize={0} activeIndex={4} /> */}
        </Suspense>
      </Canvas>

    </div >
  )
}

