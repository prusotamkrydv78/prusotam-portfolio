'use client'

import { useEffect, useRef } from 'react'

interface Props {
  className?: string
  style?: React.CSSProperties
}

export default function ShaderBackground({ className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    const vs = `
      attribute vec4 aVertexPosition;
      void main() { gl_Position = aVertexPosition; }
    `

    /* Portfolio palette:
       bgColor1 = #111111  (near-black)
       bgColor2 = slightly warmer dark (right edge)
       lineColor = #FF4D00 orange */
    const fs = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      const float overallSpeed     = 0.18;
      const float gridSmoothWidth  = 0.015;
      const float scale            = 5.0;
      const vec4  lineColor        = vec4(1.0, 0.302, 0.0, 1.0);
      const float minLineWidth     = 0.006;
      const float maxLineWidth     = 0.13;
      const float lineSpeed        = 1.0  * overallSpeed;
      const float lineAmplitude    = 0.65;
      const float lineFrequency    = 0.2;
      const float warpSpeed        = 0.2  * overallSpeed;
      const float warpFrequency    = 0.5;
      const float warpAmplitude    = 1.0;
      const float offsetFrequency  = 0.5;
      const float offsetSpeed      = 1.33 * overallSpeed;
      const float minOffsetSpread  = 0.6;
      const float maxOffsetSpread  = 2.0;
      const int   linesPerGroup    = 12;

      #define drawSmoothLine(pos, hw, t) smoothstep(hw, 0.0, abs(pos - (t)))
      #define drawCrispLine(pos, hw, t)  smoothstep(hw + gridSmoothWidth, hw, abs(pos - (t)))
      #define drawCircle(pos, r, coord)  smoothstep(r + gridSmoothWidth, r, length(coord - (pos)))

      float random(float t) {
        return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
      }

      float getPlasmaY(float x, float hFade, float offset) {
        return random(x * lineFrequency + iTime * lineSpeed) * hFade * lineAmplitude + offset;
      }

      void main() {
        vec2 uv    = gl_FragCoord.xy / iResolution.xy;
        vec2 space = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.x * 2.0 * scale;

        float hFade = 1.0 - (cos(uv.x * 6.28318) * 0.5 + 0.5);
        float vFade = 1.0 - (cos(uv.y * 6.28318) * 0.5 + 0.5);

        space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + hFade);
        space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * hFade;

        vec4 lines = vec4(0.0);

        for (int l = 0; l < linesPerGroup; l++) {
          float nli          = float(l) / float(linesPerGroup);
          float offsetTime   = iTime * offsetSpeed;
          float offsetPos    = float(l) + space.x * offsetFrequency;
          float rand         = random(offsetPos + offsetTime) * 0.5 + 0.5;
          float halfWidth    = mix(minLineWidth, maxLineWidth, rand * hFade) * 0.5;
          float offset       = random(offsetPos + offsetTime * (1.0 + nli)) * mix(minOffsetSpread, maxOffsetSpread, hFade);
          float linePos      = getPlasmaY(space.x, hFade, offset);
          float line         = drawSmoothLine(linePos, halfWidth, space.y) * 0.5
                             + drawCrispLine(linePos, halfWidth * 0.15, space.y);

          float cx           = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
          vec2  cp           = vec2(cx, getPlasmaY(cx, hFade, offset));
          float circle       = drawCircle(cp, 0.01, space) * 4.0;

          lines += (line + circle) * lineColor * rand;
        }

        /* Dark warm gradient base */
        vec4 bg = mix(
          vec4(0.067, 0.067, 0.067, 1.0),  /* #111111 */
          vec4(0.085, 0.072, 0.063, 1.0),  /* warm dark */
          uv.x
        );
        bg    *= vFade;
        bg.a   = 1.0;
        bg    += lines;

        gl_FragColor = bg;
      }
    `

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null }
      return s
    }

    const vert = compile(gl.VERTEX_SHADER, vs)
    const frag = compile(gl.FRAGMENT_SHADER, fs)
    if (!vert || !frag) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, vert)
    gl.attachShader(prog, frag)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(prog, 'aVertexPosition')
    const resLoc = gl.getUniformLocation(prog, 'iResolution')
    const timLoc = gl.getUniformLocation(prog, 'iTime')

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const t0 = Date.now()
    let rafId = 0

    const render = () => {
      const t = (Date.now() - t0) / 1000
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(prog)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.uniform1f(timLoc, t)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(posLoc)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafId = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(prog)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        0,
        ...style,
      }}
    />
  )
}
