import {useThree} from "@react-three/fiber";
import {useTexture} from "@react-three/drei";
import {useMemo, useRef, useEffect} from "react";
import {gsap} from "gsap";
import {DoubleSide} from "three";

export default function Plane({width, height, tex, active, ...props}) {
  const $mesh = useRef()
  const {viewport} = useThree()
  const texture = useTexture(tex)

  useEffect(() => {
    if ($mesh.current.material) {
      $mesh.current.material.uniforms.uZoomScale.value.x = width * 1.25 / width
      $mesh.current.material.uniforms.uZoomScale.value.y = height * 1.25 / height

      gsap.to($mesh.current.material.uniforms.uProgress, {
        value: active ? 1 : 0,
      })

      gsap.to($mesh.current.material.uniforms.uRes.value, {
        x: active ? width * 1.25 : width,
        y: active ? height * 1.25 : height,
      })
    }
  }, [viewport, active])

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uProgress: {value: 0},
        uZoomScale: {value: {x: 1, y: 1}},
        uTex: {value: texture},
        uRes: {value: {x: 1, y: 1}},
        uImageRes: {
          value: {x: texture.source.data.width, y: texture.source.data.height}
        }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uProgress;
        uniform vec2 uZoomScale;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float angle = uProgress * 3.14159265 / 2.;
          float wave = cos(angle);
          float c = sin(length(uv - .5) * 15. + uProgress * 12.) * .5 + .5;
          pos.x *= mix(1., uZoomScale.x + wave * c, uProgress);
          pos.y *= mix(1., uZoomScale.y + wave * c, uProgress);

          gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
        }
      `,
      fragmentShader: `
      uniform sampler2D uTex;
      uniform vec2 uRes;
      uniform vec2 uZoomScale;
      uniform vec2 uImageRes;

      /*------------------------------
      Background Cover UV
      --------------------------------
      u = basic UV
      s = screensize
      i = image size
      ------------------------------*/
      vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
        float rs = s.x / s.y; // Aspect screen size
        float ri = i.x / i.y; // Aspect image size
        vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x); // New st
        vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st; // Offset
        return u * s / st + o;
      }

      varying vec2 vUv;
        void main() {
          vec2 uv = CoverUV(vUv, uRes, uImageRes);
          vec3 tex = texture2D(uTex, uv).rgb;
          gl_FragColor = vec4( tex, 1.0 );
        }
      `
    }),
    [texture]
  )

  return (
    <mesh ref={$mesh} {...props} position={[0, 0, 1]} name="plane">
      <planeGeometry args={[width, height, 30, 30]} />
      <shaderMaterial args={[shaderArgs]} side={DoubleSide} />
    </mesh>
  )
}