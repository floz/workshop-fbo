const OrbitControls = require( "three-orbit-controls" )( THREE )

import PostProcessPass from "postprocess/PostProcessPass"

import FBOExample from "./examples/fbo-usage/FBOExample"

class Main {

	constructor(){
		this.initEngine()
		this.initPostProcess()
		this.initScene()

		this.animate()
		
		window.addEventListener( 'resize', this.onResize, false )
		this.onResize()
	}

	initEngine() {
		this.scene = new THREE.Scene()

		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setPixelRatio( window.devicePixelRatio )
		this.renderer.setSize( window.innerWidth, window.innerHeight )
		this.renderer.setClearColor( 0x222222, 1 );
		document.body.appendChild( this.renderer.domElement )

		this.camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 100000 )
		this.camera.position.z = 6000
		this.controls = new OrbitControls( this.camera )

		this.composer = new WAGNER.Composer( this.renderer, { useRGBA: false } )
		this.composer.setSize( window.innerWidth, window.innerHeight )
		this.passes = []
	}

	initPostProcess() {
		this.postProcessPass = new PostProcessPass()
		this.postProcessPass.createGui()
		this.passes.push( this.postProcessPass )
	}

	initScene() {
		// examples

		// const example = new BasicShaderExample()
		// const example = new BasicLightingExample()
		// const example = new BufferGeometryParticlesExample()
		// const example = new BufferGeometryAdvancedExample()
		// const example = new InstancedBufferGeometryExample( 10000 )
		// const example = new TextureDataExample()
		const example = new FBOExample( this.renderer )

		this.example = example
		
		this.scene.add( example )
	}

	// -------------------------------------------------------------------------------------------------- EACH FRAME

	animate = () => {
		requestAnimationFrame( this.animate )

		// do stuff
		if( this.example.update ) {
			this.example.update()
		}

		this.render()
	}

	// -------------------------------------------------------------------------------------------------- RENDER

	render() {
		const passes = []
		for( let i = 0, n = this.passes.length; i < n; i++ ) {
			let pass = this.passes[ i ]
			if( pass.activate && ( pass.shader || pass.isLoaded() ) ){
				passes.push( pass )
			}
		}

		if( passes.length > 0 ) { // Wagner Postprocessing
			this.composer.reset()
			this.composer.render( this.scene, this.camera )
			for( let i = 0, n = passes.length-1; i < n; i++ ) {
				let pass = passes[ i ]
				this.composer.pass( pass )
			}
			this.composer.toScreen( passes[passes.length-1] )
		} else { // Pas de postprocessing
			this.renderer.render( this.scene, this.camera )
		}
	}

	// -------------------------------------------------------------------------------------------------- RESIZE

	onResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()

		this.renderer.setSize( window.innerWidth, window.innerHeight )

		this.composer.setSize( this.renderer.domElement.width, this.renderer.domElement.height )
	}

}

export default new Main()
