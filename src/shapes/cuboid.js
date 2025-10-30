export class Cuboid {
  constructor(gl, x, y, z, width, height, depth) {
    const x2 = x + width;
    const y2 = y + height;
    const z2 = z + depth;

    this.vertices = new Float32Array([
      // Front
      x,
      y,
      z,
      x2,
      y,
      z,
      x2,
      y2,
      z,
      x,
      y2,
      z,
      // Back
      x,
      y,
      z2,
      x2,
      y,
      z2,
      x2,
      y2,
      z2,
      x,
      y2,
      z2,
      // Left
      x,
      y,
      z,
      x,
      y2,
      z,
      x,
      y2,
      z2,
      x,
      y,
      z2,
      // Right
      x2,
      y,
      z,
      x2,
      y2,
      z,
      x2,
      y2,
      z2,
      x2,
      y,
      z2,
      // Top
      x,
      y2,
      z,
      x2,
      y2,
      z,
      x2,
      y2,
      z2,
      x,
      y2,
      z2,
      // Bottom
      x,
      y,
      z,
      x2,
      y,
      z,
      x2,
      y,
      z2,
      x,
      y,
      z2,
    ]);

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
  }

  draw(gl, aPosition) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 24);
  }
}
