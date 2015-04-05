module.exports = {
	basic: {
		attributes: [
			{name: 'aVertexPosition', type: 'v3'},
			{name: 'aVertexColor', type: 'v4'}
		],
		uniforms: [
			{name: 'uTransformationMatrix', type: 'm4'},
			{name: 'uPerspectiveMatrix', type: 'm4'}
		],
		vertexShader: 
			"attribute mediump vec3 aVertexPosition; " + 
			"attribute mediump vec4 aVertexColor; " + 
			
			"uniform mediump mat4 uTransformationMatrix; " + 
			"uniform mediump mat4 uPerspectiveMatrix; " + 
			
			"varying mediump vec4 vVertexColor; " + 
			
			"void main(void){ " + 
				"gl_Position = uPerspectiveMatrix * uTransformationMatrix * vec4(aVertexPosition, 1.0); " + 
				"vVertexColor = aVertexColor; " + 
			"} " ,
		fragmentShader: 
			"varying mediump vec4 vVertexColor; " + 
			
			"void main(void){ " +
				"gl_FragColor = vVertexColor;" +
			"}"
	}
};
