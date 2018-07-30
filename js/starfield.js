
/*
 * setTimeout, setInterval replacements using requestAnimationFrame by Joe Lambert
 * https://gist.github.com/joelambert/1002116
 */


/**
 * Behaves the same as setInterval except uses requestAnimationFrame() 
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */
window.setRequestInterval = function(fn, delay) {
		
	var start = new Date().getTime(),
		handle = new Object();
		
	function loop() {
		var current = new Date().getTime(),
			delta = current - start;
			
		if(delta >= delay) {
			fn.call();
			start = new Date().getTime();
		}

		handle.value = requestAnimationFrame(loop);
	};
	
	handle.value = requestAnimationFrame(loop);
	return handle;
}

/**
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame()
 * @param {int|object} fn The callback function
 */
window.clearRequestInterval = function(handle) {
	if (handle) { 
		window.cancelAnimationFrame(handle.value);
	}
};

/**
 * Behaves the same as setTimeout except uses requestAnimationFrame()
 * @param {function} fn The callback function
 * @param {int} delay The delay in milliseconds
 */

window.setRequestTimeout = function(fn, delay) {		
	var start = new Date().getTime(),
		handle = new Object();
		
	function loop(){
		var current = new Date().getTime(),
			delta = current - start;
			
		delta >= delay ? fn.call() : handle.value = requestAnimationFrame(loop);
	};
	
	handle.value = requestAnimationFrame(loop);
	return handle;
};

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame()
 * @param {int|object} fn The callback function
 */
window.clearRequestTimeout = function(handle) {
	if (handle) {
		window.cancelAnimationFrame(handle.value);
	}
};

var preloader = new function () {
	var me = this,
		dataset = document.body.dataset,
		preloadImages = dataset.preloadImages.split(','),
		imageDir = dataset.imageDir,
		totalToLoad = preloadImages.length,
		images = [],
		numLoaded = 0,
		//el = document.getElementById('preloader'),
		i;
		
		function assetErrorHandler(e) {
			console.error(`Error: invalid image ${e.target.src}`);
			assetLoadHandler();
		}
		
		
		function assetLoadHandler() {
			requestAnimationFrame(imageLoadFrame);
		}
		
		function imageLoadFrame() {
			numLoaded ++;
			if (numLoaded == images.length) {
				//el.className = 'hidden';
				me.callback();
			}
			
			//el.value = numLoaded;
			//el.innerHTML = `<strong>Loaded ${numLoaded * 100 / images.length}%.`
		}
		
		
		
		me.init = function(callback) {
			me.callback = callback;
			for (i = 0; i < preloadImages.length; i++) {
				var image = new Image();
				image.onload = assetLoadHandler;
				image.onerror = assetErrorHandler;
				image.src = `${imageDir}/${preloadImages[i]}.svgz`;
				images.push(image);
			}
			
		}
}



const starfield = new function () {

    var MAX_DEPTH = 32;
    var kNumerator = MAX_DEPTH * 4;

    var canvas, ctx, halfWidth, halfHeight;
    var stars = new Array(128);
    var rangeMax = 25;
    var speedFactor = 0.02;  // lower makes this slower.
    var els = {
        'enterpriseFront': document.getElementById('enterprise-front'),
        'enterpriseBack': document.getElementById('enterprise-back'),
        'enterpriseSide': document.getElementById('enterprise-side'),
        'planet': document.getElementById('planet'),
        'planetSide': document.getElementById('planet-side')
    }


    this.init = () => {
        canvas = document.getElementById("tutorial");
        halfWidth = canvas.width / 2;
        halfHeight = canvas.height / 2;
        if (canvas && canvas.getContext) {
            ctx = canvas.getContext("2d");
            this.resetStars();
            setRequestInterval(loop, 33);
        }
        //window.addEventListener('click', this.resetStars);

        els.enterpriseFront.addEventListener('animationend', flyTowardPlanetScene);
        els.enterpriseBack.addEventListener('animationend', flySideOfPlanet);
        els.enterpriseSide.addEventListener('animationend', lastAnimation);

        els.enterpriseFront.classList.add('animate');
        //lastAnimation();
    }
    
    /* Returns a random number in the range [minVal,maxVal] */
    function randomRange(minVal, maxVal) {
        return Math.floor(Math.random() * (maxVal - minVal - 1)) + minVal;
    }
    
    this.resetStars = (() => {
        for (var i = 0; i < stars.length; i++) {
            stars[i] = {
                x: randomRange(-rangeMax, rangeMax),
                y: randomRange(-rangeMax, rangeMax),
                z: randomRange(1, MAX_DEPTH)
            }
        }
    });
    
    function loop () {
    
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        for (var i = 0; i < stars.length; i++) {
            stars[i].z -= speedFactor;
    
            if (stars[i].z <= 0) {
                stars[i].x = randomRange(-rangeMax, rangeMax);
                stars[i].y = randomRange(-rangeMax, rangeMax);
                stars[i].z = MAX_DEPTH;
            }
    
            var k = kNumerator / stars[i].z;
            var px = stars[i].x * k + halfWidth;
            var py = stars[i].y * k + halfHeight;
    
            if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
                var size = (1 - stars[i].z / 32.0) * 5;
                var shade = parseInt((1 - stars[i].z / 32.0) * 255);
    
                ctx.beginPath();
                ctx.fillStyle = "rgb(" + shade + "," + shade + "," + shade + ")";
                ctx.arc(px, py, size / 2, 0, 2 * Math.PI, false);
                ctx.fill();
                // ctx.fillRect(px,py,size,size);
            }
        }
    }

    const flyTowardPlanetScene = (e) => {
        //alert(e.animationName)
        if (true || e.animationName === 'enterprise-to-planet') {
            els.enterpriseFront.classList.remove('animate');
            els.enterpriseBack.classList.add('animate');
            els.planet.classList.add('animate');
            this.resetStars();
        }
    }

    const flySideOfPlanet = (e) => {
        
        els.enterpriseBack.classList.remove('animate');
        els.planet.classList.remove('animate');
        els.planetSide.classList.add('animate');
        els.enterpriseSide.classList.add('animate');
        this.resetStars();
    }

    const lastAnimation = (e) => {
        els.planetSide.classList.remove('animate');
        els.enterpriseSide.classList.remove('animate');
        this.resetStars();
        return;
        els.enterpriseFront.classList.add('fast-fly');
    }
};



preloader.init(starfield.init());