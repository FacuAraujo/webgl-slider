import {useEffect, useRef, useState} from 'react'
import {useThree} from '@react-three/fiber'
import gsap from 'gsap'
import Plane from './Plane'

export default function CarouselItem({
  index,
  width,
  height,
  setActivePlane,
  activePlane,
  item
}) {
  const $root = useRef()
  const [hover, setHover] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [isCloseActive, setCloseActive] = useState(false)
  const {viewport} = useThree()
  const timeoutID = useRef()

  useEffect(() => {
    if (activePlane && activePlane !== index) {
      gsap.to($root.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: 'power3.out',
      })
    } else {
      gsap.to($root.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: 'power3.out',
      })
    }

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

    if (isActive) {
      $root.current.scale.set(1, 1, 1)

      const event = new CustomEvent("articleActive", {detail: item.slug});
      document.dispatchEvent(event);
    } else {
      const event = new CustomEvent("articleActive", {detail: ""});
      document.dispatchEvent(event);
    }
  }, [isActive])

  /*------------------------------
  Hover effect
  ------------------------------*/
  // useEffect(() => {
  //   const hoverScale = hover && !isActive ? 1.01 : 1

  //   gsap.to($root.current.scale, {
  //     x: hoverScale,
  //     y: hoverScale,
  //     duration: 0.5,
  //     ease: 'power3.out'
  //   })
  // }, [hover, isActive])

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