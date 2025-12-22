
import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// =====================================================================
// U T I L S
// =====================================================================

/**
 * Creates a THREE.Texture from a File object.
 */
const createTextureFromFile = (file: File): THREE.Texture => {
    const url = URL.createObjectURL(file);
    const texture = new THREE.TextureLoader().load(url, () => {
        URL.revokeObjectURL(url);
    });
    texture.encoding = THREE.sRGBEncoding; // Prevent washed-out colors
    texture.flipY = false; // Important for textures applied to 3D objects
    return texture;
};

// =====================================================================
// T E M P L A T E S
// =====================================================================

// Replicating the CSS styles from compose/page.tsx as material properties
const ENVELOPE_TEMPLATES = {
    1: { color: '#78350f', roughness: 0.6 }, // Cổ điển
    2: { color: '#4a5568', roughness: 0.5, metalness: 0.1 }, // Trang trọng
    3: { color: '#2a4365', roughness: 0.7 }, // Thư hàng không (simplified)
};

const PAPER_TEMPLATES = {
    1: { color: '#ffffff', roughness: 0.9 }, // Kẻ ngang (simplified)
    2: { color: '#F3E5AB', roughness: 1.0 }, // Giấy cũ
    3: { color: '#ffffff', roughness: 0.8 }, // Caro (simplified)
};

const SEAL_TEMPLATES = {
    1: { color: '#b91c1c', roughness: 0.4, metalness: 0.2 }, // Sáp đỏ
    2: { color: '#f59e0b', roughness: 0.2, metalness: 0.6 }, // Vàng kim
    3: { color: '#1e3a8a', roughness: 0.3, metalness: 0.3 }, // Xanh hoàng gia
};

const TEMPLATES = {
    envelope: ENVELOPE_TEMPLATES,
    paper: PAPER_TEMPLATES,
    seal: SEAL_TEMPLATES,
};

// =====================================================================
// H O O K
// =====================================================================

type MaterialType = 'envelope' | 'paper' | 'seal';

/**
 * Custom hook to create a dynamic material based on user's selection.
 * Handles both pre-defined templates and custom file uploads.
 * @param type - The type of material to create ('envelope', 'paper', or 'seal').
 * @param selectedId - The ID of the selected template (e.g., 1, 2, 'custom').
 * @param customFile - The File object for the custom upload.
 */
export const useDynamicMaterial = (type: MaterialType, selectedId: number | 'custom' | null, customFile: File | null) => {
    const material = useMemo(() => {
        const mat = new THREE.MeshStandardMaterial();

        if (selectedId === 'custom' && customFile) {
            const texture = createTextureFromFile(customFile);
            mat.map = texture;
            mat.roughness = 0.8; // Default roughness for custom images
        } else if (selectedId && typeof selectedId === 'number' && TEMPLATES[type][selectedId]) {
            const templateProps = TEMPLATES[type][selectedId];
            mat.setValues(templateProps);
        } else {
            // Default fallback material
            mat.color.set('#ffffff');
            mat.roughness = 0.9;
        }
        
        mat.needsUpdate = true;
        return mat;

    }, [type, selectedId, customFile]);

    return material;
};

// Default inner material for the envelope
export const useInnerEnvelopeMaterial = () => {
    return useMemo(() => new THREE.MeshStandardMaterial({
        color: '#F3E5AB',
        roughness: 0.9,
    }), []);
};
