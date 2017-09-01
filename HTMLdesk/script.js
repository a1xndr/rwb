//
// Workspace Widget Handling	
//
var displayMode= "focused"
var currentWorkspace = 4;
	
function changeWorkspace(wsp){
	document.getElementById("workspace"+currentWorkspace).className = "inactive_workspace";	
	document.getElementById("workspace"+wsp).className = "active_workspace";
	currentWorkspace=wsp;
}
//
// Mode Changing  
//




function switchDisplayMode(mode) {
	displayMode=mode;

	if(displayMode=="unfocused"){
		$('#left-panel').fadeOut({duration:100});
		$('#center-panel').fadeOut({duration:100});
		$('#right-panel').fadeOut({duration:100});
		window.setTimeout(function(){$('#icosahedron-unfocused').fadeIn({duration:100});},100);
	};
	if(displayMode=="focused"){
		$('#icosahedron-unfocused').hide();
		$('#left-panel').fadeIn({duration:100});
		$('#center-panel').fadeIn({duration:100});
		$('#right-panel').fadeIn({duration:100});

	};
}

//
// Clock Widget
//
function startTime() {
	    	var today=new Date();
	    	var h=today.getHours();
	    	var m=today.getMinutes();
	    	var s=today.getSeconds();
	    	m = checkTime(m);
	    	s = checkTime(s);
	    	document.getElementById('time').innerHTML = h+":"+m+":"+s;
	    	var t = setTimeout(function(){startTime()},500);
	}
function checkTime(i) {
	if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}
//
// Icosahedron
//
function icosahedron() {
	var mouse = {x: 0, y: 0};
	var newmouse = {x: 0, y: 0};	
	document.addEventListener('mousemove', function(e){ 
	if(displayMode!="focused")return;
		newmouse.x = mouse.x - e.clientX;
		newmouse.y = mouse.y - e.clientY;
		mouse.x = e.clientX;
		mouse.y = e.clientY; 
	}, false);
	// revolutions per second
	var angularSpeed = 0.1; 
	var lastTime = 0;

	// this function is executed on each animation frame
	function animate(){
	if(displayMode=="focused"){
	// update
	var time = (new Date()).getTime();
	var timeDiff = time - lastTime;
	var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
	icosahedron.rotation.y += angleChange+ newmouse.y/400;
	icosahedronframe.rotation.y += angleChange+ newmouse.y/400;
	icosahedron.rotation.z += angleChange + newmouse.x/400;
	icosahedronframe.rotation.z += angleChange + newmouse.x/400;
	newmouse={x:0, y:0};
	lastTime = time;

	// render
	renderer.render(scene, camera);
	}
	// request new frame
	setTimeout( function() {
		requestAnimationFrame(function(){
			animate();
	});
	}, 1000/30);
	}

	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(document.getElementById("icosahedron").offsetWidth, document.getElementById("icosahedron").offsetHeight);
	document.getElementById("icosahedron").appendChild(renderer.domElement);
	document.getElementById("icosahedron").appendChild(renderer.domElement);

	// camera
	var camera = new THREE.PerspectiveCamera(45, document.getElementById("icosahedron").offsetWidth/document.getElementById("icosahedron").offsetHeight, 1, 1000);
	camera.position.z = 650;
	//camera.position.x=300;
	// scene
	var scene = new THREE.Scene();

	var icosahedrongeometry = new THREE.IcosahedronGeometry(200,1);
	for ( var i = 0; i < icosahedrongeometry.faces.length; i ++ ) {
	    //icosahedrongeometry.faces[i].color.setRGB(81/255,(148+Math.random()*30)/255,107/255);
	    icosahedrongeometry.faces[i].color.set(0xc0c5ce);
	}
	//material = new THREE.MeshNormalMaterial();
	var mat2 = new THREE.MeshPhongMaterial({
	  color      :  new THREE.Color(0xc0c5ce),
	  emissive   :  new THREE.Color(0xc0c5ce),
	  specular   :  new THREE.Color("rgb(20,20,20)"),
	  shininess  :  3,
	  shading    :  THREE.FlatShading,
	  transparent: 1,
	  opacity    : 1,
          wireframe:true
	});	
        var outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x2b303b,wireframe   : true , wireframeLinewidth: 0} );
	var icosahedron = new THREE.Mesh(icosahedrongeometry, mat2);
	var icosahedronframe = new THREE.Mesh(icosahedrongeometry, outlineMaterial);
		
	scene.add(icosahedron);
//	scene.add(icosahedronframe);

	var L1 = new THREE.PointLight( 0x888899, 1);
	L1.position.z = 800;
	L1.position.y = 500;
	L1.position.x = 300;
	scene.add(L1);

	// start animation
	animate();
}

function icosahedronUnfocused() {
	// revolutions per second
	var angularSpeed = 0.009; 
	var lastTime = 0;

	// this function is executed on each animation frame
	function animate(){
	if(displayMode=="unfocused"){
	// update
	var time = (new Date()).getTime();
	var timeDiff = time - lastTime;
	var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
	icosahedron.rotation.y += angleChange;
	icosahedron.rotation.z += angleChange;
	lastTime = time;

	// render
	renderer.render(scene, camera);
	}
	// request new frame
	setTimeout( function() {
		requestAnimationFrame(function(){
			animate();
	});
	}, 1000/30);
	}

	// renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(document.getElementById("icosahedron-unfocused").offsetWidth, document.getElementById("icosahedron-unfocused").offsetHeight);
	document.getElementById("icosahedron-unfocused").appendChild(renderer.domElement);
	document.getElementById("icosahedron-unfocused").appendChild(renderer.domElement);

	// camera
	var camera = new THREE.PerspectiveCamera(45, document.getElementById("icosahedron-unfocused").offsetWidth/document.getElementById("icosahedron-unfocused").offsetHeight, 1, 1000);
	camera.position.z = 650;
	camera.position.x=-100;
	// scene
	var scene = new THREE.Scene();
		
	var mat2 = new THREE.MeshPhongMaterial({
	  color      :  new THREE.Color(0xFFFFFF),
	  emissive   :  new THREE.Color(0xFFFFFF),
	  specular   :  new THREE.Color(0xFFFFFF),
	  shininess  :  10,
	  shading    :  THREE.FlatShading,
	  transparent: 1,
	  opacity    : 1,
          wireframe:true
	});	
	var icosahedron = new THREE.Mesh(new THREE.OctahedronGeometry(200,1), mat2);
	scene.add(icosahedron);

	// start animation
	animate();
}

//document ready func
$(document).ready(function (){
	$('#lastFmWidget').lastfmNowPlaying({
	    apiKey: '0d37fd708283ae08c557a9b93693c784',
	    members: ['theverm1n']
	});
	icosahedron();
	$('#icosahedron-unfocused').show();
	icosahedronUnfocused();
	$('#icosahedron-unfocused').hide();
	startTime();
	$('#rss1').rssfeed(
		'http://habrahabr.ru/rss/feed/posts/418c53389d022a1f99fb26885edbc941',
		{limit: 8 ,header: false, media:false});
	$('#rss2').rssfeed(
		'http://lenta.ru/rss/last24', 
			{limit: 8 ,header: false, media:false});
	
	setTimeout(function () {
		document.getElementById('newstickermaraquee').textContent = 
			document.getElementById('rss2').getElementsByTagName('p')[0].textContent.concat(
			document.getElementById('rss2').getElementsByTagName('p')[1].textContent);

		$(" body marquee").marquee();			
	},1000);	
});


