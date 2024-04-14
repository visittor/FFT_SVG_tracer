import { initShader } from "./shaderLoader.js";

const vsSource = `
attribute float aId;

uniform vec4 uColor;
uniform float uNumVertices;
uniform float uRadius;

uniform mat4 uModelViewMat;
uniform mat4 uProjMat;
varying vec4 v_color;

#define PI radians(180.0)

void main()
{
    if (aId < 0.0)
    {
        gl_Position = uProjMat * uModelViewMat * vec4(0,0,1,1);
    }
    else
    {
        float t = 2. * PI * (aId / uNumVertices);
        vec4 pos = vec4(cos(t) * uRadius, sin(t) * uRadius, 1, 1);
        gl_Position = uProjMat * uModelViewMat * pos;
    }
    v_color = uColor;
}
`;

const fsSource = `
precision mediump float;
varying vec4 v_color;

void main()
{
    gl_FragColor = v_color;
}
`;

var programInfo = null;

var NUM_POINTS = 100;
const vertexIds = new Float32Array(NUM_POINTS + 2);
vertexIds.forEach((v, i) => { vertexIds[i] = i - 1; });
var idBuffer = null;

function drawCircle(gl, radius, color, modelViewMat, projMat, fill)
{

    if (programInfo === null)
    {
        const shaderProgram = initShader(gl, vsSource, fsSource);
        programInfo = {
            program: shaderProgram,
            attribLocs: {
                id: gl.getAttribLocation(shaderProgram, "aId"),
            },
            uniformLocs: {
                color: gl.getUniformLocation(shaderProgram, "uColor"),
                numVertices: gl.getUniformLocation(shaderProgram, "uNumVertices"),
                radius: gl.getUniformLocation(shaderProgram, "uRadius"),
                modelViewMat: gl.getUniformLocation(shaderProgram, "uModelViewMat"),
                projMat: gl.getUniformLocation(shaderProgram, "uProjMat"),
            }
        };
    }

    if (idBuffer === null)
    {
        idBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexIds, gl.STATIC_DRAW);
    }

    gl.useProgram(programInfo.program);

    const numComponent = 1;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
    gl.vertexAttribPointer(
        programInfo.attribLocs.id,
        numComponent,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocs.id);

    gl.uniformMatrix4fv(
        programInfo.uniformLocs.modelViewMat,
        false,
        modelViewMat,
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocs.projMat,
        false,
        projMat,
    );

    gl.uniform1f(
        programInfo.uniformLocs.numVertices,
        100.,
    );

    gl.uniform1f(
        programInfo.uniformLocs.radius,
        radius,
    );

    gl.uniform4f(
        programInfo.uniformLocs.color,
        color[0], color[1], color[2], color[3],
    );

    if(fill)
    {
        const offset = 0;
        gl.drawArrays(gl.TRIANGLE_FAN, offset, vertexIds.length);
    }
    else
    {
        const offset = 1;
        gl.drawArrays(gl.LINE_LOOP, offset, vertexIds.length - 1);
    }

}

export{drawCircle};