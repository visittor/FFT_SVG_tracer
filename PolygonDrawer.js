import { initShader } from "./shaderLoader.js";
class PolygonDrawer{

    #vsSource = `#version 300 es
    in vec4 aVertexPos;

    uniform mat4 uModelMat;
    uniform mat4 uViewMat;
    uniform mat4 uProjMat;
    uniform vec4 uColor;

    out vec4 v_color;
    void main()
    {
        gl_Position = uProjMat * uViewMat * uModelMat * aVertexPos;
        v_color = uColor;
    }
    `;

    #fsSource = `#version 300 es
    precision mediump float;
    in vec4 v_color;
    out vec4 FragColor;
    void main()
    {
        FragColor = v_color;
    }
    `;
    #programInfo = {};
    #positionBuffer = null;
    #points = [];
    #normal = [];

    constructor(gl)
    {
        this.gl = gl;
        const shaderProgram = initShader(gl, this.#vsSource, this.#fsSource);

        this.#programInfo = {
            program: shaderProgram,
            attribLocs: {
                vertex: gl.getAttribLocation(shaderProgram, "aVertexPos"),
            },
            uniformLocs: {
                color: gl.getUniformLocation(shaderProgram, "uColor"),
                modelMat: gl.getUniformLocation(shaderProgram, "uModelMat"),
                viewMat: gl.getUniformLocation(shaderProgram, "uViewMat"),
                projMat: gl.getUniformLocation(shaderProgram, "uProjMat"),
            },
        };

        this.#positionBuffer = gl.createBuffer();

    }

    setVertex( points )
    {
        this.#points = points;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.#points), this.gl.DYNAMIC_DRAW);
    }

    getVertex()
    {
        return this.#points;
    }

    appendVertex( points )
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#positionBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 4 * this.#points.length,new Float32Array(points));
        this.#points = this.#points.concat(this.#points, points);
    }

    draw(color, modelMat, viewMat, projMat)
    {
        const numComponent = 2;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#positionBuffer);
        this.gl.vertexAttribPointer(
            this.#programInfo.attribLocs.vertex,
            numComponent,
            type,
            normalize,
            stride,
            offset,
        )

        this.gl.useProgram(this.#programInfo.program);
        console.log(this.gl.getProgramParameter(this.#programInfo.program, this.gl.LINK_STATUS));
        this.gl.uniform4f(
            this.#programInfo.uniformLocs.color,
            color[0], color[1], color[2], color[3],
        );

        this.gl.uniformMatrix4fv(
            this.#programInfo.uniformLocs.modelMat,
            false,
            modelMat,
        );

        this.gl.uniformMatrix4fv(
            this.#programInfo.uniformLocs.viewMat,
            false,
            viewMat,
        );

        this.gl.uniformMatrix4fv(
            this.#programInfo.uniformLocs.projMat,
            false,
            projMat,
        );

        {
            const offset = 0;
            const count = this.#points.length / 2;
            this.gl.drawArrays(this.gl.LINE_LOOP, offset, count);
        }
    }

    drawInterval(color, modelMat, viewMat, projMat, start, end)
    {
        this.gl.useProgram(this.#programInfo.program);
        const numComponent = 2;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = start * 4 * 2; // 4 => size of float (4bytes), 2 => 2 component
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#positionBuffer);
        this.gl.vertexAttribPointer(
            this.#programInfo.attribLocs.vertex,
            numComponent,
            type,
            normalize,
            stride,
            offset,
        )

        this.gl.uniform4f(
            this.#programInfo.uniformLocs.color,
            color[0], color[1], color[2], color[3],
        );

        this.gl.uniformMatrix4fv(
            this.#programInfo.uniformLocs.modelMat,
            false,
            modelMat,
        );

        this.gl.uniformMatrix4fv(
            this.#programInfo.uniformLocs.viewMat,
            false,
            viewMat,
        );

        this.gl.uniformMatrix4fv(
            this.#programInfo.uniformLocs.projMat,
            false,
            projMat,
        );

        {
            const offset = 0;
            const count = this.#points.length / 2;
            this.gl.drawArrays(this.gl.LINE_STRIP, start, end - start);
        }
    }
}

export { PolygonDrawer };