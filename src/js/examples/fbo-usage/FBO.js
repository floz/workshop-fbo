export default class FBO{

	constructor( renderer, width, height, simulation ){

		this.simulation = simulation
		this.renderer = renderer

		const options = {
			wrapS: THREE.ClampToEdgeWrapping,
			wrapT: THREE.ClampToEdgeWrapping,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
			stencilBuffer: false,
			depthBuffer: false,
			generateMipmaps: false
		}

		this.rt = new THREE.WebGLRenderTarget(width, height, options)
		this.rt2 = new THREE.WebGLRenderTarget(width, height, options)
		this.rt3 = new THREE.WebGLRenderTarget(width, height, options)

		this.scene = new THREE.Scene()
		this.orthoCamera = new THREE.OrthographicCamera( - 0.5, 0.5, 0.5, - 0.5, 0, 1 )
		this.mesh =  new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1, 1, 1 ) )
		this.scene.add( this.mesh )
		this.texture = this.simulation.uniforms.t_pos.value
	}

	setSimulation(simulation){
		this.simulation = simulation
		this.mesh.material = this.simulation
		this.simulation.uniforms.t_pos.value = this.rt3.texture
		this.simulation.uniforms.t_oPos.value = this.rt2.texture
	}

	update = (dt)=> {
		this.renderer.setClearColor( 0 )
		this.renderer.render( this.scene, this.orthoCamera, this.rt )
		const tmp = this.rt
		this.rt = this.rt2
		this.rt2 = this.rt3
		this.rt3 = tmp
		this.simulation.uniforms.t_pos.value = this.rt3.texture
		this.simulation.uniforms.t_oPos.value = this.rt2.texture
	}

	set texture(value){
		this.simulation.uniforms.t_pos.value = value
		this.copy()
	}

	get current() { return this.rt2.texture }
	get old() { return this.rt3.texture }

	copy = ()=>{
		const material = new THREE.ShaderMaterial({
			uniforms: {
				t_pos: { type: "t", value: this.simulation.uniforms.t_pos.value }
			},
			vertexShader: require( "./shaders/copy.vs" ),
			fragmentShader: require( "./shaders/copy.fs" ),
		})
		this.mesh.material = material
		this.update()
		this.update()
		this.update()
		material.dispose()
		this.mesh.material = this.simulation
	}

	debug(){
		this.debug1 = new THREE.Mesh(new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map:this.rt.texture}))
		this.debug2 = new THREE.Mesh(new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map:this.rt2.texture}))
		this.debug3 = new THREE.Mesh(new THREE.PlaneBufferGeometry( 2, 2 ), new THREE.MeshBasicMaterial({ map:this.rt3.texture}))

		this.debug2.position.x = 2.1
		this.debug3.position.x = -2.1

		stage3d.add(this.debug1)
		stage3d.add(this.debug2)
		stage3d.add(this.debug3)
	}

}

export { FBO }
