import {useEffect, useRef} from "react"
import {useFrame, useThree} from "@react-three/fiber"
import {DoubleSide, Float32BufferAttribute, Vector2} from "three"

export default function PlanesTest() {
  const plane = useRef()
  const progress = useRef(0)
  const {viewport} = useThree()
  const speedWheel = 0.002

  useEffect(() => {
    plane.current.geometry.translate(0, 0, 1)

    const pos = plane.current.geometry.attributes.position.array
    const newPos = []
    const radius = 2

    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i]
      const y = pos[i + 1]
      const z = pos[i + 2]

      const yz = new Vector2(y, z).normalize().multiplyScalar(radius)

      newPos.push(x, yz.x, yz.y)
    }

    plane.current.geometry.setAttribute('position', new Float32BufferAttribute(newPos, 3))
  })

  // RAF
  useFrame(() => {
    progress.current = Math.max(0, Math.min(progress.current, 100))

    plane.current.rotation.x = progress.current
  })

  // Handle Wheel
  const handleWheel = (e) => {
    // if (activePlane !== null) return
    const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
    const wheelProgress = isVerticalScroll ? e.deltaY : e.deltaX
    progress.current = progress.current + (-wheelProgress * speedWheel)
  }

  return (
    <>
      <mesh
        position={[0, 0, -0.01]}
        onWheel={handleWheel}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial transparent={true} opacity={0} />
      </mesh>

      <mesh ref={plane}>
        <planeGeometry args={[2.5, 3.5, 32, 32]} />
        <meshBasicMaterial color={"red"} side={DoubleSide} />
      </mesh>
    </>
  )
}