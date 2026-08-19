import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ============================================================
// WAREX-3D — MAIN SCENE
// ============================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x071525);

scene.fog = new THREE.Fog(
    0x071525,
    45,
    100
);

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
    14,
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

const controls =
    new OrbitControls(
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

const ambient =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

scene.add(ambient);

const mainLight =
    new THREE.DirectionalLight(
        0xffffff,
        2.0
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
// WAREHOUSE CEILING LIGHTS
// ============================================================

function createCeilingLight(x, z) {

    const light =
        new THREE.PointLight(
            0xffffff,
            5,
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
                2.4,
                0.08,
                0.28
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
            roughness: 0.85,
            metalness: 0.1
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
// WAREHOUSE WALLS
// ============================================================

const wallMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x737b84,
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

    wall.receiveShadow = true;

    wall.castShadow = true;

    scene.add(wall);
}

createWall(
    40,
    10,
    0.5,
    0,
    5,
    -20
);

createWall(
    0.5,
    10,
    40,
    -20,
    5,
    0
);

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
// SAFETY AISLE
// ============================================================

const aisleMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xffd000,
        emissive: 0x4d3d00,
        roughness: 0.5
    });

const aisle =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            1,
            0.04,
            30
        ),
        aisleMaterial
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

// ------------------------------------------------------------
// Materials
// ------------------------------------------------------------

const rackBlue =
    new THREE.MeshStandardMaterial({
        color: 0x0752a5,
        metalness: 0.6,
        roughness: 0.35
    });

const rackOrange =
    new THREE.MeshStandardMaterial({
        color: 0xff8c00,
        metalness: 0.5,
        roughness: 0.35
    });

const shelfMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x66717d,
        metalness: 0.35,
        roughness: 0.6
    });

const palletMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xb77a3b,
        roughness: 0.85
    });

const boxMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xc29155,
        roughness: 0.85
    });

// ============================================================
// CREATE ONE REAL WAREHOUSE PALLET RACK
// ============================================================

function createRack(
    x,
    z,
    id
) {

    const rack =
        new THREE.Group();

    rack.position.set(
        x,
        0,
        z
    );

    rack.userData = {
        id: id,
        type: "warehouse-rack"
    };

    // --------------------------------------------------------
    // Upright posts
    // --------------------------------------------------------

    const postGeometry =
        new THREE.BoxGeometry(
            0.18,
            5.5,
            0.18
        );

    const postPositions = [
        [-1.15, -0.65],
        [1.15, -0.65],
        [-1.15, 0.65],
        [1.15, 0.65]
    ];

    postPositions.forEach(
        ([px, pz]) => {

            const post =
                new THREE.Mesh(
                    postGeometry,
                    rackBlue.clone()
                );

            post.position.set(
                px,
                2.75,
                pz
            );

            post.castShadow = true;

            post.receiveShadow = true;

            post.userData.rackRoot =
                rack;

            rack.add(post);
        }
    );

    // --------------------------------------------------------
    // Cross bracing
    // --------------------------------------------------------

    const braceMaterial =
        rackBlue.clone();

    const braceGeometry =
        new THREE.BoxGeometry(
            0.10,
            1.35,
            0.10
        );

    const braceLevels = [
        0.8,
        2.0,
        3.2,
        4.4
    ];

    braceLevels.forEach(
        (y) => {

            const frontBrace =
                new THREE.Mesh(
                    braceGeometry,
                    braceMaterial
                );

            frontBrace.position.set(
                0,
                y,
                -0.65
            );

            frontBrace.rotation.z =
                Math.PI / 2;

            rack.add(
                frontBrace
            );
        }
    );

    // --------------------------------------------------------
    // Shelf levels
    // --------------------------------------------------------

    const shelfLevels = [
        0.8,
        2.0,
        3.2,
        4.4
    ];

    shelfLevels.forEach(
        (y, levelIndex) => {

            // Shelf platform

            const shelf =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        2.3,
                        0.12,
                        1.25
                    ),
                    shelfMaterial.clone()
                );

            shelf.position.set(
                0,
                y,
                0
            );

            shelf.castShadow = true;

            shelf.receiveShadow = true;

            shelf.userData.rackRoot =
                rack;

            rack.add(shelf);

            // ------------------------------------------------
            // Orange front beam
            // ------------------------------------------------

            const frontBeam =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        2.45,
                        0.18,
                        0.16
                    ),
                    rackOrange.clone()
                );

            frontBeam.position.set(
                0,
                y - 0.05,
                -0.64
            );

            frontBeam.castShadow = true;

            frontBeam.userData.rackRoot =
                rack;

            rack.add(frontBeam);

            // ------------------------------------------------
            // Orange rear beam
            // ------------------------------------------------

            const rearBeam =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        2.45,
                        0.18,
                        0.16
                    ),
                    rackOrange.clone()
                );

            rearBeam.position.set(
                0,
                y - 0.05,
                0.64
            );

            rearBeam.castShadow = true;

            rack.add(rearBeam);

            // ------------------------------------------------
            // Pallet
            // ------------------------------------------------

            const pallet =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        1.8,
                        0.12,
                        0.9
                    ),
                    palletMaterial.clone()
                );

            pallet.position.set(
                0,
                y + 0.12,
                0
            );

            pallet.castShadow = true;

            pallet.receiveShadow = true;

            pallet.userData.rackRoot =
                rack;

            rack.add(pallet);

            // ------------------------------------------------
            // Product boxes
            // ------------------------------------------------

            const boxPositions = [
                -0.65,
                0,
                0.65
            ];

            boxPositions.forEach(
                (bx, boxIndex) => {

                    const box =
                        new THREE.Mesh(
                            new THREE.BoxGeometry(
                                0.52,
                                0.42,
                                0.52
                            ),
                            boxMaterial.clone()
                        );

                    box.position.set(
                        bx,
                        y + 0.42,
                        0
                    );

                    box.castShadow = true;

                    box.receiveShadow = true;

                    box.userData = {
                        rackRoot: rack,
                        rackId: id,
                        level: levelIndex + 1
                    };

                    rack.add(box);

                }
            );
        }
    );

    // --------------------------------------------------------
    // Rack label
    // --------------------------------------------------------

    const labelCanvas =
        document.createElement(
            "canvas"
        );

    labelCanvas.width = 256;
    labelCanvas.height = 64;

    const ctx =
        labelCanvas.getContext(
            "2d"
        );

    ctx.fillStyle =
        "#071525";

    ctx.fillRect(
        0,
        0,
        256,
        64
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 30px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        id,
        128,
        42
    );

    const texture =
        new THREE.CanvasTexture(
            labelCanvas
        );

    const label =
        new THREE.Mesh(
            new THREE.PlaneGeometry(
                1.7,
                0.42
            ),
            new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true
            })
        );

    label.position.set(
        0,
        5.65,
        -0.7
    );

    rack.add(label);

    scene.add(rack);

    racks.push(rack);

    return rack;
}

