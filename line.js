import { initShader } from "./shaderLoader.js";

const vsSource = `#version 300 es
in vec2 aPt;

uniform vec4 uColor;
uniform float uLineWidth;
uniform mat4 uViewProjMat;
uniform vec4 uNormal;

out vec4 v_color;

void main()
{
    gl_VertexID % 2;
    float sign;
    if(gl_VertexID%2 == 0)
    {
        sign = 1.;
    }
    else
    {
        sign = -1.;
    }
    vec4 pt = vec4(aPt.x, aPt.y, 1, 1) + sign*uLineWidth*uNormal;
    // vec4 pos = uViewProjMat * vec4(aPt.x, aPt.y, 1, 1);
    vec4 pos = uViewProjMat * pt;
    gl_Position = pos;

    v_color = uColor;
}
`;

const fsSource = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 FragColor;

void main()
{
    FragColor = v_color;
}
`;

var programInfo = null;
const ids = new Float32Array();
var ptBuffer = null;

function drawLine(gl, pt1x, pt1y, pt2x, pt2y, color, lineWidth, viewProjMat)
{
    if (programInfo === null)
    {
        const shaderProgram = initShader(gl, vsSource, fsSource);
        programInfo = {
            program: shaderProgram,
            attribLocs: {
                pt: gl.getAttribLocation(shaderProgram, "aPt"),
            },
            uniformLocs: {
                color: gl.getUniformLocation(shaderProgram, "uColor"),
                lineWidth: gl.getUniformLocation(shaderProgram, "uLineWidth"),
                viewProjMat: gl.getUniformLocation(shaderProgram, "uViewProjMat"),
                normal: gl.getUniformLocation(shaderProgram, "uNormal"),
            }
        };
    }

    if (ptBuffer === null)
    {
        ptBuffer = gl.createBuffer();
    }
    const points = [pt1x, pt1y, pt1x, pt1y, pt2x, pt2y, pt2x, pt2y];
    // const points = [pt1x, pt1y, pt2x, pt2y];
    gl.bindBuffer(gl.ARRAY_BUFFER, ptBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.DYNAMIC_DRAW);

    gl.useProgram(programInfo.program);

    const numComponent = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, ptBuffer);
    gl.vertexAttribPointer(
        programInfo.attribLocs.pt,
        numComponent,
        type,
        normalize,
        stride,
        offset
    );

    gl.uniform4f(
        programInfo.uniformLocs.color,
        color[0], color[1], color[2], color[3],
    );

    gl.uniform1f(
        programInfo.uniformLocs.lineWidth,
        lineWidth,
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocs.viewProjMat,
        false,
        viewProjMat,
    );

    const dx = pt1x - pt2x;
    const dy = pt1y - pt2y;
    const norm = Math.sqrt(dx*dx + dy*dy);
    const normal = [dy / norm, -dx / norm];

    gl.uniform4f(
        programInfo.uniformLocs.normal,
        normal[0], normal[1], 0., 0.,
    );

    {
        const offset = 0;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, 4);
    }
}

export { drawLine };