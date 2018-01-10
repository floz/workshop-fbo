import vsCopy from "./shaders/copy.vs"
import fsSimulation from "./shaders/simulation.fs"
import vsVisualizer from "./shaders/visualizer.vs"
import fsVisualizer from "./shaders/visualizer.fs"

import FBO from "./FBO"

export default class FBOExample extends THREE.Group {

	constructor( renderer ) {
		super()

		this.renderer = renderer

		this.createTextureData()
		this.createFBO()
		this.createVisualizer()
	}

	createTextureData() {
		const count = 4
		const data = new Float32Array( count * 4 )
		this.dataTexturePlane = new THREE.DataTexture( data, count, 1, THREE.RGBAFormat, THREE.FloatType )
		
		let i4 = 0
		this.dataTexturePlane.image.data[ i4 + 0 ] = 1
		this.dataTexturePlane.image.data[ i4 + 1 ] = 0
		this.dataTexturePlane.image.data[ i4 + 2 ] = 0
		this.dataTexturePlane.image.data[ i4 + 3 ] = 1

		i4 += 4

		this.dataTexturePlane.image.data[ i4 + 0 ] = 0
		this.dataTexturePlane.image.data[ i4 + 1 ] = 1
		this.dataTexturePlane.image.data[ i4 + 2 ] = 0
		this.dataTexturePlane.image.data[ i4 + 3 ] = 1

		i4 += 4

		this.dataTexturePlane.image.data[ i4 + 0 ] = 0
		this.dataTexturePlane.image.data[ i4 + 1 ] = 0
		this.dataTexturePlane.image.data[ i4 + 2 ] = 1
		this.dataTexturePlane.image.data[ i4 + 3 ] = 1

		i4 += 4

		this.dataTexturePlane.image.data[ i4 + 0 ] = 1
		this.dataTexturePlane.image.data[ i4 + 1 ] = 1
		this.dataTexturePlane.image.data[ i4 + 2 ] = 1
		this.dataTexturePlane.image.data[ i4 + 3 ] = 1

		this.dataTexturePlane.needsUpdate = true
	}

	createFBO() {
		this.simulationMaterial = new THREE.ShaderMaterial( {
			uniforms: {
				t_pos: { type: "t", value: this.dataTexturePlane },
				t_oPos: { type: "t", value: null },
			},
			vertexShader: vsCopy,
			fragmentShader: fsSimulation,
			depthWrite: false,
			depthTest: false,
			type: "SimulationMaterial"
		} )

		this.fbo = new FBO( this.renderer, 4, 1, this.simulationMaterial )
	}

	createVisualizer() {
		const geo = new THREE.PlaneBufferGeometry( 400, 100 )
		const mat = new THREE.RawShaderMaterial( {
			uniforms: {
				tSimulation: { type: "t", value: this.fbo.current }
			},
			vertexShader: vsVisualizer,
			fragmentShader: fsVisualizer
		} )
		this.mesh = new THREE.Mesh( geo, mat )
		this.add( this.mesh )
	}

	update() {
		this.fbo.update()
		this.mesh.material.uniforms.tSimulation.value = this.fbo.current
	}

}
