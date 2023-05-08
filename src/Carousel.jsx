import {useFrame, useThree} from '@react-three/fiber'
import images from './data/images'
import CarouselItem from './CarouselItem'
import {useEffect, useMemo, useRef, useState} from 'react'
import {gsap} from 'gsap'
import {usePrevious} from 'react-use'
import {getPiramidalIndex} from './utils'

// Plane Settings
const planeSettings = {
  width: 2.5,
  height: 3.5,
  gap: 0.1
}

// Gsap Defaults
gsap.defaults({
  duration: 2.5,
  ease: 'power3.out'
})

export default function Carousel() {
  const [$root, setRoot] = useState()

  const [activePlane, setActivePlane] = useState(null)
  const prevActivePlane = usePrevious(activePlane)
  const {viewport} = useThree()

  // Vars
  const progress = useRef(50)
  const startY = useRef(0)
  const isDown = useRef(false)
  const speedWheel = 0.02
  const speedDrag = -0.1
  const $items = useMemo(() => {
    if ($root) return $root.children
  }, [$root])

  // Display Items
  const displayItems = (item, index, active) => {
    const piramidalIndex = getPiramidalIndex($items, active)[index]

    gsap.to(item.position, {
      x: 0,
      y: (index - active) * (planeSettings.height + planeSettings.gap)
    })

    gsap.to(item.rotation, {
      x: activePlane ? 0 : $items.length * -0.5 + piramidalIndex * 0.5,
      duration: 1,
      ease: 'power3.out',
    })

    if (index === activePlane) return
    gsap.to(item.scale, {
      x: activePlane !== null ? 0 : 1,
      y: activePlane !== null ? 0 : 1,
      z: activePlane !== null ? 0 : 1,
      duration: 1,
      ease: 'power3.out',
    })
  }

  // RAF
  useFrame(() => {
    progress.current = Math.max(0, Math.min(progress.current, 100))

    const active = Math.floor((progress.current / 100) * ($items.length - 1))

    $items.forEach((item, index) => displayItems(item, index, active));
  })

  // Handle Wheel
  const handleWheel = (e) => {
    if (activePlane !== null) return
    const isVerticalScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX)
    const wheelProgress = isVerticalScroll ? e.deltaY : e.deltaX
    progress.current = progress.current + (-wheelProgress * speedWheel)
  }

  // Handle Down
  const handleDown = (e) => {
    if (activePlane !== null) return
    isDown.current = true
    startY.current = e.clientY || (e.touches && e.touches[0].cleintY) || 0
  }

  // Handle Up
  const handleUp = () => {
    isDown.current = false
  }

  // HandleMove
  const handleMove = (e) => {
    if (activePlane !== null || !isDown.current) return
    const y = e.clientY || (e.touches && e.touches[0].clientY) || 0
    const mouseProgress = -(y - startY.current) * speedDrag
    progress.current = progress.current + mouseProgress
    startY.current = y
  }

  // Click
  useEffect(() => {
    if (!$items) return
    if (activePlane !== null && prevActivePlane === null) {
      progress.current = (activePlane / ($items.length - 1)) * 100
    }
  }, [activePlane, $items])

  // Render Plane Events
  const renderPlaneEvents = () => {
    return (
      <mesh
        position={[0, 0, -0.01]}
        onWheel={handleWheel}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerMove={handleMove}
        onPointerLeave={handleUp}
        onPointerCancel={handleUp}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial transparent={true} opacity={0} />
      </mesh>
    )
  }

  // Render Slider
  const renderSlider = () => {
    return (
      <group ref={setRoot}>
        {images.map((item, i) => (
          <CarouselItem
            width={planeSettings.width}
            height={planeSettings.height}
            setActivePlane={setActivePlane}
            activePlane={activePlane}
            key={item.image}
            item={item}
            index={i}
          />
        ))}
      </group>
    )
  }
  return (
    <group>
      {renderPlaneEvents()}
      {renderSlider()}
    </group>
  )
}