// ============================================================
// LOAD RACK POSITIONS FROM BACKEND
// ============================================================

async function loadWarehouse() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/warehouse/layout"
            );

        if (!response.ok) {

            throw new Error(
                "Warehouse API returned " +
                response.status
            );
        }

        const data =
            await response.json();

        console.log(
            "WAREX warehouse data:",
            data
        );

        // Remove existing racks

        racks.forEach(
            rack => scene.remove(rack)
        );

        racks.length = 0;

        // Create every rack

        data.shelves.forEach(
            (shelf, index) => {

                const id =
                    "A-" +
                    String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    );

                createRack(
                    shelf.x,
                    shelf.z,
                    id
                );

            }
        );

        console.log(
            "WAREX racks created:",
            racks.length
        );

    } catch (error) {

        console.error(
            "WAREX rack loading error:",
            error
        );

        // ----------------------------------------------------
        // Emergency fallback
        // ----------------------------------------------------

        console.log(
            "Using local warehouse fallback."
        );

        const positions = [];

        for (
            let z = -12;
            z <= 12;
            z += 4
        ) {

            positions.push({
                x: -5,
                z: z
            });

            positions.push({
                x: 5,
                z: z
            });
        }

        positions.forEach(
            (position, index) => {

                createRack(
                    position.x,
                    position.z,
                    "A-" +
                    String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    )
                );

            }
        );
    }
}

loadWarehouse();

// ============================================================
// RACK HOVER / CLICK
// ============================================================

const raycaster =
    new THREE.Raycaster();

const mouse =
    new THREE.Vector2();

let hoveredRack = null;

// ------------------------------------------------------------
// Change rack color
// ------------------------------------------------------------

function setRackColor(
    rack,
    color
) {

    rack.traverse(
        object => {

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
                    color
                );
            }

        }
    );
}

// ------------------------------------------------------------
// Restore rack color
// ------------------------------------------------------------

function restoreRackColor(
    rack
) {

    rack.traverse(
        object => {

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
// MOUSE MOVE
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
// CLICK RACK
// ============================================================

window.addEventListener(
    "click",
    () => {

        raycaster.setFromCamera(
            mouse,
            camera
        );

        const intersections =
            raycaster.intersectObjects(
                racks,
                true
            );

        if (
            intersections.length === 0
        ) {

            return;
        }

        let selected =
            intersections[0].object;

        while (
            selected.parent &&
            !racks.includes(selected)
        ) {

            selected =
                selected.parent;
        }

        if (
            racks.includes(selected)
        ) {

            // Highlight selected rack

            racks.forEach(
                rack => {

                    restoreRackColor(
                        rack
                    );

                }
            );

            setRackColor(
                selected,
                0xffd000
            );

            console.log(
                "Selected WAREX Rack:",
                selected.userData.id
            );
        }

    }
);

// ============================================================
// ANIMATION
// ============================================================

function animate() {

    requestAnimationFrame(
        animate
    );

    // Hover detection

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const intersections =
        raycaster.intersectObjects(
            racks,
            true
        );

    if (
        intersections.length > 0
    ) {

        let rack =
            intersections[0].object;

        while (
            rack.parent &&
            !racks.includes(rack)
        ) {

            rack =
                rack.parent;
        }

        if (
            racks.includes(rack) &&
            rack !== hoveredRack
        ) {

            if (
                hoveredRack
            ) {

                restoreRackColor(
                    hoveredRack
                );
            }

            hoveredRack =
                rack;

            setRackColor(
                hoveredRack,
                0xffd000
            );
        }

    } else {

        if (
            hoveredRack
        ) {

            restoreRackColor(
                hoveredRack
            );

            hoveredRack = null;
        }
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