// Animated WebGL mesh gradient for the page background.
// Ported from a React/TypeScript "GradientWave" component to a plain module: the mesh and shaders
// are the same; sizing follows the container, it runs at most 30 fps and pauses off-screen, draws
// one still frame when the visitor prefers reduced motion, and cleans itself up once its canvas
// leaves the page. Colours can change on the fly (light/dark theme).

function normalizeColor(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

class MiniGl {
  constructor(canvas) {
    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) throw new Error("WebGL not supported");
    this.canvas = canvas;
    this.gl = gl;
    this.meshes = [];
    const context = gl;
    const miniGl = this;

    this.Uniform = class {
      constructor(e) {
        this.type = "float";
        Object.assign(this, e);
        const typeMap = { float: "1f", int: "1i", vec2: "2fv", vec3: "3fv", vec4: "4fv", mat4: "Matrix4fv" };
        this.typeFn = typeMap[this.type] || "1f";
      }

      update(location) {
        if (this.value === undefined || location === null) return;
        const fn = `uniform${this.typeFn}`;
        if (this.typeFn.startsWith("Matrix")) context[fn](location, this.transpose || false, this.value);
        else context[fn](location, this.value);
      }

      getDeclaration(name, type, length) {
        if (this.excludeFrom === type) return "";
        if (this.type === "array") {
          return `${this.value[0].getDeclaration(name, type, this.value.length)}\nconst int ${name}_length = ${this.value.length};`;
        }
        if (this.type === "struct") {
          let structName = name.replace("u_", "");
          structName = structName.charAt(0).toUpperCase() + structName.slice(1);
          const fields = Object.entries(this.value)
            .map(([field, u]) => u.getDeclaration(field, type).replace(/^uniform/, ""))
            .join("");
          return `uniform struct ${structName} {\n${fields}\n} ${name}${length ? `[${length}]` : ""};`;
        }
        return `uniform ${this.type} ${name}${length ? `[${length}]` : ""};`;
      }
    };

    this.Attribute = class {
      constructor(e) {
        this.type = context.FLOAT;
        this.normalized = false;
        this.buffer = context.createBuffer();
        Object.assign(this, e);
      }

      update() {
        if (!this.values) return;
        context.bindBuffer(this.target, this.buffer);
        context.bufferData(this.target, this.values, context.STATIC_DRAW);
      }

      attach(name, program) {
        const location = context.getAttribLocation(program, name);
        this.use(location);
        return location;
      }

      use(location) {
        context.bindBuffer(this.target, this.buffer);
        if (this.target === context.ARRAY_BUFFER && location >= 0) {
          context.enableVertexAttribArray(location);
          context.vertexAttribPointer(location, this.size, this.type, this.normalized, 0, 0);
        }
      }
    };

    this.Material = class {
      constructor(vertexShader, fragmentShader, uniforms = {}) {
        this.uniforms = uniforms;
        this.uniformInstances = [];

        const compile = (type, source) => {
          const shader = context.createShader(type);
          context.shaderSource(shader, source);
          context.compileShader(shader);
          if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
            throw new Error(context.getShaderInfoLog(shader) || "Shader compilation error");
          }
          return shader;
        };
        const declarations = (all, type) =>
          Object.entries(all)
            .map(([name, u]) => u.getDeclaration(name, type))
            .join("\n");

        const prefix = "precision highp float;";
        const vertexSource = `${prefix}
attribute vec4 position;
attribute vec2 uv;
attribute vec2 uvNorm;
${declarations(miniGl.commonUniforms, "vertex")}
${declarations(uniforms, "vertex")}
${vertexShader}`;
        const fragmentSource = `${prefix}
${declarations(miniGl.commonUniforms, "fragment")}
${declarations(uniforms, "fragment")}
${fragmentShader}`;

        this.program = context.createProgram();
        context.attachShader(this.program, compile(context.VERTEX_SHADER, vertexSource));
        context.attachShader(this.program, compile(context.FRAGMENT_SHADER, fragmentSource));
        context.linkProgram(this.program);
        if (!context.getProgramParameter(this.program, context.LINK_STATUS)) {
          throw new Error(context.getProgramInfoLog(this.program) || "Program linking error");
        }
        context.useProgram(this.program);
        this.attachUniforms(undefined, miniGl.commonUniforms);
        this.attachUniforms(undefined, this.uniforms);
      }

      attachUniforms(name, uniforms) {
        if (name === undefined) {
          Object.entries(uniforms).forEach(([n, u]) => this.attachUniforms(n, u));
        } else if (uniforms.type === "array") {
          uniforms.value.forEach((u, i) => this.attachUniforms(`${name}[${i}]`, u));
        } else if (uniforms.type === "struct") {
          Object.entries(uniforms.value).forEach(([field, u]) => this.attachUniforms(`${name}.${field}`, u));
        } else {
          this.uniformInstances.push({ uniform: uniforms, location: context.getUniformLocation(this.program, name) });
        }
      }
    };

    this.PlaneGeometry = class {
      constructor() {
        this.width = 1;
        this.height = 1;
        this.vertexCount = 0;
        this.xSegCount = 0;
        this.ySegCount = 0;
        this.attributes = {
          position: new miniGl.Attribute({ target: context.ARRAY_BUFFER, size: 3 }),
          uv: new miniGl.Attribute({ target: context.ARRAY_BUFFER, size: 2 }),
          uvNorm: new miniGl.Attribute({ target: context.ARRAY_BUFFER, size: 2 }),
          index: new miniGl.Attribute({ target: context.ELEMENT_ARRAY_BUFFER, size: 3, type: context.UNSIGNED_SHORT }),
        };
      }

      setTopology(xSegs = 1, ySegs = 1) {
        this.xSegCount = xSegs;
        this.ySegCount = ySegs;
        this.vertexCount = (xSegs + 1) * (ySegs + 1);
        const { uv, uvNorm, index } = this.attributes;
        uv.values = new Float32Array(2 * this.vertexCount);
        uvNorm.values = new Float32Array(2 * this.vertexCount);
        index.values = new Uint16Array(3 * xSegs * ySegs * 2);

        for (let y = 0; y <= ySegs; y++) {
          for (let x = 0; x <= xSegs; x++) {
            const i = y * (xSegs + 1) + x;
            uv.values[2 * i] = x / xSegs;
            uv.values[2 * i + 1] = 1 - y / ySegs;
            uvNorm.values[2 * i] = (x / xSegs) * 2 - 1;
            uvNorm.values[2 * i + 1] = 1 - (y / ySegs) * 2;
            if (x < xSegs && y < ySegs) {
              const s = y * xSegs + x;
              index.values.set([i, i + 1 + xSegs, i + 1, i + 1, i + 1 + xSegs, i + 2 + xSegs], 6 * s);
            }
          }
        }
        uv.update();
        uvNorm.update();
        index.update();
      }

      setSize(width = 1, height = 1) {
        this.width = width;
        this.height = height;
        const position = this.attributes.position;
        position.values = new Float32Array(3 * this.vertexCount);
        const segWidth = width / this.xSegCount;
        const segHeight = height / this.ySegCount;
        for (let y = 0; y <= this.ySegCount; y++) {
          const posY = height / -2 + y * segHeight;
          for (let x = 0; x <= this.xSegCount; x++) {
            const idx = y * (this.xSegCount + 1) + x;
            position.values[3 * idx] = width / -2 + x * segWidth;
            position.values[3 * idx + 1] = -posY;
          }
        }
        position.update();
      }
    };

    this.Mesh = class {
      constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
        this.attributeInstances = Object.entries(geometry.attributes).map(([name, attribute]) => ({
          attribute,
          location: attribute.attach(name, material.program),
        }));
        miniGl.meshes.push(this);
      }

      draw() {
        context.useProgram(this.material.program);
        this.material.uniformInstances.forEach(({ uniform, location }) => uniform.update(location));
        this.attributeInstances.forEach(({ attribute, location }) => attribute.use(location));
        context.drawElements(context.TRIANGLES, this.geometry.attributes.index.values.length, context.UNSIGNED_SHORT, 0);
      }
    };

    const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    this.commonUniforms = {
      projectionMatrix: new this.Uniform({ type: "mat4", value: identity }),
      modelViewMatrix: new this.Uniform({ type: "mat4", value: identity }),
      resolution: new this.Uniform({ type: "vec2", value: [1, 1] }),
      aspectRatio: new this.Uniform({ type: "float", value: 1 }),
    };
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
    this.commonUniforms.resolution.value = [width, height];
    this.commonUniforms.aspectRatio.value = width / height;
  }

  setOrthographicCamera() {
    this.commonUniforms.projectionMatrix.value = [2 / this.width, 0, 0, 0, 0, 2 / this.height, 0, 0, 0, 0, -0.001, 0, 0, 0, 0, 1];
  }

  render() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clearDepth(1);
    this.meshes.forEach((m) => m.draw());
  }
}

