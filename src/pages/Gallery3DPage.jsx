import { Suspense, useMemo, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

import pics from "src/data/pics";
import "./Gallery3DPage.scss";

// Proof of concept: a simple rectangular room with a handful of paintings
// hung on the walls, navigable with tank-style keyboard controls only (no
// mouse): forward/back moves along the direction you're facing, left/right
// turns you in place. The camera never pitches up or down, so the view
// always stays level — like classic Doom/Wolfenstein-style movement.
//
// Three.js uses a right-handed, Y-up coordinate system: X is left/right,
// Y is up/down, Z is forward/back (with the camera looking down -Z by
// default). All positions and rotations below are in that space, with the
// room centered on the origin.

const ROOM_WIDTH = 20; // room size along X, in arbitrary "meters"
const ROOM_DEPTH = 20; // room size along Z
const WALL_HEIGHT = 5;
const PAINTING_Y = 2.2; // height of painting centers off the floor
const MOVE_SPEED = 6; // units per second for forward/back movement
const ROTATE_SPEED = 2.2; // radians per second for turning left/right

// Pick a handful of paintings for the POC rather than all 60+, so the scene
// stays light while we validate the navigation/rendering approach.
const featured = pics.slice(0, 8);

function Painting({ pic, position, rotationY }) {
  // useTexture (from drei) loads the image via Three's TextureLoader and
  // suspends the component until it's ready — that's why <Room> is wrapped
  // in <Suspense> below.
  const texture = useTexture(pic.img[0]);
  // Scale the picture plane to the source image's aspect ratio so paintings
  // don't look stretched, while keeping a fixed on-wall height.
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const height = 1.8;
  const width = height * aspect;

  return (
    // The group is positioned/rotated once per painting so the meshes inside
    // can be authored in local space (centered on 0,0,0) regardless of where
    // the painting ends up in the room.
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Frame: a flat box sitting slightly behind the canvas plane (z = -0.03)
          so it peeks out around the edges like a picture frame. */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[width + 0.15, height + 0.15, 0.06]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      {/* The painting itself: a plane textured with the artwork image. */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {/* Html renders a normal DOM element positioned in 3D space each frame.
          distanceFactor scales it down with distance (like real-world size);
          occlude hides it when a mesh is in front of it. */}
      <Html position={[0, -height / 2 - 0.25, 0]} center distanceFactor={8} occlude>
        <div className="gallery3d-label">{pic.title}</div>
      </Html>
    </group>
  );
}

function Room() {
  // Distribute paintings evenly around the four walls: paintings are handed
  // out to walls round-robin (i % 4), and each wall's paintings are spaced
  // out evenly along its length using the "slot index on that wall" (t).
  const wallPositions = useMemo(() => {
    const positions = [];
    const n = featured.length;
    for (let i = 0; i < n; i++) {
      const wall = i % 4; // which wall: 0=back, 1=front, 2=left, 3=right
      const t = Math.floor(i / 4) + 1; // this painting's slot index on that wall (1-based)
      // +1 in the denominator leaves a gap at both ends of the wall instead
      // of butting paintings right up against the corners.
      const spacing = ROOM_WIDTH / (Math.ceil(n / 4) + 1);
      const offset = -ROOM_WIDTH / 2 + spacing * t;

      // Each wall's painting is nudged 0.05 units in front of the wall
      // surface (to avoid z-fighting) and rotated to face into the room.
      if (wall === 0) {
        positions.push({ pos: [offset, PAINTING_Y, -ROOM_DEPTH / 2 + 0.05], rot: 0 });
      } else if (wall === 1) {
        positions.push({ pos: [offset, PAINTING_Y, ROOM_DEPTH / 2 - 0.05], rot: Math.PI });
      } else if (wall === 2) {
        positions.push({ pos: [-ROOM_WIDTH / 2 + 0.05, PAINTING_Y, offset], rot: Math.PI / 2 });
      } else {
        positions.push({ pos: [ROOM_WIDTH / 2 - 0.05, PAINTING_Y, offset], rot: -Math.PI / 2 });
      }
    }
    return positions;
  }, []);

  return (
    <group>
      {/* Floor: a horizontal plane. Planes are created facing +Z by default,
          so it's rotated -90° about X to lie flat and face up (+Y). */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#d8d4cb" />
      </mesh>
      {/* Ceiling: rotated the opposite way (+90° about X) so its front face
          points down (-Y) into the room, otherwise it would be invisible
          from below (Three culls back faces by default). */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WALL_HEIGHT, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#f2f2f2" />
      </mesh>
      {/* Back wall: no rotation needed, its default +Z-facing front already
          points toward the room's center (+Z direction). */}
      <mesh position={[0, WALL_HEIGHT / 2, -ROOM_DEPTH / 2]}>
        <planeGeometry args={[ROOM_WIDTH, WALL_HEIGHT]} />
        <meshStandardMaterial color="#eae7df" />
      </mesh>
      {/* Front wall: rotated 180° so its front face points back toward -Z,
          i.e. into the room instead of out of it. */}
      <mesh position={[0, WALL_HEIGHT / 2, ROOM_DEPTH / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM_WIDTH, WALL_HEIGHT]} />
        <meshStandardMaterial color="#eae7df" />
      </mesh>
      {/* Left wall: rotated 90° about Y so its front face points toward +X
          (into the room). */}
      <mesh position={[-ROOM_WIDTH / 2, WALL_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH, WALL_HEIGHT]} />
        <meshStandardMaterial color="#eae7df" />
      </mesh>
      {/* Right wall: rotated -90° about Y so its front face points toward -X. */}
      <mesh position={[ROOM_WIDTH / 2, WALL_HEIGHT / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH, WALL_HEIGHT]} />
        <meshStandardMaterial color="#eae7df" />
      </mesh>

      {featured.map((pic, i) => (
        <Painting key={pic.slug} pic={pic} position={wallPositions[i].pos} rotationY={wallPositions[i].rot} />
      ))}
    </group>
  );
}

function FirstPersonRig() {
  const { camera } = useThree();
  // Keys are tracked in a ref (not state) so key presses don't trigger React
  // re-renders — useFrame reads the latest values directly every frame instead.
  const keys = useRef({});
  // Current facing angle (yaw) in radians, turned by left/right input. Kept
  // in a ref rather than derived from camera.rotation.y each frame so it
  // accumulates smoothly regardless of anything else touching the camera.
  const yaw = useRef(0);

  // useMemo here isn't caching a value — it's a one-time-on-mount trick to
  // attach the keyboard listeners exactly once and clean them up on unmount,
  // similar to how useEffect(() => {...}, []) would be used outside R3F.
  useMemo(() => {
    const onKeyDown = (e) => (keys.current[e.code] = true);
    const onKeyUp = (e) => (keys.current[e.code] = false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // useFrame runs once per rendered frame (driven by requestAnimationFrame),
  // giving us `delta` (seconds since the last frame) so movement/turn speed
  // stays consistent regardless of frame rate.
  useFrame((_, delta) => {
    // Forward/back only comes from W/S or up/down arrows now — left/right
    // arrows are reserved for turning instead of strafing.
    const forward =
      Number(!!keys.current["KeyW"] || !!keys.current["ArrowUp"]) -
      Number(!!keys.current["KeyS"] || !!keys.current["ArrowDown"]);
    // A/D still strafe sideways without turning, complementing the arrow
    // keys' turn-in-place behavior.
    const strafe = Number(!!keys.current["KeyD"]) - Number(!!keys.current["KeyA"]);
    // Left/right arrows rotate the view instead of moving sideways — tank
    // controls rather than a mouse-look FPS scheme.
    const turn = Number(!!keys.current["ArrowLeft"]) - Number(!!keys.current["ArrowRight"]);

    yaw.current += turn * ROTATE_SPEED * delta;
    // Setting all three Euler components each frame (rather than just .y)
    // guarantees pitch and roll stay at 0 — the camera can never tilt up,
    // down, or sideways, only turn left/right while staying level.
    camera.rotation.set(0, yaw.current, 0);

    // Forward direction is derived from yaw directly (rather than reading
    // it back off the camera) since yaw is our single source of truth for
    // facing direction now that nothing else (like mouse look) can rotate
    // the camera. This matches Three's convention that a camera with
    // rotation.y = 0 faces -Z.
    const dir = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3().crossVectors(dir, camera.up).normalize();

    if (forward !== 0 || strafe !== 0) {
      const move = new THREE.Vector3()
        .addScaledVector(dir, forward)
        .addScaledVector(right, strafe)
        // Normalize before scaling so diagonal movement (forward + strafe)
        // isn't faster than moving in a single direction.
        .normalize()
        .multiplyScalar(MOVE_SPEED * delta);
      camera.position.add(move);
    }

    // Clamp the camera inside the room so you can't walk through walls.
    // Eye height is fixed since there's no fly/crouch — everything stays
    // on the same level, per the "no looking up/down" requirement.
    const bound = ROOM_WIDTH / 2 - 0.5;
    camera.position.x = Math.max(-bound, Math.min(bound, camera.position.x));
    camera.position.z = Math.max(-bound, Math.min(bound, camera.position.z));
    camera.position.y = 1.7;
  });

  return null;
}

export default function Gallery3DPage() {
  return (
    <div className="gallery3d-page">
      <div className="gallery3d-overlay">
        <p>Arrow keys or WASD: up/down (W/S) to move, left/right to turn. A/D to strafe. No mouse needed.</p>
      </div>
      <Canvas shadows camera={{ fov: 70, position: [0, 1.7, 6] }}>
        {/* Flat ambient fill so unlit sides of paintings/walls aren't pitch
            black, plus one point light near the ceiling as the "room light". */}
        <ambientLight intensity={0.6} />
        <pointLight position={[0, WALL_HEIGHT - 0.3, 0]} intensity={0.8} />
        {/* Suspense shows nothing (fallback={null}) while painting textures
            load, then reveals the whole room at once rather than paintings
            popping in one by one. */}
        <Suspense fallback={null}>
          <Room />
        </Suspense>
        <FirstPersonRig />
      </Canvas>
    </div>
  );
}
