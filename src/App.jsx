import {Canvas} from "@react-three/fiber"
import Carousel from "./Carousel"
import {Suspense} from "react"
import CarouselCurved from './CarouselCurved'
import {OrbitControls} from "@react-three/drei"

export default function App() {
  return (
    <div className="App">
      <Canvas>
        <OrbitControls />
        <Suspense fallback={null}>
          {/* <Carousel /> */}
          <CarouselCurved />
        </Suspense>
      </Canvas>
    </div>
  )
}

