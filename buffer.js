function initBuffers(gl) {
    const positionBuffer = initBufferPosition(gl);
    const pathBuffer = initBufferPath(gl);
    const colorBuffer = initBufferColor(gl);

    return {
        position: positionBuffer,
        path: pathBuffer,
        color: colorBuffer,
    };
}

function initBufferPosition(gl)
{
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // const position = [1., 1., -1., 1., 1., -1., -1., -1.];
    const position = [100., 100., -100., 100., 100., -100., -100., -100.];
    // const position = [640., 480., 0., 480., 640., 0., 0., 0.];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

    // gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return positionBuffer;
}

function initBufferPath(gl)
{
    const pathBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pathBuffer);
    const position = [100., 100., -100., 100., 100., -100., -100., -100.];
    const float32array = new Float32Array(position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.DYNAMIC_DRAW);

    return pathBuffer;
}

function initBufferColor(gl)
{
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    const color = [ 
                    1., 1., 1., 1.,
                    1., 0., 0., 1.,
                    0., 1., 0., 1.,
                    0., 0., 1., 1.,
                ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    return colorBuffer;
}

export { initBuffers };