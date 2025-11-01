import { mat4 } from 'gl-matrix';
import {
  BALL_DIAMETER,
  COLOR_BACKGROUND,
  COLOR_BALL,
  COLOR_GATE,
  COLOR_GATE_DONE,
  COLOR_PLATFORM,
  GAME_HEIGHT,
  GAME_WIDTH,
  PLATFORM_DEPTH,
  PLATFORM_HEIGHT,
  PLATFORM_WIDTH,
  PLATFORM_Z,
} from './config.js';
import { Cuboid } from './shapes/cuboid.js';
import { Gate } from './shapes/gate.js';
import { Sphere } from './shapes/sphere.js';

export class View {
  constructor(gl, program, state) {
    this.gl = gl;
    this.program = program;

    this.message = document.getElementById('message');

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
    this.gates = state.gates.map((gate) => new Gate(gl, gate));
  }

  renderMessage(state) {
    const { gates, currentGate, gameOverTimer } = state;

    if (gameOverTimer === -1) {
      const gate = gates[currentGate];
      this.message.innerText = `🎵 ${gate.label}`;
    } else {
      this.message.innerText = 'Congrats! 🎉🎉🎉';
    }
  }

  render(state) {
    this.renderMessage(state);

    const aPosition = this.gl.getAttribLocation(this.program, 'aPosition');
    const uMvp = this.gl.getUniformLocation(this.program, 'uMvp');
    const uColor = this.gl.getUniformLocation(this.program, 'uColor');

    this.gl.clearColor(...COLOR_BACKGROUND);
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
    this.gl.uniform4fv(uColor, COLOR_PLATFORM);
    this.platform.draw(this.gl, aPosition);

    // Draw gates
    this.gl.uniform4fv(uColor, COLOR_GATE_DONE);
    for (const [i, gate] of Object.entries(this.gates)) {
      if (Number(i) === state.currentGate) {
        this.gl.uniform4fv(uColor, COLOR_GATE);
      }

      gate.draw(this.gl, aPosition);
    }

    // Draw ball
    this.gl.uniformMatrix4fv(uMvp, false, ballMvp);
    this.gl.vertexAttribPointer(aPosition, 3, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform4fv(uColor, COLOR_BALL);
    this.sphere.draw(this.gl, aPosition);
  }
}
