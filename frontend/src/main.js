import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createRack } from "./racks.js";

// ============================================================
// WAREX 3D DIGITAL TWIN
// ============================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x071525);

// ============================================================
// CAMERA
// ============================================================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(
    18,
    13,
    24
);

// ============================================================
// RENDERER
// ============================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

document.body.appendChild(
    renderer.domElement
);

// ============================================================
// CONTROLS
// ============================================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.06;

controls.minDistance = 5;
controls.maxDistance = 65;

controls.maxPolarAngle =
    Math.PI / 2.05;

controls.target.set(
    0,
    2.5,
    0
);

// ============================================================
// LIGHTING
// ============================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

scene.add(ambientLight);

const mainLight =
    new THREE.DirectionalLight(
        0xffffff,
        2
    );

mainLight.position.set(
    15,
    25,
    10
);

mainLight.castShadow = true;

mainLight.shadow.mapSize.width =
    2048;

mainLight.shadow.mapSize.height =
    2048;

scene.add(mainLight);

// ============================================================
// INDUSTRIAL LED LIGHTS
// ============================================================

function createCeilingLight(x, z) {

    const light =
        new THREE.PointLight(
            0xffffff,
            4,
            25
        );

    light.position.set(
        x,
        8.5,
        z
    );

    light.castShadow = true;

    scene.add(light);

    const fixture =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2.5,
                0.08,
                0.3
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            })
        );

    fixture.position.set(
        x,
        8.8,
        z
    );

    scene.add(fixture);
}

for (
    let x = -15;
    x <= 15;
    x += 6
) {

    createCeilingLight(
        x,
        -12
    );

    createCeilingLight(
        x,
        0
    );

    createCeilingLight(
        x,
        12
    );
}

// ============================================================
// FLOOR
// ============================================================

const floor =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            40,
            0.5,
            40
        ),
        new THREE.MeshStandardMaterial({
            color: 0x505860,
            roughness: 0.9,
            metalness: 0.05
        })
    );

floor.position.y = -0.25;

floor.receiveShadow = true;

scene.add(floor);

// ============================================================
// FLOOR GRID
// ============================================================

const grid =
    new THREE.GridHelper(
        40,
        40,
        0x1976d2,
        0x243b55
    );

grid.position.y = 0.03;

scene.add(grid);

// ============================================================
// WALLS
// ============================================================

const wallMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x858c94,
        roughness: 0.9
    });

function createWall(
    width,
    height,
    depth,
    x,
    y,
    z
) {

    const wall =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            wallMaterial
        );

    wall.position.set(
        x,
        y,
        z
    );

    wall.castShadow = true;
    wall.receiveShadow = true;

    scene.add(wall);
}

// Back wall

createWall(
    40,
    10,
    0.5,
    0,
    5,
    -20
);

// Front wall

createWall(
    40,
    10,
    0.5,
    0,
    5,
    20
);

// Left wall

createWall(
    0.5,
    10,
    40,
    -20,
    5,
    0
);

// Right wall

createWall(
    0.5,
    10,
    40,
    20,
    5,
    0
);

// ============================================================
// CEILING
// ============================================================

const ceiling =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            40,
            0.4,
            40
        ),
        new THREE.MeshStandardMaterial({
            color: 0x20262d,
            roughness: 0.85
        })
    );

ceiling.position.y = 10;

scene.add(ceiling);

// ============================================================
// LOADING DOCK
// ============================================================

const dock =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            10,
            0.7,
            5
        ),
        new THREE.MeshStandardMaterial({
            color: 0x70767c,
            roughness: 0.85
        })
    );

dock.position.set(
    0,
    0.35,
    -17
);

dock.castShadow = true;
dock.receiveShadow = true;

scene.add(dock);

// ============================================================
// YELLOW SAFETY AISLE
// ============================================================

const aisle =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1,
            0.04,
            30
        ),
        new THREE.MeshStandardMaterial({
            color: 0xffd000,
            emissive: 0x4d3d00
        })
    );

aisle.position.set(
    0,
    0.04,
    0
);

scene.add(aisle);

// ============================================================
// RACK SYSTEM
// ============================================================

const racks = [];

// ============================================================
// LOAD WAREHOUSE FROM BACKEND
// ============================================================

