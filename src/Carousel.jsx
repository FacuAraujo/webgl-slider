import {useFrame, useThree} from '@react-three/fiber'
import images from './data/images'
import CarouselItem from './CarouselItem'
import {useEffect, useMemo, useRef, useState} from 'react'
import {gsap} from 'gsap'
import {usePrevious} from 'react-use'

// Plane Settings
const planeSettings = {
  width: 2.5,
  height: 3.5,
  gap: 0.3
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
  const speedWheel = 0.02
  const $items = useMemo(() => {
    if ($root) return $root.children
  }, [$root])
  const angleStep = Math.PI * 2 / images.length

  // Display Items
  const displayItems = (item, index, active) => {
    const angle = angleStep * (index - active)

    gsap.to(item.position, {
      x: 0,
      y: Math.cos(angle),
      z: -Math.sin(angle)
    })

    item.position.multiplyScalar(4)

    item.lookAt(0, 0, 0);
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

  // AI connection
  useEffect(() => {
    const handleAiRecommend = (e) => {
      if (!e.detail) {
        setActivePlane(null)
        return
      }

      setActivePlane(images.findIndex(image => image.slug === e.detail))
    }

    document.addEventListener('articleRecommended', handleAiRecommend)

    return () => {
      document.removeEventListener('articleRecommended', setActivePlane)
    }
  }, [])

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
            key={item.slug}
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