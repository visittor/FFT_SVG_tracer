import { fft } from "./FFT.js";
import { sumFT } from "./FFT.js";

const NUM_POINTS=512;
var points = [];
var ft = null;

function handleFiles(files, polygonDrawer_svg, polygonDrawer_fft)
{
    points = [];
    var reader = new FileReader();
    reader.onload = function(e){
        var svgData = e.target.result;
        var parser = new DOMParser();
        var doc = parser.parseFromString(svgData, "image/svg+xml");
        var pathTags = doc.getElementsByTagName("path");
        var rectTags = doc.getElementsByTagName("rect");

        const path_arr = Array.from(pathTags);
        const rect_arr = Array.from(rectTags);

        const all_path = path_arr.concat(rect_arr);

        console.log(all_path);
        const numpoints_per_path = Math.floor(NUM_POINTS / all_path.length);
        for(var i = 0; i < all_path.length; i++)
        {
            const lenght = all_path[i].getTotalLength();
            for(var j = 0; j < numpoints_per_path; j++)
            {
                var pt = all_path[i].getPointAtLength(j * lenght / (numpoints_per_path - 1));
                // points.push([pt.x, pt.y]);
                points.push(pt.x * 1);
                points.push(pt.y * 1);
            }
        }
        if(points.length < NUM_POINTS * 2)
        {
            const miss = NUM_POINTS - points.length / 2;
            const lastX = points[points.length - 2]
            const lastY = points[points.length - 1]
            for(var i = 0; i < miss; i++)
            {
                points.push(lastX);
                points.push(lastY);
            }
        }

        zeroMean(points);
        scale(points);
        polygonDrawer_svg.setVertex(points);
        // updatePathBuffer(gl, buffers);
        ft = fft(points);
        var points_ft = [];
        for (var i = 0; i < ft.real.length; i++)
        {
            const pt = sumFT(ft, i / ft.real.length, 126);
            points_ft.push(pt[pt.length-1].real);
            points_ft.push(pt[pt.length-1].imag);
        }
        polygonDrawer_fft.setVertex(points_ft);
    }
    reader.readAsText(files[0]);
}

function zeroMean(points)
{
    const len = points.length / 2;
    var meanX = 0; var meanY = 0;

    for( var i = 0; i < len; i++ )
    {
        meanX += points[2*i];
        meanY += points[2*i + 1];
    }

    meanX /= len;
    meanY /= len;


    for( var i = 0; i < len; i++ )
    {
        points[2*i] -= meanX;
        points[2*i+1] -= meanY;
        points[2*i+1] *= -1;
    }
}

function scale(points)
{
    const Kx = points[0];
    const Ky = points[1];

    var maxX = 0.0; var maxY = 0.0;
    for(var i = 0; i < points.length / 2; i++)
    {
        var diffX = Math.abs(points[2*i]);
        if (diffX > maxX)
        {
            maxX = diffX;
        }

        var diffY = Math.abs(points[2*i + 1]);
        if (diffY > maxY)
        {
            maxY = diffY;
        }
    }

    const max = Math.max(maxX, maxY);

    for(var i = 0; i < points.length / 2; i++)
    {
        points[2*i] *= 300 / max;
        points[2*i + 1] *= 300 / max;
    }
}

function updatePathBuffer(gl, buffers)
{
    // gl.deleteBuffer(buffers.path);
    // buffers.path = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.path);

    var float32array = new Float32Array(points.length);
    for(var i = 0; i < points.length; i++)
    {
        float32array[i] = points[i];
    }
    gl.bufferData(gl.ARRAY_BUFFER, float32array, gl.DYNAMIC_DRAW);
}

function getPoints()
{
    return points;
}

function getFT()
{
    return ft;
}

export {handleFiles};
export {getPoints};
export {getFT};