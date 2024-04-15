import { drawCircle } from "./circle.js";
import { drawLine } from "./line.js";
import { getPoints } from "./callback.js"
import { getFT } from "./callback.js";
import { sumFT } from "./FFT.js";
import { PolygonDrawer } from "./PolygonDrawer.js"

var polygonDrawer_fft = null

function draw(gl, polygonDrawer_svg, polygonDrawer_fft, rotateAng, drawOption)
{

    var ft = getFT();
    var pos = null;
    var N = 0;
    var index = 0;
    if(ft !== null)
    {
        const len = ft.real.length;
        index = Math.floor(rotateAng * len / 30) % len;
        const t = index / len;
        pos = sumFT(ft, t, 126);
    }

    
    gl.clearColor(0., 0., 0., 1.);
    gl.clearDepth(1.);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);

    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // create proj mat (ortho)
    const projMat = mat4.create();
    const width = gl.canvas.clientWidth;
    const height = gl.canvas.clientHeight;
    const left = (-width / 2) * drawOption.zoomFactor;
    const right = (width / 2) * drawOption.zoomFactor;
    const top = (-height / 2) * drawOption.zoomFactor;
    const bot = ( height / 2) * drawOption.zoomFactor;
    // mat4.ortho(projMat, -width / 2, width / 2, -height / 2, height / 2, 0.01, 100);
    mat4.ortho(projMat, left, right, top, bot, 0.01, 100);

    // create mv mat
    const viewMat = mat4.create();
    mat4.translate( viewMat, viewMat, [0., 0., -6.] );

    if(drawOption.followTip && ft !== null)
    {
        const N = 
        mat4.translate(viewMat, viewMat, [-pos[pos.length-100].real, -pos[pos.length-100].imag, 0]);
    }

    const modelMat = mat4.create();
    // mat4.translate(modelMat, modelMat, [gl.canvas.clientWidth/2, gl.canvas.clientHeight/2, 0]);
    // mat4.rotate(modelMat, modelMat, rotateAng, [0, 0, 1]);

    const modelViewMat = mat4.create();
    mat4.mul(modelViewMat, viewMat, modelMat);

    const viewProjMat = mat4.create();
    mat4.mul(viewProjMat, projMat, viewMat);

    polygonDrawer_svg.draw([1,1,0,0.3], modelMat, viewMat, projMat);

    const modelMat_smallCircle = mat4.create();
    if(ft !== null)
    {
        const N = pos.length;
        mat4.translate(modelMat_smallCircle, modelMat_smallCircle, [pos[N-1].real, pos[N-1].imag, 0]);
        
        polygonDrawer_fft.drawInterval([1,1,0,1], modelMat, viewMat, projMat, 0, index);

        for(var i = 1; i < N; i++)
        {
            const circleR = Math.max(0.2, 2. - 10.*i/N);
            const lineWidth = circleR / 4;
            
            drawLine(gl, pos[i].real, pos[i].imag, pos[i-1].real, pos[i-1].imag, [1,1,1,1], lineWidth, viewProjMat);

            var mat = mat4.create();
            mat4.translate(mat, mat, [pos[i].real, pos[i].imag, 0]);
            mat4.mul(mat, viewMat, mat);

            drawCircle(gl, circleR, [1., 1., 1., 1], mat, projMat, true);

            mat = mat4.create();
            mat4.translate(mat, mat, [pos[i-1].real, pos[i-1].imag, 0]);
            mat4.mul(mat, viewMat, mat);
            const diffX = pos[i].real - pos[i-1].real;
            const diffY = pos[i].imag - pos[i-1].imag;
            const r = Math.sqrt(diffX*diffX + diffY*diffY);
            drawCircle(gl, r, [1., 1., 1., 0.3], mat, projMat, false);
        }
    }
    const modelViewMat_smallCircle = mat4.create();
    mat4.mul(modelViewMat_smallCircle, viewMat, modelMat_smallCircle);
    // drawCircle(gl, 7., [1., 0., 0., 1.], modelViewMat_smallCircle, projMat, true);

}

export{draw};