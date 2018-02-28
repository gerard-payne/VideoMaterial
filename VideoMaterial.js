var VideoMaterial = function(oSettings) {
	THREE.ShaderMaterial.call(this);
	
	var video = document.createElement('video');
		video.loop = true;

	this.setVideo = function(sUrl) {
        if(video.src.indexOf(sUrl) === -1 && video.readyState === video.HAVE_NOTHING) {
        	if(!!window.URL) {
                video.src = sUrl;
                video.play();
            } else {
                video.srcObject = sUrl;
                video.onloadedmetadata = function() {
                    video.play();
                };
            }
        }
	};

	var videoImage = document.createElement('canvas');
		videoImage.width = video.width;
		videoImage.height = video.height;

	var videoImageContext = videoImage.getContext('2d'),
		keyColorObject = new THREE.Color(oSettings.chromaKey);

	var videoTexture = new THREE.Texture(video);
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;

	this.update = function() {
		if(video.readyState === video.HAVE_ENOUGH_DATA) {
			videoImageContext.drawImage(video, 0, 0);
			videoTexture.needsUpdate = true;
		}
	};

	this.setValues({
		uniforms: {
			texture: {
				type: "t",
				value: videoTexture
			},
			color: {
				type: "c",
				value: keyColorObject
			}
		},
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
		transparent: true
	});
};

VideoMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
