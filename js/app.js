"use strict";

var NBJS = NBJS || {};

(function(nbjs) {	
	var my_renderer;
	var rotation_is_on = false;
	var bodies = [];	

	function onWindowResize() {
		// camera.aspect = window.innerWidth / window.innerHeight;
		// camera.updateProjectionMatrix();
		// renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	function init() {
		window.addEventListener('resize', onWindowResize, false);
		my_renderer = new Render();
	}

	function initBodies(numOfBodies) {
		clearBodies();
		generateBodies(numOfBodies);
	}	

	function generateBodies(numOfBodies) {
		var minMass = 1000;
		var maxMass = 100000;
		bodies = Body.generateRandomBodies(numOfBodies, minMass, maxMass);
		initBodyMeshes(minMass, maxMass);		
		my_renderer.createBodyRenders(bodies);
	}		

	function updateBodies(delta) {		
		Body.updateBodies(bodies, delta);
		updateBodyMeshes();
	}

	function clearBodies() {
		clearBodyMeshes();
		bodies.splice(0, bodies.length);
	}

	function initBodyMeshes(minMass, maxMass) {
		var bodyMaterial = new THREE.MeshPhongMaterial( { color: 0xffaa00 } );	
		bodies.forEach( function (body) {
			var meshRadius = Util.lerpRadiusByMass(0.1, 1, body.mass, minMass, maxMass);
			body.my_mesh = new BodyMesh(body.coord, meshRadius, 1 - meshRadius + 0.05, 15);
			updateMyBodyMesh(body.my_mesh, body);
		});				
	}

	function updateBodyMeshes() {
		bodies.forEach( function (body) {	
			updateMyBodyMesh(body.my_mesh, body);
		});				
	}

	function updateMyBodyMesh(mesh, body) {
		mesh.coord = [body.coord[0], body.coord[1], body.coord[2]]; // update body mesh
	}

	function clearBodyMeshes() {
		my_renderer.clear();
	}
	
	function render() {
		requestAnimationFrame(render);				
	 	my_renderer.render(bodies, rotation_is_on);
	};		

	var computeId = null;

	function compute() {
		updateBodies(0.1);
		computeId = setTimeout(compute, 10);
	}	

	function startCompute() {
		computeId = setTimeout(compute, 0);
		rotation_is_on = true;
	}

	function stopCompute() {
		if (computeId !== null) {
			clearTimeout(computeId);
		}
		rotation_is_on = false;
	}

	function startSimulation(numOfBodies) {
		stopCompute();
		initBodies(numOfBodies);
		startCompute();
	}

	nbjs.init = init;	
	nbjs.render = render;
	nbjs.start = startSimulation;
	nbjs.pause = stopCompute;
	nbjs.resume = startCompute;
})(NBJS);