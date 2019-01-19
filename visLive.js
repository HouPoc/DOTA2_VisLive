function main(){
    const canvas = document.getElementById('mainDisplay');
    const mainWindow = canvas.getContext('experimental-webgl');
    if (!mainWindow) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }
    const vertexShader = fetchFile('shaders/vertexShader.vs', false);
    const fragmentShader = fetchFile('shaders/fragmentShader.fs', false);
    const shaderProgram = initShaderProgram(mainWindow, vertexShader, fragmentShader);
    
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
          textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
          uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };
    
    const buffers = initBuffers(gl);
    /**************Calling Backend for hero images and icons****************/
    
    /***********************************************************************/
    const textureIcons = [];
    for (var key in returnData){
        const textureIcon = loadTexture(gl, returnData[key]["icon"]);
        textureIcons.push(textureIcon);
    }
    var then = 0;
    function render(now){
        now *=0.001;
        const deltaTime = now - then;
        then = now;
        
        drawScene(mainWindow, programInfo, buffers, textureIcons, deltaTime);
        
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}




  
  
