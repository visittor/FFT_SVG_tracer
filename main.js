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

    const svg = `<svg id="Layer_3" data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">

    <!-- <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle color-fg-default"> -->
    
        <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
    
    </svg>`;

    handleFiles(
              [new File([svg], "github.svg", {type:"image/svg+xml", size:923})], 
              polygonDrawer_svg, polygonDrawer_fft);

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
        drawOption.zoomFactor = 1.;
      }
    });

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (e.deltaY > 0)
      {
        drawOption.zoomFactor *= 0.9;
      }
      else
      {
        drawOption.zoomFactor /= 0.9;
      }
      drawOption.zoomFactor = Math.min(3., Math.max(0.1, drawOption.zoomFactor));
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