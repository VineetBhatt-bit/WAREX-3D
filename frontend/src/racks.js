import * as THREE from "three";

export function createRack(x, z, rackData = {}) {
    const rack = new THREE.Group();

    rack.userData = {
        id: rackData.id || "A-00",
        category: rackData.category || "General",
        capacity: rackData.capacity || 0,
        level: rackData.level || 1,
        products: rackData.products || []
    };

    // =========================================================
    // MATERIALS
    // =========================================================

    const blueMaterial = new THREE.MeshStandardMaterial({
        color: 0x1455a0,
        metalness: 0.65,
        roughness: 0.3
    });

    const orangeMaterial = new THREE.MeshStandardMaterial({
        color: 0xff8c00,
        metalness: 0.55,
        roughness: 0.3
    });

    const shelfMaterial = new THREE.MeshStandardMaterial({
        color: 0x59636e,
        metalness: 0.35,
        roughness: 0.6
    });

    const palletMaterial = new THREE.MeshStandardMaterial({
        color: 0xa66a32,
        roughness: 0.85
    });

    const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0xc5945a,
        roughness: 0.85
    });

    // =========================================================
    // BLUE STEEL UPRIGHTS
    // =========================================================

    const postGeometry = new THREE.BoxGeometry(
        0.18,
        5.4,
        0.18
    );

    const postPositions = [
        [-1.15, -0.65],
        [1.15, -0.65],
        [-1.15, 0.65],
        [1.15, 0.65]
    ];

    postPositions.forEach(([px, pz]) => {
        const post = new THREE.Mesh(
            postGeometry,
            blueMaterial.clone()
        );

        post.position.set(
            px,
            2.7,
            pz
        );

        post.castShadow = true;
        post.receiveShadow = true;

        post.userData.rackRoot = rack;

        rack.add(post);
    });

    // =========================================================
    // STORAGE LEVELS
    // =========================================================

    const levels = [
        0.8,
        2.0,
        3.2,
        4.4
    ];

    levels.forEach((y, levelIndex) => {

        // -----------------------------------------------------
        // ORANGE FRONT BEAM
        // -----------------------------------------------------

        const frontBeam = new THREE.Mesh(
            new THREE.BoxGeometry(
                2.5,
                0.18,
                0.16
            ),
            orangeMaterial.clone()
        );

        frontBeam.position.set(
            0,
            y,
            -0.65
        );

        frontBeam.castShadow = true;
        frontBeam.userData.rackRoot = rack;

        rack.add(frontBeam);

        // -----------------------------------------------------
        // ORANGE BACK BEAM
        // -----------------------------------------------------

        const backBeam = new THREE.Mesh(
            new THREE.BoxGeometry(
                2.5,
                0.18,
                0.16
            ),
            orangeMaterial.clone()
        );

        backBeam.position.set(
            0,
            y,
            0.65
        );

        backBeam.castShadow = true;
        backBeam.userData.rackRoot = rack;

        rack.add(backBeam);

        // -----------------------------------------------------
        // METAL STORAGE DECK
        // -----------------------------------------------------

        const shelf = new THREE.Mesh(
            new THREE.BoxGeometry(
                2.35,
                0.10,
                1.25
            ),
            shelfMaterial.clone()
        );

        shelf.position.set(
            0,
            y - 0.08,
            0
        );

        shelf.castShadow = true;
        shelf.receiveShadow = true;

        shelf.userData.rackRoot = rack;

        rack.add(shelf);

        // -----------------------------------------------------
        // WOODEN PALLET
        // -----------------------------------------------------

        const pallet = new THREE.Mesh(
            new THREE.BoxGeometry(
                1.9,
                0.12,
                0.95
            ),
            palletMaterial.clone()
        );

        pallet.position.set(
            0,
            y + 0.08,
            0
        );

        pallet.castShadow = true;
        pallet.receiveShadow = true;

        pallet.userData.rackRoot = rack;

        rack.add(pallet);

        // -----------------------------------------------------
        // PALLET SLATS
        // -----------------------------------------------------

        for (let i = -1; i <= 1; i++) {

            const slat = new THREE.Mesh(
                new THREE.BoxGeometry(
                    1.75,
                    0.05,
                    0.12
                ),
                palletMaterial.clone()
            );

            slat.position.set(
                0,
                y + 0.15,
                i * 0.3
            );

            slat.userData.rackRoot = rack;

            rack.add(slat);
        }

        // -----------------------------------------------------
        // PRODUCT BOXES
        // -----------------------------------------------------

        const products =
            rack.userData.products || [];

        const visibleProducts =
            products.length > 0
                ? products.slice(0, 3)
                : [
                    {
                        sku: "EMPTY",
                        name: "Warehouse Stock",
                        quantity: 0,
                        price: 0
                    }
                ];

        visibleProducts.forEach(
            (product, boxIndex) => {

                const box = new THREE.Mesh(
                    new THREE.BoxGeometry(
                        0.5,
                        0.45,
                        0.5
                    ),
                    boxMaterial.clone()
                );

                box.position.set(
                    -0.55 + boxIndex * 0.55,
                    y + 0.42,
                    0
                );

                box.castShadow = true;
                box.receiveShadow = true;

                box.userData = {
                    rackRoot: rack,
                    rackId: rack.userData.id,
                    level: levelIndex + 1,
                    sku: product.sku,
                    name: product.name,
                    quantity: product.quantity,
                    price: product.price
                };

                rack.add(box);
            }
        );
    });

    // =========================================================
    // RACK LABEL
    // =========================================================

    const canvas =
        document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 128;

    const context =
        canvas.getContext("2d");

    context.fillStyle = "#10243d";

    context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    context.strokeStyle = "#ff9800";
    context.lineWidth = 8;

    context.strokeRect(
        4,
        4,
        canvas.width - 8,
        canvas.height - 8
    );

    context.fillStyle = "#ffffff";

    context.font =
        "bold 62px Arial";

    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText(
        rack.userData.id,
        canvas.width / 2,
        canvas.height / 2
    );

    const labelTexture =
        new THREE.CanvasTexture(canvas);

    const label = new THREE.Mesh(
        new THREE.PlaneGeometry(
            1.8,
            0.45
        ),
        new THREE.MeshBasicMaterial({
            map: labelTexture,
            transparent: true,
            side: THREE.DoubleSide
        })
    );

    label.position.set(
        0,
        5.7,
        -0.72
    );

    label.userData.rackRoot = rack;

    rack.add(label);

    // =========================================================
    // POSITION
    // =========================================================

    rack.position.set(
        x,
        0,
        z
    );

    return rack;
}