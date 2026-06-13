"use client";

import React, { useEffect, useRef } from "react";

const declarePI = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`;

const proceduralHash11 = `
float hash11(float p) {
  p = fract(p * 0.3183099) + 0.1;
  p *= p + 19.19;
  return fract(p * p);
}
`;

const proceduralHash21 = `
float hash21(vec2 p) {
  p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}
`;

const simplexNoise = `
vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 289.0);

  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) +
    i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ),
    0.0
  );

  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}
`;

const vertexShaderSource = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec4 u_colorBack;
uniform vec4 u_colorFront;
uniform float u_shape;
uniform float u_type;
uniform float u_pxSize;

out vec4 fragColor;

${simplexNoise}
${declarePI}
${proceduralHash11}
${proceduralHash21}

float getSimplexNoise(vec2 uv, float t) {
  float noise = 0.5 * snoise(uv - vec2(0.0, 0.3 * t));
  noise += 0.5 * snoise(2.0 * uv + vec2(0.0, 0.32 * t));
  return noise;
}

const int bayer2x2[4] = int[4](
  0, 2,
  3, 1
);

const int bayer4x4[16] = int[16](
   0,  8,  2, 10,
  12,  4, 14,  6,
   3, 11,  1,  9,
  15,  7, 13,  5
);

const int bayer8x8[64] = int[64](
   0, 32,  8, 40,  2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44,  4, 36, 14, 46,  6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
   3, 35, 11, 43,  1, 33,  9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47,  7, 39, 13, 45,  5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(mod(uv, float(size)));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }

  return 0.0;
}

float isExactCell(vec2 a, vec2 b) {
  float matchX = 1.0 - step(0.5, abs(a.x - b.x));
  float matchY = 1.0 - step(0.5, abs(a.y - b.y));
  return matchX * matchY;
}

float pixelStarShape(vec2 localCell) {
  float center =
    isExactCell(localCell, vec2(2.0, 2.0));

  float cross =
    isExactCell(localCell, vec2(2.0, 1.0)) +
    isExactCell(localCell, vec2(2.0, 3.0)) +
    isExactCell(localCell, vec2(1.0, 2.0)) +
    isExactCell(localCell, vec2(3.0, 2.0));

  float diagonals =
    isExactCell(localCell, vec2(1.0, 1.0)) +
    isExactCell(localCell, vec2(3.0, 1.0)) +
    isExactCell(localCell, vec2(1.0, 3.0)) +
    isExactCell(localCell, vec2(3.0, 3.0));

  float star = 0.0;
  star = max(star, center);
  star = max(star, cross);
  star = max(star, diagonals);

  return clamp(star, 0.0, 1.0);
}

void main() {
  float t = 0.5 * u_time;

  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv -= 0.5;

  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;

  float pxSize = u_pxSize;

  vec2 pxSizeUv = gl_FragCoord.xy;
  pxSizeUv -= 0.5 * u_resolution;
  pxSizeUv /= pxSize;

  vec2 pixelizedUv = floor(pxSizeUv) * pxSize / u_resolution.xy;
  pixelizedUv += 0.5;
  pixelizedUv -= 0.5;
  pixelizedUv.x *= aspect;

  vec2 shape_uv = pixelizedUv;
  vec2 dithering_uv = pxSizeUv;
  vec2 ditheringNoise_uv = uv * u_resolution;

  float shape = 0.0;

  if (u_shape < 1.5) {
    shape_uv *= 0.001;
    shape = 0.5 + 0.5 * getSimplexNoise(shape_uv, t);
    shape = smoothstep(0.3, 0.9, shape);

  } else if (u_shape < 2.5) {
    shape_uv *= 0.003;

    for (float i = 1.0; i < 6.0; i++) {
      shape_uv.x += 0.6 / i * cos(i * 2.5 * shape_uv.y + t);
      shape_uv.y += 0.6 / i * cos(i * 1.5 * shape_uv.x + t);
    }

    shape = 0.15 / abs(sin(t - shape_uv.y - shape_uv.x));
    shape = smoothstep(0.02, 1.0, shape);

  } else if (u_shape < 3.5) {
    shape_uv *= 0.05;

    float stripeIdx = floor(2.0 * shape_uv.x / TWO_PI);
    float rand = hash11(stripeIdx * 10.0);
    rand = sign(rand - 0.5) * pow(0.1 + abs(rand), 0.4);

    shape = sin(shape_uv.x) * cos(shape_uv.y - 5.0 * rand * t);
    shape = pow(abs(shape), 6.0);

  } else if (u_shape < 4.5) {
    vec2 p = shape_uv;

    p.x *= 5.0;
    p.y *= 3.0;

    float movingX = p.x - t * 2.8;

    float phaseNoise = snoise(vec2(p.x * 0.45, t * 0.35)) * 0.25;

    float verticalMotion = sin(t * 2.2 + p.x * 0.75) * 0.30;

    float ampMain = 0.70 + 0.35 * snoise(vec2(t * 0.22, p.x * 0.08));
    float ampDetail = 0.16 + 0.28 * snoise(vec2(t * 0.34 + 11.0, p.x * 0.12));
    float ampSpike = 0.10 + 0.40 * smoothstep(
      0.15,
      0.85,
      0.5 + 0.5 * snoise(vec2(t * 0.42 + 23.0, p.x * 0.06))
    );

    ampMain = max(0.30, ampMain);
    ampDetail = max(0.00, ampDetail);
    ampSpike = max(0.00, ampSpike);

    float waveA = sin(movingX * 0.90 + phaseNoise) * ampMain;
    float waveB = sin(movingX * 2.60 - t * 1.00 + phaseNoise * 0.5) * ampDetail;
    float waveC = cos(movingX * 0.55 + t * 0.45) * 0.18;

    float pulse = pow(
      max(0.0, sin(movingX * 1.15 - t * 0.85 + phaseNoise)),
      3.5
    ) * ampSpike;

    float pulseDip = -pow(
      max(0.0, sin(movingX * 1.15 - t * 0.85 + 1.6)),
      3.0
    ) * 0.18;

    float centerLine = waveA + waveB + waveC + pulse + pulseDip;
    centerLine *= 0.60;
    centerLine += verticalMotion;

    float signedDist = p.y - centerLine;
    float absDist = abs(signedDist);

    float thickness =
      0.22
      + 0.10 * sin(movingX * 1.2 + t * 0.9)
      + 0.05 * sin(movingX * 2.0 - t * 1.1)
      + pulse * 0.10;

    float core = 1.0 - smoothstep(
      thickness * 0.25,
      thickness * 1.22,
      absDist
    );

    float midDensity = 1.0 - smoothstep(
      thickness * 0.88,
      thickness + 0.55,
      absDist
    );

    float outerDensity = 1.0 - smoothstep(
      thickness + 0.24,
      thickness + 0.86,
      absDist
    );

    float topDensityNoise =
      snoise(vec2(movingX * 0.85, p.y * 1.6 + t * 0.35));

    float bottomDensityNoise =
      snoise(vec2(movingX * 0.95 + 19.7, p.y * 1.8 - t * 0.28));

    float topDensity = clamp(
      0.50 + 0.44 * topDensityNoise,
      0.10,
      1.0
    );

    float bottomDensity = clamp(
      0.50 + 0.44 * bottomDensityNoise,
      0.10,
      1.0
    );

    float sideMask = step(0.0, signedDist);
    float densityVariation = mix(bottomDensity, topDensity, sideMask);

    float edgeNoise = snoise(vec2(movingX * 1.6, p.y * 2.4 + t * 0.35));
    float breakup = clamp(0.82 + edgeNoise * 0.18, 0.35, 1.0);

    midDensity *= mix(0.82, densityVariation, 0.45);
    outerDensity *= densityVariation * breakup;

    float body = max(
      core,
      max(
        midDensity * 0.82,
        outerDensity * 0.28
      )
    );

    float secondLine = centerLine - 0.54 + sin(movingX * 1.55 + t * 0.7) * 0.10;
    float secondDist = abs(p.y - secondLine);
    float secondary = 1.0 - smoothstep(0.20, 0.44, secondDist);

    vec2 starUv = floor(dithering_uv);
    vec2 starTile = floor(starUv / 5.0);
    vec2 starLocal = mod(starUv, 5.0);

    float starSpawn = step(0.979, hash21(starTile + 27.3));
    float starBand = 1.0 - smoothstep(0.75, 1.55, absDist);
    float stars = starSpawn * starBand * pixelStarShape(starLocal);

    shape = body;
    shape = max(shape, secondary * 0.18);
    shape = max(shape, stars);

  } else if (u_shape < 5.5) {
    float dist = length(shape_uv);
    float waves = sin(pow(dist, 1.7) * 7.0 - 3.0 * t) * 0.5 + 0.5;
    shape = waves;

  } else if (u_shape < 6.5) {
    float l = length(shape_uv);
    float angle = 6.0 * atan(shape_uv.y, shape_uv.x) + 4.0 * t;
    float twist = 1.2;
    float offset = pow(l, -twist) + angle / TWO_PI;
    float mid = smoothstep(0.0, 1.0, pow(l, twist));

    shape = mix(0.0, fract(offset), mid);

  } else {
    shape_uv *= 2.0;

    float d = 1.0 - pow(length(shape_uv), 2.0);

    if (d > 0.0) {
      vec3 pos = vec3(shape_uv, sqrt(d));
      vec3 lightPos = normalize(vec3(cos(1.5 * t), 0.8, sin(1.25 * t)));
      shape = 0.5 + 0.5 * dot(lightPos, pos);
      shape *= step(0.0, d);
    } else {
      shape = 0.0;
    }
  }

  int type = int(u_type);
  vec3 color = u_colorBack.rgb;

  float ditherVal = 0.0;
  if (type == 0) {
    // Simple threshold
    if (shape > 0.5) {
      color = u_colorFront.rgb;
    }
  } else if (type == 1) {
    // Bayer 2x2 Dithering
    ditherVal = getBayerValue(dithering_uv, 2);
    if (shape > ditherVal) {
      color = u_colorFront.rgb;
    }
  } else if (type == 2) {
    // Bayer 4x4 Dithering
    ditherVal = getBayerValue(dithering_uv, 4);
    if (shape > ditherVal) {
      color = u_colorFront.rgb;
    }
  } else if (type == 3) {
    // Bayer 8x8 Dithering
    ditherVal = getBayerValue(dithering_uv, 8);
    if (shape > ditherVal) {
      color = u_colorFront.rgb;
    }
  } else if (type == 4) {
    // Grid overlay style
    float grid = step(0.9, fract(dithering_uv.x * 0.25)) + step(0.9, fract(dithering_uv.y * 0.25));
    if (shape > 0.2 && grid > 0.0) {
      color = u_colorFront.rgb;
    }
  } else if (type == 5) {
    // Halftone dots
    vec2 center = fract(dithering_uv * 0.1) - 0.5;
    float dist = length(center);
    if (shape * 0.5 > dist) {
      color = u_colorFront.rgb;
    }
  } else {
    // Smooth color blend
    color = mix(u_colorBack.rgb, u_colorFront.rgb, shape);
  }

  fragColor = vec4(color, 1.0);
}
`;

