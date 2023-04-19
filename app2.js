// グローバル変数
let scene, camera, renderer, sprite;
let currentImageIndex = 0;
const numImages = 38;
const imageFilenames = Array.from(
  { length: numImages },
  (_, i) => `img/anim_demo/demo-${i + 1}.png`
);
const textures = [];

async function loadTextures() {
  const textureLoader = new THREE.TextureLoader();
  const loadTexture = (filename) =>
    new Promise((resolve) => {
      textureLoader.load(filename, resolve);
    });

  for (const filename of imageFilenames) {
    textures.push(await loadTexture(filename));
  }

  // 初期化とアニメーション開始
  init();
}
function init() {
  // シーンの作成
  scene = new THREE.Scene();

  // カメラの設定
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // レンダラーの設定
  renderer = new THREE.WebGLRenderer({ alpha: true }); // 透明度を有効にする
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // テクスチャローダーの初期化
  textureLoader = new THREE.TextureLoader();

  // スプライトの作成
  const initialTexture = textures[currentImageIndex];
  const spriteMaterial = new THREE.SpriteMaterial({
    map: initialTexture,
    transparent: true,
  });
  sprite = new THREE.Sprite(spriteMaterial);

  // スプライトのサイズをテクスチャのアスペクト比を保持して調整
  const aspectRatio = initialTexture.image.width / initialTexture.image.height;
  sprite.scale.set(2 * aspectRatio, 2, 1);

  scene.add(sprite);

  // アニメーション開始
  animate(0);
}

function animate(time) {
  requestAnimationFrame(animate);

  // 画像を切り替える
  switchImage(time);

  // レンダリング
  renderer.render(scene, camera);
}

function switchImage(time) {
  const interval = 50; // 画像を切り替える間隔（ミリ秒）
  if (time - (sprite.userData.lastSwitchTime || 0) >= interval) {
    currentImageIndex = (currentImageIndex + 1) % numImages;
    const newTexture = textures[currentImageIndex];
    sprite.material.map = newTexture;
    sprite.material.needsUpdate = true;
    sprite.userData.lastSwitchTime = time;

    // スプライトのサイズを新しいテクスチャのアスペクト比で調整
    const aspectRatio = newTexture.image.width / newTexture.image.height;
    sprite.scale.set(2 * aspectRatio, 2, 1);
  }
}

// テクスチャを読み込む
loadTextures();
