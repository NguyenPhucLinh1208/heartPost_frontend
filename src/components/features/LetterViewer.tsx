'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import Envelope from './Envelope'; // Import the new Envelope component

// This is the main component that sets up the Canvas.
const LetterViewer = ({ letterData }) => {
    const [letterState, setLetterState] = useState('inside'); // inside, ascending, centering, final

    return (
        <div className="w-full h-full relative">
            {/* The 3D Canvas */}
            <Canvas 
                style={{ background: 'transparent' }} 
                camera={{ position: [0, 0, 35], fov: 50 }} 
                gl={{ alpha: true }}
            >
                <Suspense fallback={<Html center>Đang tải...</Html>}> 
                    {/* Lighting */}
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[10, 10, 15]} intensity={1} />
                    <directionalLight position={[-10, -10, -15]} intensity={0.5} />

                    {/* The 3D Envelope Model */}
                    <Envelope letterData={letterData} letterState={letterState} setLetterState={setLetterState} />

                    {/* Controls to move the camera */}
                    <OrbitControls enabled={letterState === 'inside'} />
                </Suspense>
            </Canvas>


        </div>
    );
};

export default LetterViewer;
