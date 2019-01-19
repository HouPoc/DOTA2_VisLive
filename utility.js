/*
    This function is used to check if the given number is power of 2
    
    @param      Int number
    @return     True or False
*/

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
  

/*
    This function is used to load text file through ajax request
    
    @param      Filename
    @param      Cache Flag
    @return     The content of the text file 
*/
  
function fetchFile(url, cache)
{
    var text = $.ajax({
        url:   url,
        async: false,
        dataType: "text",
        mimeType: "text/plain",
        cache: cache,
    }).responseText;
    return text;
}

/*
    This function is used to load a single texture to WebGL texture unit.
    Code Reference: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL  

    @param      WebGL canvas pointer
    @param      url to the source texture file
    @return     Allocated WebGL texture unit
*/


function loadTexture(gl, url){
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const level = 0;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 0, 100]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);
    
    const image = new Image();
    image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {   
           gl.generateMipmap(gl.TEXTURE_2D);
        } 
        else {
     
           gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
           gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
           gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    
    };
    image.src = url;

    return texture;
}


function initBuffers(gl){
    const positionBuffer = gl.createBuffer();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    const positions = 
        [-1.0, -1.0,  1.0,
          1.0, -1.0,  1.0,
          1.0,  1.0,  1.0,
         -1.0,  1.0,  1.0];
         
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    const textureCoordinates = 
        [0.0,  0.0,
         1.0,  0.0,
         1.0,  1.0,
         0.0,  1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    
    const indices = [ 0,  1,  2, 0,  2,  3];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
    };
    
}

function drawScene(gl, programInfo, buffers, texture, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);
                   
  const modelViewMatrix = mat4.create();
  
  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              0,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              0,// amount to rotate in radians
              [0, 1, 0]);       // axis to rotate around (X)
              
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }
  
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.textureCoord);
  }
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
  gl.useProgram(programInfo.program);
  
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
      
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);
      
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
  
  {
    const vertexCount = 4;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
  
  
}  



























