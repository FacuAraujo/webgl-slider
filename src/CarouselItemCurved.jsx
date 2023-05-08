import {useEffect, useRef, useState} from 'react'
import {useThree} from '@react-three/fiber'
import gsap from 'gsap'
import Plane from './Plane'
import CurvedPlane from './CurvedPlane'
import {Vector3} from 'three'

const curves = {
  center: null,
  localCenter: new Vector3(),
  v3: new Vector3()
}

export default function CarouselItem({
  index,
  width,
  height,
  setActivePlane,
  activePlane,
  item,
  sphere
}) {
  const $root = useRef()
  // const $plane = useRef()
  const [hover, setHover] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isCloseActive, setCloseActive] = useState(false)
  const {viewport} = useThree()
  const timeoutID = useRef()

  useEffect(() => {
    if (activePlane === index) {
      setIsActive(activePlane === index)
      setCloseActive(true)
    } else {
      setIsActive(null)
    }
  }, [activePlane])

  useEffect(() => {
    gsap.killTweensOf($root.current.position)
    gsap.to($root.current.position, {
      z: isActive ? 0 : -0.01,
      duration: 0.2,
      ease: 'power3.out',
    })

    isActive && $root.current.scale.set(1, 1, 1)
  }, [isActive])

  useEffect(() => {
    const plane = $root.current.children[0]
    console.log(plane);
    if (!curves.center) curves.center = new Vector3().copy(sphere.current.position)

    plane.worldToLocal(curves.localCenter.copy(curves.center))
    let pos = plane.geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
      curves.v3.fromBufferAttribute(pos, i);
      curves.v3.sub(curves.localCenter);
      curves.v3.setLength(2).add(curves.localCenter);
      pos.setXYZ(i, curves.v3.x, curves.v3.y, curves.v3.z);
    }

    plane.geometry.computeVertexNormals()
    pos.needsUpdate = true
  }, [sphere])

  /*------------------------------
  Hover effect
  ------------------------------*/
  useEffect(() => {
    const hoverScale = hover && !isActive ? 1.05 : 1

    gsap.to($root.current.scale, {
      x: hoverScale,
      y: hoverScale,
      duration: 0.5,
      ease: 'power3.out'
    })
  }, [hover, isActive])

  const handleClose = (e) => {
    e.stopPropagation()
    if (!isActive) return
    setActivePlane(null)
    setHover(false)
    clearTimeout(timeoutID.current)
    timeoutID.current = setTimeout(() => {
      setCloseActive(false)
    }, 1500) // The duration of this timer depends on the duration of the plane's closing animation.
  }

  return (
    <group
      ref={$root}
      onClick={() => {
        setActivePlane(index)
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Plane
        width={width}
        height={height}
        tex={item.image}
        active={isActive}
      />

      {isCloseActive && (
        <mesh position={[0, 0, 0.01]} onClick={handleClose}>
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial transparent={true} opacity={0} color={'red'} />
        </mesh>
      )}
    </group>
  )
}