async function loadWarehouse() {

    try {

        console.log(
            "WAREX: Loading warehouse..."
        );

        const response =
            await fetch(
                "http://localhost:8080/api/warehouse/layout"
            );

        if (!response.ok) {

            throw new Error(
                `Warehouse API error: ${response.status}`
            );
        }

        const data =
            await response.json();

        console.log(
            "WAREX layout:",
            data
        );

        if (
            !data.shelves ||
            !Array.isArray(data.shelves)
        ) {

            throw new Error(
                "Invalid warehouse layout"
            );
        }

        // ----------------------------------------------------
        // Create racks
        // ----------------------------------------------------

        data.shelves.forEach(
            (shelf, index) => {

                const rackId =
                    `A-${String(
                        index + 1
                    ).padStart(2, "0")}`;

                const rackData = {
                    id: rackId,
                    category: "General",
                    capacity: 0,
                    level: 4,
                    products: []
                };

                const rack =
                    createRack(
                        Number(shelf.x),
                        Number(shelf.z),
                        rackData
                    );

                scene.add(rack);

                racks.push(rack);

            }
        );

        console.log(
            `WAREX: ${racks.length} racks created`
        );

    } catch (error) {

        console.error(
            "WAREX warehouse error:",
            error
        );

        // ====================================================
        // FALLBACK RACK LAYOUT
        // ====================================================

        console.log(
            "WAREX: Creating fallback racks..."
        );

        const fallbackPositions = [];

        for (
            let z = -12;
            z <= 12;
            z += 4
        ) {

            fallbackPositions.push({
                x: -5,
                z
            });

            fallbackPositions.push({
                x: 5,
                z
            });

        }

        fallbackPositions.forEach(
            (position, index) => {

                const rackData = {
                    id:
                        `A-${String(
                            index + 1
                        ).padStart(2, "0")}`,

                    category:
                        "General",

                    capacity: 0,

                    level: 4,

                    products: []
                };

                const rack =
                    createRack(
                        position.x,
                        position.z,
                        rackData
                    );

                scene.add(rack);

                racks.push(rack);

            }
        );

        console.log(
            `WAREX fallback: ${racks.length} racks created`
        );
    }
}

// Start warehouse

loadWarehouse();

// ============================================================
// RACK INTERACTION
// ============================================================

const raycaster =
    new THREE.Raycaster();

const mouse =
    new THREE.Vector2();

let hoveredRack = null;

// ============================================================
// MOUSE POSITION
// ============================================================

window.addEventListener(
    "pointermove",
    (event) => {

        mouse.x =
            (
                event.clientX /
                window.innerWidth
            ) * 2 - 1;

        mouse.y =
            -(
                event.clientY /
                window.innerHeight
            ) * 2 + 1;

    }
);

// ============================================================
// RACK COLOR
// ============================================================

function highlightRack(rack) {

    rack.traverse(
        (object) => {

            if (
                object.isMesh &&
                object.material &&
                object.material.color
            ) {

                if (
                    !object.userData.originalColor
                ) {

                    object.userData.originalColor =
                        object.material.color.getHex();

                }

                object.material.color.set(
                    0xffd000
                );
            }

        }
    );
}

function restoreRack(rack) {

    rack.traverse(
        (object) => {

            if (
                object.isMesh &&
                object.material &&
                object.material.color &&
                object.userData.originalColor
            ) {

                object.material.color.set(
                    object.userData.originalColor
                );

            }

        }
    );
}

// ============================================================
// FIND RACK FROM INTERSECTION
// ============================================================

function findRack(object) {

    let current = object;

    while (
        current &&
        !racks.includes(current)
    ) {

        current =
            current.parent;
    }

    return current || null;
}

// ============================================================
// CLICK
// ============================================================

window.addEventListener(
    "click",
    () => {

        raycaster.setFromCamera(
            mouse,
            camera
        );

        const hits =
            raycaster.intersectObjects(
                racks,
                true
            );

        if (
            hits.length === 0
        ) {

            return;
        }

        const rack =
            findRack(
                hits[0].object
            );

        if (!rack) {

            return;
        }

        console.log(
            "WAREX Selected Rack:",
            rack.userData
        );

    }
);

// ============================================================
// ANIMATION
// ============================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const hits =
        raycaster.intersectObjects(
            racks,
            true
        );

    let currentRack = null;

    if (
        hits.length > 0
    ) {

        currentRack =
            findRack(
                hits[0].object
            );
    }

    // Rack changed

    if (
        currentRack !==
        hoveredRack
    ) {

        if (
            hoveredRack
        ) {

            restoreRack(
                hoveredRack
            );
        }

        if (
            currentRack
        ) {

            highlightRack(
                currentRack
            );
        }

        hoveredRack =
            currentRack;
    }

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();

// ============================================================
// RESIZE
// ============================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);