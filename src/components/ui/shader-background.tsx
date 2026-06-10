'use client'

import { useEffect, useRef } from 'react'

interface Props {
  className?: string
  style?: React.CSSProperties
}

/* ─────────────────────────────────────────────────────────────────
   WebGL2 nebula shader — adapted to the portfolio dark amber palette
   Original algorithm by Matthias Hurrle (@atzedent), recoloured for
   #111111 base + #FF4D00 orange accent.
───────────────────────────────────────────────────────────────── */
const VERT = `#version 300 es
precision highp float;
in vec4 position;
void main(){ gl_Position=position; }`

const FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2  resolution;
uniform float time;
uniform vec2  mouse;
uniform int   hasPointer;

#define FC  gl_FragCoord.xy
#define T   time
#define R   resolution
#define MN  min(R.x,R.y)

/* ── Noise helpers ── */
float rnd(vec2 p){
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(rnd(i),rnd(i+vec2(1.,0.)),u.x),
             mix(rnd(i+vec2(0.,1.)),rnd(i+1.),u.x),u.y);
}
float fbm(vec2 p){
  float t=.0,a=1.;
  mat2 m=mat2(1.,-.5,.2,1.2);
  for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}
  return t;
}
float clouds(vec2 p){
  float d=1.,t=.0;
  for(float i=.0;i<3.;i++){
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a); d=a; p*=2./(i+1.);
  }
  return t;
}

void main(void){
  vec2 uv=(FC-.5*R)/MN, st=uv*vec2(2.,1.);
  vec3 col=vec3(0.);

  /* Organic cloud background — drifts slowly left */
  float bg=clouds(vec2(st.x+T*.45,-st.y));

  /* Pulsing zoom */
  uv*=1.-.3*(sin(T*.18)*.5+.5);

  /* ── Cursor warmth ── */
  vec2 mUV=(mouse-.5*R)/MN;
  float mDist=length(uv-mUV);
  /* Smooth glow radius ~80% of min-dimension */
  float mGlow=float(hasPointer)*smoothstep(1.1,.0,mDist)*.55;

  /* ── Main warp loop — 12 passes ── */
  for(float i=1.;i<12.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);

    /* Amber-orange hue: R channel dominant, B very low */
    col+=.00125/d*(cos(sin(i)*vec3(.55,.24,.06))+1.);

    float b=noise(i+p+bg*1.731);
    col+=.0016*b/length(max(p,vec2(b*p.x*.02,p.y)));

    /* Very dark warm fog — keeps base near #111111 */
    col=mix(col,vec3(bg*.08,bg*.038,bg*.007),d);
  }

  /* ── Cursor corona — orange warmth at pointer ── */
  col+=mGlow*vec3(.5,.16,.02)/(1.+mDist*2.2);

  /* ── Remap to dark portfolio base (~0.067 = #111111) ── */
  col=clamp(col*.65,vec3(0.),vec3(1.));

  O=vec4(col,1.);
}`

export default function ShaderBackground({ className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    /* WebGL2 required for #version 300 es */
    const gl = canvas.getContext('webgl2')
    if (!gl) return           /* Graceful fallback — dark bg still shows */

    /* ── Compile helpers ── */
    const compile = (type: number, src: string): WebGLShader | null => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(s))
        gl.deleteShader(s)
        return null
      }
      return s
    }

    const vs = compile(gl.VERTEX_SHADER,   VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link:', gl.getProgramInfoLog(prog))
      return
    }

    /* ── Fullscreen quad ── */
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW)

    const posLoc  = gl.getAttribLocation(prog,  'position')
    const resLoc  = gl.getUniformLocation(prog,  'resolution')
    const timLoc  = gl.getUniformLocation(prog,  'time')
    const mouLoc  = gl.getUniformLocation(prog,  'mouse')
    const pntLoc  = gl.getUniformLocation(prog,  'hasPointer')

    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    /* ── Canvas sizing ── */
    const dpr = () => Math.max(1, 0.5 * window.devicePixelRatio)

    const resize = () => {
      const d = dpr()
      canvas.width  = canvas.offsetWidth  * d
      canvas.height = canvas.offsetHeight * d
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    /* ── Window-level mouse tracking (works even over content divs) ── */
    let mx = 0, my = 0, active = 0

    const rect = () => canvas.getBoundingClientRect()

    const onMove = (e: MouseEvent) => {
      const r = rect()
      const d = dpr()
      mx = (e.clientX - r.left)  * d
      my = canvas.height - (e.clientY - r.top) * d
      active = 1
    }
    const onLeave = () => { active = 0 }

    /* Attach to window so pointer over text overlay still drives the shader */
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    /* ── Render loop ── */
    const t0 = performance.now()
    let rafId = 0

    const render = (now: number) => {
      const t = (now - t0) * 1e-3
      gl.useProgram(prog)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
      gl.uniform1f(timLoc, t)
      gl.uniform2f(mouLoc, mx, my)
      gl.uniform1i(pntLoc, active)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize',     resize)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseleave', onLeave)
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
        pointerEvents: 'none',   /* pointer events handled at window level */
        zIndex:        0,
        display:       'block',
        ...style,
      }}
    />
  )
}
