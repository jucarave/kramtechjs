module.exports = {
	basic: {
		attributes: [
			{name: 'aVertexPosition', type: 'v3'},
			{name: 'aVertexColor', type: 'v4'},
			{name: 'aTextureCoord', type: 'v2'}
		],
		uniforms: [
			{name: 'uTransformationMatrix', type: 'm4'},
			{name: 'uPerspectiveMatrix', type: 'm4'},
			{name: 'uMaterialColor', type: 'v4'},
			{name: 'uTextureSampler', type: 'tex'},
			{name: 'uHasTexture', type: 'bool'}
		],
		vertexShader: 
			"attribute mediump vec3 aVertexPosition; " +
			"attribute mediump vec2 aTextureCoord; " +  
			"attribute mediump vec4 aVertexColor; " + 
			
			"uniform mediump mat4 uTransformationMatrix; " + 
			"uniform mediump mat4 uPerspectiveMatrix; " +
			"uniform mediump vec4 uMaterialColor; " +  
			
			"varying mediump vec4 vVertexColor; " +
			"varying mediump vec2 vTextureCoord;" +  
			
			"void main(void){ " + 
				"gl_Position = uPerspectiveMatrix * uTransformationMatrix * vec4(aVertexPosition, 1.0); " +
				"vVertexColor = aVertexColor * uMaterialColor; " +
				"vTextureCoord = aTextureCoord; " +  
			"} " ,
		fragmentShader: 
			"uniform sampler2D uTextureSampler; " +
			"uniform int uHasTexture; " +
			
			"varying mediump vec2 vTextureCoord; " + 
			"varying mediump vec4 vVertexColor; " + 
			
			"void main(void){ " +
				"mediump vec4 color = vVertexColor; " + 
				"if (uHasTexture == 1){ " + 
					"mediump vec4 texColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t)); " +
					"color *= texColor; " +
				"} " + 
				
				"gl_FragColor = color;" + 
			"}"
	}
};
