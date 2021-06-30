var width = window.innerWidth; // 画布的宽度
var height = window.innerHeight; // 画布的高度
const depth = 500

const halfWidth = width / 2;
const halfHeight = height / 2;

import * as THREE from '../common/three.js';
// 渲染器
var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(width, height);
// 将canvas添加到指定元素
var element = document.getElementById('snowBackground');
element.appendChild(renderer.domElement);

// 场景
var scene = new THREE.Scene();
// 正交投影摄像机
var camera = new THREE.PerspectiveCamera(45, width/height, 2, depth);
camera.position.set(0, 0, depth); // 摄像机位置
// 照相机默认沿z轴负方向观察，通过设置lookAt的位置可以改变观察的方向
// camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// 平面几何体
var planeGeometry = new THREE.PlaneGeometry(width, height);
// planeGeometry.translate(0, 0, -470); // 平面几何体位置
// 背景纹理
var texture = new THREE.TextureLoader().load('./assets/snow_bg.jpeg');
console.log(planeGeometry.attributes.position)
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// uv两个方向纹理重复数量

// 背景材料
var planeMaterial = new THREE.MeshBasicMaterial({
    map: texture
});
var mesh = new THREE.Mesh(planeGeometry, planeMaterial); //网格模型对象Mesh
scene.add(mesh); //网格模型添加到场景中


/**
 * 添加花瓣粒子
**/

var typeNum = 1; // 雪花种类
var range = 20; // 雪花出现范围

// 加载雨滴理贴图
var textureTree = new THREE.TextureLoader().load("./assets/snowflake.png");
var group = new THREE.Group();

for (var k = 0; k < typeNum; k++) {
    var spriteMaterial  = new THREE.SpriteMaterial({ map: textureTree });
    for (var i = 0; i < 50; i++) {
        // 随机生成雪花的位置
        var sprite = new THREE.Sprite(spriteMaterial);
        scene.add(sprite);
        // 控制精灵大小,
        sprite.scale.set(4, 2, 1); //// 只需要设置x、y两个分量就可以
        const velocityY = 0.05 + Math.random() / 3;
        const velocityX = (Math.random() - 0.5) / 3;
        const velocityZ = (Math.random() - 0.5) / 3;
        sprite.velocityY = velocityY
        sprite.velocityX = velocityX
        sprite.velocityZ = velocityZ
        getInitPos(sprite)
        group.add(sprite);
    }
}

scene.add(group) // 雨滴群组插入场景中

function getInitPos (sprite) {
    const k = Math.random() - 0.5
    // 设置精灵模型位置，在整个空间上上随机分布
    const x = Math.tan(45 / 2) * k * width
    const z = Math.random() * depth
    const y = Math.tan(45 / 2) * depth * ((depth - z) / (depth - 2))
    // sprite.position.set(k * width, halfHeight + k * range, Math.random() * depth)
    sprite.originZ = z
    sprite.position.x = x
    sprite.position.y = y
    sprite.position.z = z
}

function render () {
    // 每次渲染遍历雨滴群组，刷新频率30~60FPS，两帧时间间隔16.67ms~33.33ms
    // 每次渲染都会更新雨滴的位置，进而产生动画效果
    const y = Math.tan(45 / 2) * depth * ((depth - sprite.originZ) / (depth - 2)) + range
    group.children.forEach(sprite => {
        // 移动
        sprite.position.x = sprite.position.x - sprite.velocityX;
        sprite.position.y = sprite.position.y - sprite.velocityY;
        sprite.position.z = sprite.position.z - sprite.velocityZ;
        // getInitPos()



        if (sprite.position.y < -y) {
            // 如果雨滴落到地面，重置y，从新下落
            getInitPos(sprite)
        }
    });
    renderer.render(scene, camera); //执行渲染操作
    requestAnimationFrame(render);//请求再次执行渲染函数render，渲染下一帧
}

render()