const VERTEX_SHADER = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 blendNormal(vec3 base, vec3 blend) { return blend; }
vec3 blendNormal(vec3 base, vec3 blend, float opacity) { return (blend * opacity + base * (1.0 - opacity)); }

varying vec3 v_color;

void main() {
  float time = u_time * u_global.noiseSpeed;
  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;
  float tilt = resolution.y / 2.0 * uvNorm.y;
  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;
  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);

  float noise = snoise(vec3(
    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
    noiseCoord.y * u_vertDeform.noiseFreq.y,
    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
  )) * u_vertDeform.noiseAmp;

  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);
  noise = max(0.0, noise);

  vec3 pos = vec3(position.x, position.y + tilt + incline + noise - offset, position.z);

  v_color = u_baseColor;

  for (int i = 0; i < u_waveLayers_length; i++) {
    if (u_active_colors[i + 1] == 1.) {
      WaveLayers layer = u_waveLayers[i];
      float layerNoise = smoothstep(
        layer.noiseFloor,
        layer.noiseCeil,
        snoise(vec3(
          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
          noiseCoord.y * layer.noiseFreq.y,
          time * layer.noiseSpeed + layer.noiseSeed
        )) / 2.0 + 0.5
      );
      v_color = blendNormal(v_color, layer.color, pow(layerNoise, 4.));
    }
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

const FRAGMENT_SHADER = `
varying vec3 v_color;

void main() {
  vec3 color = v_color;
  if (u_darken_top == 1.0) {
    vec2 st = gl_FragCoord.xy/resolution.xy;
    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
  }
  gl_FragColor = vec4(color, 1.0);
}`;

class Gradient {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.time = options.startTime;
    this.last = 0;
    this.isPlaying = false;
    this.minigl = new MiniGl(canvas);

    const gl = this.minigl;
    // The shader blends at most four colours (u_active_colors is a vec4).
    const colors = options.colors.slice(0, 4).map(normalizeColor);
    const deform = { incline: 0, offsetTop: -0.5, offsetBottom: -0.5, noiseFreq: [3, 4], noiseAmp: 320, noiseSpeed: 10, noiseFlow: 3, noiseSeed: 5, ...options.deform };

    this.uniforms = {
      u_time: new gl.Uniform({ value: 0 }),
      u_shadow_power: new gl.Uniform({ value: options.shadowPower }),
      u_darken_top: new gl.Uniform({ value: options.darkenTop ? 1 : 0 }),
      u_active_colors: new gl.Uniform({ value: [1, 1, 1, 1], type: "vec4" }),
      u_global: new gl.Uniform({
        type: "struct",
        value: {
          noiseFreq: new gl.Uniform({ value: options.noiseFrequency, type: "vec2" }),
          noiseSpeed: new gl.Uniform({ value: options.noiseSpeed }),
        },
      }),
      u_vertDeform: new gl.Uniform({
        type: "struct",
        excludeFrom: "fragment",
        value: Object.fromEntries(
          Object.entries(deform).map(([k, v]) => [k, new gl.Uniform(Array.isArray(v) ? { value: v, type: "vec2" } : { value: v })]),
        ),
      }),
      u_baseColor: new gl.Uniform({ value: colors[0], type: "vec3", excludeFrom: "fragment" }),
      u_waveLayers: new gl.Uniform({
        type: "array",
        excludeFrom: "fragment",
        value: colors.slice(1).map(
          (color, n) =>
            new gl.Uniform({
              type: "struct",
              value: {
                color: new gl.Uniform({ value: color, type: "vec3" }),
                noiseFreq: new gl.Uniform({ value: [2 + (n + 1) / colors.length, 3 + (n + 1) / colors.length], type: "vec2" }),
                noiseSpeed: new gl.Uniform({ value: 11 + 0.3 * (n + 1) }),
                noiseFlow: new gl.Uniform({ value: 6.5 + 0.3 * (n + 1) }),
                noiseSeed: new gl.Uniform({ value: 5 + 10 * (n + 1) }),
                noiseFloor: new gl.Uniform({ value: 0.1 }),
                noiseCeil: new gl.Uniform({ value: 0.63 + 0.07 * (n + 1) }),
              },
            }),
        ),
      }),
    };

    const material = new gl.Material(VERTEX_SHADER, FRAGMENT_SHADER, this.uniforms);
    this.mesh = new gl.Mesh(new gl.PlaneGeometry(), material);
    this.resize();
  }

  resize() {
    const width = Math.max(1, Math.round(this.canvas.clientWidth));
    const height = Math.max(1, Math.round(this.canvas.clientHeight));
    if (width === this.minigl.width && height === this.minigl.height) return;
    this.minigl.setSize(width, height);
    this.minigl.setOrthographicCamera();
    this.mesh.geometry.setTopology(Math.ceil(width * 0.02), Math.ceil(height * 0.05));
    this.mesh.geometry.setSize(width, height);
  }

  setColors(hexColors) {
    const colors = hexColors.slice(0, 4).map(normalizeColor);
    this.uniforms.u_baseColor.value = colors[0];
    this.uniforms.u_waveLayers.value.forEach((layer, i) => {
      if (colors[i + 1]) layer.value.color.value = colors[i + 1];
    });
    this.draw();
  }

  draw() {
    this.uniforms.u_time.value = this.time;
    this.minigl.render();
  }

  animate = (timestamp) => {
    if (!this.isPlaying) return;
    this.frame = requestAnimationFrame(this.animate);
    // A slow background doesn't need more than 30 frames a second.
    if (timestamp - this.last < 1000 / 30) return;
    this.time += Math.min(timestamp - this.last, 1000 / 15);
    this.last = timestamp;
    this.draw();
  };

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.last = performance.now();
    this.frame = requestAnimationFrame(this.animate);
  }

  stop() {
    this.isPlaying = false;
    cancelAnimationFrame(this.frame);
  }
}

