import { draw } from "./draw.js";
import { handleFiles } from "./callback.js";
import { PolygonDrawer } from "./PolygonDrawer.js"
main();

function main() 
{
    const canvas = document.getElementById("glcanvas");
    if (canvas === null)
    {
        alert("WTF");
    }
    // Initialize the GL context
    const gl = canvas.getContext("webgl2");
  
    // Only continue if WebGL is available and working
    if (gl === null) {
        alert(
          "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
      return;
    }

    const polygonDrawer_svg = new PolygonDrawer(gl);
    polygonDrawer_svg.setVertex([100., 100., -100., 100., 100., -100., -100., -100.])

    const polygonDrawer_fft = new PolygonDrawer(gl);
    polygonDrawer_fft.setVertex([100., 100., -100., 100., 100., -100., -100., -100.])

    const drawOption = { 
                        followTip : false,
                        zoomFactor : 1.,
                      };

    let then = 0;
    let rotation = 0.0;
    let deltaT = 0;

    // handle callback
    var file_input = document.getElementById("file-input");
    file_input.addEventListener( "change", (e) => {
      handleFiles(e.target.files, polygonDrawer_svg, polygonDrawer_fft);
      // updatePathBuffer(gl, buffers);
    } );

    var follow_checkbox = document.getElementById("follow");
    follow_checkbox.addEventListener("change", () => {
      if(follow_checkbox.checked)
      {
        drawOption.followTip = true;
      }
      else
      {
        drawOption.followTip = false;
      }
    });

    canvas.addEventListener("wheel", (e) => {
      if (e.deltaY > 0)
      {
        drawOption.zoomFactor *= 0.9;
      }
      else
      {
        drawOption.zoomFactor /= 0.9;
      }
      drawOption.zoomFactor = Math.min(3., Math.max(0.25, drawOption.zoomFactor));
      console.log(drawOption.zoomFactor);
    });

    function render(now)
    {
      now *= 0.001; // to second
      deltaT = now - then;
      then = now;

      draw(gl, polygonDrawer_svg, polygonDrawer_fft, rotation, drawOption);
      rotation += deltaT;
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

  }