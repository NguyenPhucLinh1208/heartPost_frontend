// src/components/letter-designer/canvas/envelope/shaders.ts

// ==========================================================
// PHẦN 1: SHADER CHO PHONG BÌ (ENVELOPE)
// ==========================================================

export const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vShadow;

  uniform float uFoldRight;
  uniform float uFoldLeft;
  uniform float uFoldBottom;
  uniform float uFoldTop;

  // Hàm xoay điểm quanh một trục và tâm cụ thể
  vec3 rotateAround(vec3 p, float angle, vec3 axis, vec3 origin) {
    vec3 diff = p - origin;
    float c = cos(angle);
    float s = sin(angle);
    float t = 1.0 - c;
    vec3 rotation = diff * c + cross(axis, diff) * s + axis * dot(axis, diff) * t;
    return origin + rotation;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    vShadow = 1.0;

    // Các điểm chốt (hinge) của nắp phong bì - GIỮ NGUYÊN THÔNG SỐ CỦA BẠN
    float hingeR = 2.1; 
    float hingeL = -2.1;
    float hingeT = 1.1; 
    float hingeB = -1.1;

    // Bán kính cong
    float rL = 0.021; 
    float rR = 0.021; 
    float rB = 0.022;  
    float rT = 0.023; 

    // Xử lý nắp Trái
    if (pos.x < hingeL) {
      float angle = uFoldLeft * 3.12;
      pos = rotateAround(pos, angle, vec3(0.0, 1.0, 0.0), vec3(hingeL, 0.0, rL));
      vShadow -= uFoldLeft * 0.15;
    }

    // Xử lý nắp Phải
    if (pos.x > hingeR) {
      float angle = -uFoldRight * 3.12;
      pos = rotateAround(pos, angle, vec3(0.0, 1.0, 0.0), vec3(hingeR, 0.0, rR));
      vShadow -= uFoldRight * 0.2;
    }

    // Xử lý nắp Đáy
    if (pos.y < hingeB) {
      float angle = -uFoldBottom * 3.13;
      pos = rotateAround(pos, angle, vec3(1.0, 0.0, 0.0), vec3(0.0, hingeB, rB));
      vShadow -= uFoldBottom * 0.25;
    }

    // Xử lý nắp Trên
    if (pos.y > hingeT) {
      float angle = uFoldTop * 3.13;
      pos = rotateAround(pos, angle, vec3(1.0, 0.0, 0.0), vec3(0.0, hingeT, rT));
      vShadow -= uFoldTop * 0.15;
    }

    vec3 objectNormal = vec3(0.0, 0.0, 1.0);
    vNormal = normalize(normalMatrix * objectNormal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vShadow;

  uniform vec3 uColor;         // Màu mặt ngoài
  uniform vec3 uInnerColor;    // Màu mặt trong
  
  uniform sampler2D uAlphaMap;    // Hình dáng cắt phong bì
  uniform sampler2D uUserTexture; // Ảnh người dùng upload
  uniform bool uHasTexture;       // Cờ kiểm tra có ảnh hay không
  uniform sampler2D uGrainMap;    // Vân giấy

  void main() {
    // 1. Cắt hình dáng phong bì (Alpha Mask)
    vec4 alphaColor = texture2D(uAlphaMap, vUv);
    if (alphaColor.r < 0.1) discard;

    vec3 finalSurfaceColor;

    // 2. Logic phân biệt Mặt Trong / Mặt Ngoài
    if (gl_FrontFacing) {
      // --- MẶT TRONG ---
      finalSurfaceColor = uInnerColor; 
    } else {
      // --- MẶT NGOÀI ---
      finalSurfaceColor = uColor;
      
      if (uHasTexture) {
        vec4 userTex = texture2D(uUserTexture, vUv);
        finalSurfaceColor *= userTex.rgb; 
      }
    }

    // 3. Hiệu ứng vân giấy
    vec4 grain = texture2D(uGrainMap, vUv * 1.5);
    vec3 finalColor = finalSurfaceColor * grain.rgb;

    // 4. Ánh sáng
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0)); 
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    vec3 lighting = (vec3(0.6) + vec3(0.4) * diff) * vShadow;
    
    gl_FragColor = vec4(finalColor * lighting, 1.0);
  }
`;

// ==========================================================
// PHẦN 2: SHADER CHO LÁ THƯ (LETTER) - GẬP ĐÔI
// ==========================================================

export const letterVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vShadow;

  uniform float uUnfold; // Biến điều khiển mở thư

  vec3 rotateAround(vec3 p, float angle, vec3 axis, vec3 origin) {
    vec3 diff = p - origin;
    float c = cos(angle);
    float s = sin(angle);
    float t = 1.0 - c;
    vec3 rotation = diff * c + cross(axis, diff) * s + axis * dot(axis, diff) * t;
    return origin + rotation;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    vec3 objectNormal = vec3(0.0, 0.0, 1.0);
    vShadow = 1.0;

    // --- LOGIC GẬP ĐÔI (HINGE = 0.0) ---
    float hinge = 0.0; 
    float maxAngle = 3.14; // 180 độ
    float currentAngle = maxAngle * (1.0 - uUnfold);

    // Xử lý nếp gấp nửa trên của tờ giấy
    if (pos.y > hinge) {
      pos = rotateAround(pos, currentAngle, vec3(1.0, 0.0, 0.0), vec3(0.0, hinge, 0.01)); 
      
      // Điều chỉnh pháp tuyến
      if (uUnfold < 0.9) objectNormal = vec3(0.0, -1.0, 0.5); 
      
      // Bóng đổ khe gấp
      vShadow -= (1.0 - uUnfold) * 0.4;
    }

    vNormal = normalize(normalMatrix * objectNormal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const letterFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vShadow;

  uniform vec3 uColor;          // Màu giấy
  uniform sampler2D uMap;       // Nội dung thư
  uniform bool uHasMap;
  uniform float uRoughness;
  uniform sampler2D uGrainMap;  // Vân giấy

  void main() {
    vec3 color = uColor;
    
    if (uHasMap) {
      vec4 texColor = texture2D(uMap, vUv);
      color *= texColor.rgb;
    }

    vec4 grain = texture2D(uGrainMap, vUv * 2.0); 
    color *= grain.rgb; 

    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    vec3 lighting = (vec3(0.6) + vec3(0.4) * diff) * vShadow;

    gl_FragColor = vec4(color * lighting, 1.0);
  }
`;