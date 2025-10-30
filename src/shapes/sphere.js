import { BALL_DIAMETER } from '../config.js';

export class Sphere {
  constructor(gl, latBands = 24, lonBands = 24) {
    const radius = BALL_DIAMETER / 2;

    const vertices = [];

    for (let lat = 0; lat <= latBands; lat++) {
      const theta = (lat * Math.PI) / latBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= lonBands; lon++) {
        const phi = (lon * 2 * Math.PI) / lonBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;

        vertices.push(radius * x, radius * y, radius * z);
      }
    }

    const points = [];
    for (let lat = 0; lat < latBands; lat++) {
      for (let lon = 0; lon < lonBands; lon++) {
        const first = lat * (lonBands + 1) + lon;
        const second = first + lonBands + 1;

        // two triangles per quad
        points.push(
          ...vertices.slice(first * 3, first * 3 + 3),
          ...vertices.slice(second * 3, second * 3 + 3),
          ...vertices.slice((first + 1) * 3, (first + 1) * 3 + 3),

          ...vertices.slice(second * 3, second * 3 + 3),
          ...vertices.slice((second + 1) * 3, (second + 1) * 3 + 3),
          ...vertices.slice((first + 1) * 3, (first + 1) * 3 + 3)
        );
      }
    }

    this.vertices = new Float32Array(points);

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
  }

  draw(gl, aPosition) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
  }
}
