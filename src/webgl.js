import { GAME_HEIGHT, GAME_WIDTH } from './config.js';

const vsSource = `
  attribute vec3 aPosition;
  uniform mat4 uMvp;
  void main() {
    gl_Position = uMvp * vec4(aPosition, 1.0);
  }
`;

const fsSource = `
  precision mediump float;
  uniform vec4 uColor;
  void main() {
    gl_FragColor = uColor;
  }
`;

function createShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
  }

  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
  }

  return program;
}

export function initCanvasWebgl() {
  const canvas = document.getElementById('game');
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  canvas.style.visibility = 'visible';

  const gl = canvas.getContext('webgl');

  const program = createProgram(gl, vsSource, fsSource);
  gl.useProgram(program);

  gl.enable(gl.DEPTH_TEST);

  return { gl, program };
}
