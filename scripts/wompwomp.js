import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";

const canvas = document.querySelector("#canvasbg")
const gl = canvas.getContext("webgl")

let programInfo;
let buffers;

var timeUniform;
var sizeUniform;
var scrollUniform;

function main(){
    

    const vsSource = `
        precision highp float;
        attribute vec4 aVertexPosition;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        void main() {
            gl_Position = aVertexPosition; // uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `;

    /* 
        I call this piece of art "Fucking Around and Finding Out", or a more family friendly PG name could be "Finding Out".
        It perfectly represents me as a developer because my favourite thing to do is screw around and accidentally make cool things.
        If you want this in your museum for some reason, DM me on Twitter and I'll let you show it there for 9 vigintillion dollars. I like money.
    */
    const fsSource = `
        precision highp float;

        #define PI 3.14159265

        vec3 bruh(vec3 c1, vec3 c2, float x){
            float fac = 4.;
            if (x < 0.5){
                return mix(c1, c2, x * fac);
            }
            return mix(c1, c2, (1. - x) * fac);
        }

        const float interval = (PI / 4.);
        const float power = 4.;
        const float spd = 1.;

        uniform vec2 vpSize;
        uniform float time;
        uniform float scroll;

        void main() {
            vec3 c1 = vec3(0.34509803921, 0.047058823529411764, 0.12156862745098039);
            vec3 c2 = vec3(0.6470588235294118, 0.10980392156862745, 0.18823529411764706);

            vec2 uv = gl_FragCoord.xy / vpSize; // 
            vec3 col = vec3(0., 0., 0.);

            float realtimex = spd * time;
            float realtimey = sin(realtimex) * 0.5;

            for (float i = 0.; i < power; i++){
                float edge = uv.x + sin(((uv.y - scroll * 0.0001)* 4. + realtimex) * PI + interval * i);
                col += bruh(c1, c2, edge);
            }

            for (float i = 0.; i < power; i++){
                float edge = uv.y + sin((uv.x * 4. + realtimey) * PI + interval * i);
                col += bruh(c1, c2, edge);
            }

            /*if (col.r < 0.) col.r = 0.;
            if (col.g < 0.) col.g = 0.;
            if (col.b < 0.) col.b = 0.;*/
            //col += c1 / 2.;

            gl_FragColor = vec4(col, 1.0);
        }
    `;

    const shaderProgram = initShaderProgram(vsSource, fsSource);


    programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        }
    };

    timeUniform = gl.getUniformLocation(shaderProgram, "time");
    sizeUniform = gl.getUniformLocation(shaderProgram, "vpSize");
    scrollUniform = gl.getUniformLocation(shaderProgram, "scroll");
   
    
    buffers = initBuffers(gl);

    // Draw the scene
    drawScene(gl, programInfo, buffers);
    gl.uniform2f(sizeUniform, canvas.width, canvas.height);
   
    requestAnimationFrame(update);
}
let time = 0;
function update(timeStamp){
    gl.uniform1f(timeUniform, time);
    gl.uniform1f(scrollUniform, window.scrollY);
    //gl.uniform2f(sizeUniform, window.innerWidth, window.innerHeight);
    //console.log(window.innerWidth);
    time += 0.01; // timeStamp * 0.001;

    drawScene(gl, programInfo, buffers)
    //console.log(time);

    requestAnimationFrame(update);
}
//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    // Create the shader program
  
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    // If creating the shader program failed, alert
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          shaderProgram,
        )}`,
      );
      return null;
    }
  
    return shaderProgram;
  }
  
  //
  // creates a shader of the given type, uploads the source and
  // compiles it.
  //
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
  
    // Send the source to the shader object
  
    gl.shaderSource(shader, source);
  
    // Compile the shader program
  
    gl.compileShader(shader);
  
    // See if it compiled successfully
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
      );
      gl.deleteShader(shader);
      return null;
    }
  
    return shader;
  }
  

main();