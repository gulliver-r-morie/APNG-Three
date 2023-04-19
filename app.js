const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(1200, 835);
document.body.appendChild(renderer.domElement);

// 背景画像を追加
const bgTexture = new THREE.TextureLoader().load(
  "img/bg_texture.png",

  (texture) => {
    // 画像の元のサイズを取得
    const imgWidth = texture.image.width;
    const imgHeight = texture.image.height;

    // 画像のアスペクト比を計算
    const aspectRatio = imgWidth / imgHeight;

    // ウィンドウの高さに合わせてスケールを設定
    const screenHeight = window.innerHeight / 1.2;
    const screenWidth = screenHeight * aspectRatio;

    // 背景スプライトのスケールを設定
    bgSprite.scale.set(screenWidth, screenHeight, 1);
  }
);
const bgMaterial = new THREE.SpriteMaterial({ map: bgTexture });
const bgSprite = new THREE.Sprite(bgMaterial);
bgSprite.position.z = 0;
scene.add(bgSprite);

// // 建物の画像を追加
// const buildingTexture = new THREE.TextureLoader().load(
//   "img/apng_demo.png",
//   (texture) => {
//     // 画像の元のサイズを取得
//     const imgWidth = texture.image.width;
//     const imgHeight = texture.image.height;

//     // 画像のアスペクト比を計算
//     const aspectRatio = imgWidth / imgHeight;

//     // ウィンドウの高さに合わせてスケールを設定
//     const screenHeight = window.innerHeight / 1.2;
//     const screenWidth = screenHeight * aspectRatio;

//     // 建物スプライトのスケールを設定
//     buildingSprite.scale.set(screenWidth, screenHeight, 1);
//   }
// );
// const buildingMaterial = new THREE.SpriteMaterial({ map: buildingTexture, transparent: true });
// const buildingSprite = new THREE.Sprite(buildingMaterial);
// buildingSprite.position.z = 2;
// scene.add(buildingSprite);

// 背景の木たちを追加
const bgTextureTrees = new THREE.TextureLoader().load(
  "img/bg_trees.png",
  (texture) => {
    // 画像の元のサイズを取得
    const imgWidth = texture.image.width;
    const imgHeight = texture.image.height;

    // 画像のアスペクト比を計算
    const aspectRatio = imgWidth / imgHeight;

    // ウィンドウの高さに合わせてスケールを設定
    const screenHeight = window.innerHeight / 1.2;
    const screenWidth = screenHeight * aspectRatio;

    // 背景スプライトのスケールを設定
    bgSpriteTrees.scale.set(screenWidth, screenHeight, 1);
  }
);
const bgMaterialTrees = new THREE.SpriteMaterial({ map: bgTextureTrees });
const bgSpriteTrees = new THREE.Sprite(bgMaterialTrees);
bgSpriteTrees.position.z = 3;
scene.add(bgSpriteTrees);

// 車の画像を追加
const newCarTexture = new THREE.TextureLoader().load("img/car1_up.png");
const carTexture = new THREE.TextureLoader().load(
  "img/track.png",
  (texture) => {
    // 画像の元のサイズを取得
    const imgWidth = texture.image.width;
    const imgHeight = texture.image.height;
    // 車のスプライトを適切なスケールに設定
    carSprite.scale.set(imgWidth / 2, imgHeight / 2, 1);
  }
);
const carMaterial = new THREE.SpriteMaterial({
  map: carTexture,
  transparent: true,
});
const carSprite = new THREE.Sprite(carMaterial);

// 車のz座標を2に設定
carSprite.position.set(
  -window.innerWidth / 2 + -160,
  -window.innerHeight / 2 + 600,
  2
);

scene.add(carSprite);

// カメラを設定
camera.position.z = 10;

// アニメーション関数
function animateCar() {
  // 振動の強さと周波数を設定
  const vibrationStrength = 1;
  const vibrationFrequency = 0.1;

  // 現在時刻を取得
  const time = performance.now() * vibrationFrequency;

  // 振動を追加
  carSprite.position.x += Math.sin(time) * vibrationStrength;
  carSprite.position.y += Math.cos(time) * vibrationStrength;

  // 車が特定の地点（例：x座標が18）に到達したら、画像を差し替える
  if (
    carSprite.position.x > 0 &&
    carSprite.userData.changeImage === undefined
  ) {
    carSprite.userData.changeImage = true;

    // 新しい画像に差し替え
    carSprite.material.map = newCarTexture;
    carSprite.material.needsUpdate = true;

    // 60度半時計回りに回転させるための速度ベクトルを計算
    const angle = 60 * (Math.PI / 180); // 60度をラジアンに変換
    const currentSpeed = new THREE.Vector2(2 / 3, -1.1 / 3);
    const rotationMatrix = new THREE.Matrix3().set(
      Math.cos(angle),
      -Math.sin(angle),
      0,
      Math.sin(angle),
      Math.cos(angle),
      0,
      0,
      0,
      1
    );
    const newSpeed = currentSpeed.applyMatrix3(rotationMatrix);

    carSprite.userData.vx = newSpeed.x;
    carSprite.userData.vy = newSpeed.y;
  }

  // 車を移動
  const vx = carSprite.userData.vx || 2 / 3;
  const vy = carSprite.userData.vy || -1.1 / 3;
  carSprite.position.x += vx;
  carSprite.position.y += vy;

  // 画面外に出たら左から再度登場し、上に戻す
  if (carSprite.position.x > window.innerWidth / 2 + 100) {
    carSprite.position.x = -window.innerWidth / 2 - 100;
    carSprite.position.y = window.innerHeight / 2 - 50;
    carSprite.userData.changeImage = undefined;
    carSprite.userData.vx = 2 / 3;
    carSprite.userData.vy = -1.1 / 3;
    carSprite.material.map = carTexture; // 画像を元に戻す
    carSprite.material.needsUpdate = true;
  }

  // アニメーションループ
  requestAnimationFrame(animateCar);

  // レンダリング
  renderer.render(scene, camera);
}

// アニメーションを開始
animateCar();