const DEFAULTS = {
  colors: ["#38bdf8", "#ffffff", "#38bdf8", "#ffffff"],
  shadowPower: 8,
  darkenTop: false,
  noiseSpeed: 0.00001,
  noiseFrequency: [0.0001, 0.0009],
  deform: { incline: 0.5, noiseAmp: 250, noiseFlow: 5 },
  startTime: 0,
};

/**
 * Fill `container` (positioned, with a size) with the animated gradient.
 * Returns null when WebGL isn't available, so the container's CSS background shows instead.
 */
export function mountGradientWave(container, options = {}) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "absolute", inset: "0", width: "100%", height: "100%", display: "block" });
  container.appendChild(canvas);

  let gradient;
  try {
    gradient = new Gradient(canvas, { ...DEFAULTS, ...options, deform: { ...DEFAULTS.deform, ...options.deform } });
  } catch (error) {
    console.warn("Gradient wave unavailable:", error);
    canvas.remove();
    return null;
  }

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = true;
  const sync = () => (visible && !still ? gradient.start() : gradient.stop());

  const resizer = new ResizeObserver(() => {
    gradient.resize();
    gradient.draw();
  });
  const watcher = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });

  const destroy = () => {
    gradient.stop();
    resizer.disconnect();
    watcher.disconnect();
    gradient.minigl.gl.getExtension("WEBGL_lose_context")?.loseContext();
    canvas.remove();
  };

  // The page re-renders by replacing markup, so stop once the canvas is gone.
  const remover = new MutationObserver(() => {
    if (!canvas.isConnected) {
      remover.disconnect();
      destroy();
    }
  });
  remover.observe(document.body, { childList: true, subtree: true });

  resizer.observe(canvas);
  watcher.observe(canvas);
  gradient.draw();
  sync();
  return { destroy, setColors: (colors) => gradient.setColors(colors) };
}