interface HeroShaderProps {
  colorBack?: [number, number, number, number]; // RGBA
  colorFront?: [number, number, number, number]; // RGBA
  shape?: number; // 1.0 to 7.0
  type?: number; // 0 to 6
  pxSize?: number; // 1.0 to 16.0
  className?: string;
}

export const HeroShader: React.FC<HeroShaderProps> = ({
  colorBack = [0.08, 0.08, 0.1, 1.0], // Dark primary background
  colorFront = [0.93, 0.25, 0.25, 1.0], // Reddish accent front color (matches CodeAarambh theme)
  shape = 4.0, // Wave shape
  type = 3.0, // Bayer 8x8
  pxSize = 4.0, // Dither pixel size
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { alpha: false, depth: false });
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }
    glRef.current = gl;

    // Compile helper
    const createShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    programRef.current = program;

    // Fullscreen quad positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Setup attribute
    gl.useProgram(program);
    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Resize handler
    const resize = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    resize();

    window.addEventListener("resize", resize);

    // Uniform locations
    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResLoc = gl.getUniformLocation(program, "u_resolution");
    const uColBackLoc = gl.getUniformLocation(program, "u_colorBack");
    const uColFrontLoc = gl.getUniformLocation(program, "u_colorFront");
    const uShapeLoc = gl.getUniformLocation(program, "u_shape");
    const uTypeLoc = gl.getUniformLocation(program, "u_type");
    const uPxSizeLoc = gl.getUniformLocation(program, "u_pxSize");

    const startTime = performance.now();

    const render = () => {
      const time = (performance.now() - startTime) / 1000.0;

      gl.useProgram(program);

      // Set uniforms
      gl.uniform1f(uTimeLoc, time);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform4fv(uColBackLoc, colorBack);
      gl.uniform4fv(uColFrontLoc, colorFront);
      gl.uniform1f(uShapeLoc, shape);
      gl.uniform1f(uTypeLoc, type);
      gl.uniform1f(uPxSizeLoc, pxSize);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [colorBack, colorFront, shape, type, pxSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full block touch-none pointer-events-none ${className}`}
    />
  );
};
