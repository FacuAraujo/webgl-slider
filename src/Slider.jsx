import {useRef, useEffect} from 'react';
import {useThree, useFrame} from '@react-three/fiber';
import {DoubleSide} from 'three';
import CarouselItem from './CarouselItem';
import images from './data/images'

const Slider = ({planeSize, gapSize, activeIndex}) => {
  const carouselRef = useRef();
  const groupRef = useRef();
  const {gl, viewport} = useThree();
  const isDragging = useRef(false);
  const previousMouseY = useRef(0);

  // Rotate the carousel on each frame
  useFrame(() => {
    // carouselRef.current.rotation.x += 0.01;

    // Make the planes face the front
    groupRef.current.children.forEach((plane) => {
      plane.lookAt(0, 0, -1);
    });
  });

  useEffect(() => {
    if (groupRef.current.children[activeIndex]) {
      const angle = (Math.PI * 2 * activeIndex) / groupRef.current.children.length;
      carouselRef.current.rotation.x = -angle;
    }
  }, [activeIndex]);

  const handlePointerDown = (event) => {
    isDragging.current = true;
    previousMouseY.current = event.clientY;
    gl.domElement.addEventListener('pointermove', handlePointerMove);
    gl.domElement.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (event) => {
    if (!isDragging.current) return;
    const delta = event.clientY - previousMouseY.current;
    carouselRef.current.rotation.x += delta * 0.005;
    previousMouseY.current = event.clientY;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    gl.domElement.removeEventListener('pointermove', handlePointerMove);
    gl.domElement.removeEventListener('pointerup', handlePointerUp);
  };

  const numItems = 8; // Number of carousel items
  const radius = 5; // Radius of the carousel

  // Calculate the angle between each item
  const angle = (Math.PI * 2) / numItems;
  const curvature = 1 / radius; // Curvature factor

  return (
    <>
      <mesh
        position={[0, 0, -0.01]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial transparent={true} opacity={0} />
      </mesh>

      <group ref={carouselRef} position-z={-7}>
        <group ref={groupRef}>
          {/* Create the carousel items */}
          {images.map((item, i) => {
            const posY = radius * Math.sin(angle * i);
            const posZ = radius * Math.cos(angle * i);

            return (
              <CarouselItem
                width={planeSize.width}
                height={planeSize.height}
                position={[0, posY, posZ]}
                rotation={[0, 0, 0]} // Set rotation to zero to face the front
                key={item.image}
                item={item}
                index={i}
              />
            );
          })}
        </group>
      </group>
    </>
  );
};

export default Slider;