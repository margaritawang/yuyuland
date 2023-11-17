import * as THREE from 'three'

const parameters = {
    count: 1000,
    size: 0.25,
    color: 0x9988cc
}

export const generateGalaxy = (scene) => {
    /**
     * Geometry
     */
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)

    for(let i = 0; i < parameters.count; i++) {
        const i3 = i*3;

        positions[i3 + 0] = (Math.random() - 0.5) * 20
        positions[i3 + 1] = (Math.random() - 0.5) * 20
        positions[i3 + 2] = (Math.random() - 0.5) * 20
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )

    /**
     * Material
     */
    const starMaterial = new THREE.PointsMaterial({
        
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite:false,
        // blending: THREE.MultiplyBlending,
        color: parameters.color,
    })

    /**
     * Points
     */
    const points = new THREE.Points(geometry,starMaterial)

    scene.add(points)
}