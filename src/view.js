import { mat4 } from 'gl-matrix';
import {
  BALL_DIAMETER,
  GAME_HEIGHT,
  GAME_WIDTH,
  GATE_DEPTH,
  GATE_HEIGHT,
  GATE_HOLE_SIZE,
  PLATFORM_DEPTH,
  PLATFORM_HEIGHT,
  PLATFORM_WIDTH,
  PLATFORM_Z,
} from './config.js';
import { Cuboid } from './shapes/cuboid.js';
import { Sphere } from './shapes/sphere.js';

export class View {
  constructor(gl, program, state) {
    this.gl = gl;
    this.program = program;

    this.platform = new Cuboid(
      gl,
      0,
      -PLATFORM_HEIGHT,
      PLATFORM_Z,
      PLATFORM_WIDTH,
      PLATFORM_HEIGHT,
      PLATFORM_DEPTH
    );
    this.sphere = new Sphere(gl);

    this.createGateCuboids(state);
  }

  createGateCuboids(state) {
    this.gateCuboids = [];

    for (const gate of state.gates) {
      const { z, holeY } = gate;

      const w = PLATFORM_WIDTH;
      const h = GATE_HEIGHT;
      const d = GATE_DEPTH;
      const barW = (PLATFORM_WIDTH - GATE_HOLE_SIZE) / 2;

      this.gateCuboids.push(
        // Left bar (full height)
        new Cuboid(this.gl, 0, 0, z, barW, h, d),

        // Right bar (full height)
        new Cuboid(this.gl, w - barW, 0, z, barW, h, d),

        // Bottom bar (below hole)
        new Cuboid(this.gl, barW, 0, z, w - 2 * barW, holeY, d),

        // Top bar (above hole)
        new Cuboid(
          this.gl,
          barW,
          holeY + GATE_HOLE_SIZE,
          z,
          w - 2 * barW,
          h - (holeY + GATE_HOLE_SIZE),
          d
        )
      );
    }
  }

  render(state) {
    const aPosition = this.gl.getAttribLocation(this.program, 'aPosition');
    const uMvp = this.gl.getUniformLocation(this.program, 'uMvp');
    const uColor = this.gl.getUniformLocation(this.program, 'uColor');

    this.gl.clearColor(0.2, 0.2, 0.25, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enableVertexAttribArray(aPosition);

    const proj = mat4.create();
    const view = mat4.create();
    const ballModel = mat4.create();
    const ballMvp = mat4.create();
    const worldModel = mat4.create();
    const worldMvp = mat4.create();

    const ball = state.ball.position;

    mat4.perspective(proj, Math.PI / 2, GAME_WIDTH / GAME_HEIGHT, 0.1, 100);

    const eye = [-1.5, 1.5, -2];
    if (state.gameOverTimer > 0) {
      eye[2] -= Math.min(
        Math.pow(state.gameOverTimer, 3),
        PLATFORM_DEPTH + PLATFORM_Z
      );
    }
    mat4.lookAt(view, eye, [1, 2, 1], [0, 1, 0]);

    mat4.translate(ballModel, ballModel, [
      PLATFORM_WIDTH / 2,
      ball[1] + BALL_DIAMETER / 2,
      0,
    ]);

    mat4.multiply(ballMvp, proj, view);
    mat4.multiply(ballMvp, ballMvp, ballModel);

    // World moves backward by ball Z
    mat4.translate(worldModel, worldModel, [0, 0, -ball[2]]);
    mat4.multiply(worldMvp, proj, view);
    mat4.multiply(worldMvp, worldMvp, worldModel);
    this.gl.uniformMatrix4fv(uMvp, false, worldMvp);

    // Draw platform
    this.gl.uniform4f(uColor, 0.4, 0.4, 0.4, 1);
    this.platform.draw(this.gl, aPosition);

    // Draw gates
    this.gl.uniform4f(uColor, 0, 209 / 255, 17 / 255, 1);
    for (const [i, gateCuboid] of Object.entries(this.gateCuboids)) {
      if (Math.floor(i / 4) === state.currentGate) {
        this.gl.uniform4f(uColor, 163 / 255, 92 / 255, 0, 1);
      }

      gateCuboid.draw(this.gl, aPosition);
    }

    // Draw sphere
    this.gl.uniformMatrix4fv(uMvp, false, ballMvp);
    this.gl.vertexAttribPointer(aPosition, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform4f(uColor, 0.3, 0.7, 1.0, 1);
    this.sphere.draw(this.gl, aPosition);
  }
}
