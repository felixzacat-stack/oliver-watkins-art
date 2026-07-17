import { Suspense, useMemo, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

import pics from "src/data/pics";
import "./Gallery3DPage.scss";

// Proof of concept: four rectangular rooms arranged in a 2x2 grid (a
// square), each adjoining its two orthogonal neighbors through a doorway —
// four doorways total, with no diagonal connection. A handful of paintings
// hang on the walls of each room. Navigable with tank-style keyboard
// controls only (no mouse): forward/back moves along the direction you're
// facing, left/right turns you in place. The camera never pitches up or
// down, so the view always stays level — like classic Doom/Wolfenstein-
// style movement.
//
// Three.js uses a right-handed, Y-up coordinate system: X is left/right,
// Y is up/down, Z is forward/back (with the camera looking down -Z by
// default). All positions and rotations below are in that space.
//
// Room A is centered on the origin. Rooms B, C, D are the same size, offset
// along +Z and/or +X by one room depth/width so they tile edge-to-edge:
// B is south of A (+Z), C is east of A (+X), D is east of B / south of C.
// Doorway ownership always flows toward +X/+Z — a room's front or right
// wall is the one that (optionally) carries a doorway and is rendered
// double-sided, while its back or left wall is either solid (a dead end,
// no neighbor there) or omitted entirely when a neighboring room already
// owns that shared boundary. Two rooms both drawing the same boundary wall
// would coincide and z-fight, which is why only one side ever renders it.
// The four doorways form a cycle — A-B, C-D, A-C, B-D — with no diagonal
// shortcut between B and D.

const ROOM_WIDTH = 20; // room size along X, in arbitrary "meters"
const ROOM_DEPTH = 20; // room size along Z
const WALL_HEIGHT = 5;
const PAINTING_Y = 2.2; // height of painting centers off the floor
const MOVE_SPEED = 6; // units per second for forward/back movement
const ROTATE_SPEED = 2.2; // radians per second for turning left/right

const DOORWAY_WIDTH = 2.6;
const DOORWAY_HEIGHT = 3.2; // leaves a lintel above, short of the 5-unit ceiling
// A noticeably darker shade for walls that carry a doorway, so they read as
// a distinct "this is an opening" surface rather than blending into the
// plain walls (#eae7df) or the floor (#d8d4cb).
const DOORWAY_WALL_COLOR = "#a8a396";
const ROOM_B_OFFSET_Z = ROOM_DEPTH; // Room B's center, one room-depth along +Z from Room A's
const ROOM_C_OFFSET_X = ROOM_WIDTH; // Room C's center, one room-width along +X from Room A's

// Walls are numbered back=0 (-Z), front=1 (+Z), left=2 (-X), right=3 (+X).
// Each room's front and/or right wall may carry a doorway (and so can't
// hold paintings), and a room's back/left wall is sometimes omitted
// entirely because a neighboring room already draws that shared boundary —
// so each room ends up with only two solid walls available for paintings.
const ROOM_A_PAINTING_WALLS = [0, 2];
const ROOM_B_PAINTING_WALLS = [1, 2];
const ROOM_C_PAINTING_WALLS = [0, 3];
const ROOM_D_PAINTING_WALLS = [1, 3];

// Pick a handful of paintings per room for the POC. There are exactly 32
// paintings in src/data/pics.js, so 8 per room uses the full set.
const featuredA = pics.slice(0, 8);
const featuredB = pics.slice(8, 16);
const featuredC = pics.slice(16, 24);
const featuredD = pics.slice(24, 32);

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
      {/* Frame: a flat box sitting behind the canvas plane so it peeks out
          around the edges like a picture frame. Positioned so its front
          face lands at z = -0.03, clear of the painting plane at z = 0 —
          coplanar surfaces would z-fight and flicker as the camera moves. */}
      <mesh position={[0, 0, -0.06]}>
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

// A flat wall plane, optionally with a doorway cut into it. Without a
// doorway it's just a single plane. With one, it's built from three
// pieces — left segment, right segment, and a lintel above the opening —
// so there's a genuine gap in the geometry to walk through rather than an
// invisible/no-collision wall. Authored in local space (matching a plain
// <planeGeometry>: origin at the wall's center, local X along its width,
// local Y up its height) so the doorway is always horizontally centered,
// then positioned/rotated like any other wall mesh.
function Wall({ width, height, position, rotation, color = "#eae7df", doorway, doubleSided = false }) {
  // A plane only renders its front face by default (THREE.FrontSide) — fine
  // for walls seen from inside a single room, but a wall shared between two
  // rooms (one on each side of it) needs THREE.DoubleSide, or it vanishes
  // when viewed from the far side.
  const side = doubleSided ? THREE.DoubleSide : THREE.FrontSide;

  if (!doorway) {
    return (
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={color} side={side} />
      </mesh>
    );
  }

  const sideWidth = (width - doorway.width) / 2;
  const lintelHeight = height - doorway.height;

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[-(doorway.width / 2 + sideWidth / 2), 0, 0]}>
        <planeGeometry args={[sideWidth, height]} />
        <meshStandardMaterial color={color} side={side} />
      </mesh>
      <mesh position={[doorway.width / 2 + sideWidth / 2, 0, 0]}>
        <planeGeometry args={[sideWidth, height]} />
        <meshStandardMaterial color={color} side={side} />
      </mesh>
      {lintelHeight > 0 && (
        <mesh position={[0, doorway.height / 2, 0]}>
          <planeGeometry args={[doorway.width, lintelHeight]} />
          <meshStandardMaterial color={color} side={side} />
        </mesh>
      )}
    </group>
  );
}

function Room({
  offsetX,
  offsetZ,
  paintings,
  paintingWalls,
  hasBackWall,
  hasFrontDoorway,
  hasLeftWall,
  hasRightDoorway,
}) {
  // Distribute paintings evenly around the room's available walls (the ones
  // listed in paintingWalls — a wall with a doorway, or no wall at all,
  // can't hold paintings). Paintings are handed out round-robin, and each
  // wall's paintings are spaced out evenly along its length using the
  // "slot index on that wall" (t).
  const wallPositions = useMemo(() => {
    const positions = [];
    const n = paintings.length;
    const wallCount = paintingWalls.length;
    for (let i = 0; i < n; i++) {
      const wall = paintingWalls[i % wallCount];
      const t = Math.floor(i / wallCount) + 1; // this painting's slot index on that wall (1-based)
      // +1 in the denominator leaves a gap at both ends of the wall instead
      // of butting paintings right up against the corners.
      const spacing = ROOM_WIDTH / (Math.ceil(n / wallCount) + 1);
      const offset = -ROOM_WIDTH / 2 + spacing * t;

      // Each wall's painting is nudged 0.05 units in front of the wall
      // surface (to avoid z-fighting) and rotated to face into the room.
      if (wall === 0) {
        positions.push({ pos: [offsetX + offset, PAINTING_Y, offsetZ - ROOM_DEPTH / 2 + 0.05], rot: 0 });
      } else if (wall === 1) {
        positions.push({ pos: [offsetX + offset, PAINTING_Y, offsetZ + ROOM_DEPTH / 2 - 0.05], rot: Math.PI });
      } else if (wall === 2) {
        positions.push({ pos: [offsetX - ROOM_WIDTH / 2 + 0.05, PAINTING_Y, offsetZ + offset], rot: Math.PI / 2 });
      } else {
        positions.push({ pos: [offsetX + ROOM_WIDTH / 2 - 0.05, PAINTING_Y, offsetZ + offset], rot: -Math.PI / 2 });
      }
    }
    return positions;
  }, [offsetX, offsetZ, paintings, paintingWalls]);

  return (
    <group>
      {/* Floor: a horizontal plane. Planes are created facing +Z by default,
          so it's rotated -90° about X to lie flat and face up (+Y). */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[offsetX, 0, offsetZ]} receiveShadow>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#d8d4cb" />
      </mesh>
      {/* Ceiling: rotated the opposite way (+90° about X) so its front face
          points down (-Y) into the room, otherwise it would be invisible
          from below (Three culls back faces by default). */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[offsetX, WALL_HEIGHT, offsetZ]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_DEPTH]} />
        <meshStandardMaterial color="#f2f2f2" />
      </mesh>
      {/* Back wall: no rotation needed, its default +Z-facing front already
          points toward the room's center (+Z direction). Omitted for a room
          whose back boundary is actually another room's doorway wall. */}
      {hasBackWall && (
        <Wall
          width={ROOM_WIDTH}
          height={WALL_HEIGHT}
          position={[offsetX, WALL_HEIGHT / 2, offsetZ - ROOM_DEPTH / 2]}
          rotation={[0, 0, 0]}
        />
      )}
      {/* Front wall: rotated 180° so its front face points back toward -Z,
          i.e. into the room instead of out of it. Gets a doorway cut into
          it when this room connects to another one along +Z. */}
      <Wall
        width={ROOM_WIDTH}
        height={WALL_HEIGHT}
        position={[offsetX, WALL_HEIGHT / 2, offsetZ + ROOM_DEPTH / 2]}
        rotation={[0, Math.PI, 0]}
        color={hasFrontDoorway ? DOORWAY_WALL_COLOR : undefined}
        doorway={hasFrontDoorway ? { width: DOORWAY_WIDTH, height: DOORWAY_HEIGHT } : null}
        doubleSided={hasFrontDoorway}
      />
      {/* Left wall: rotated 90° about Y so its front face points toward +X
          (into the room). Omitted for a room whose left boundary is
          actually another room's doorway wall. */}
      {hasLeftWall && (
        <Wall
          width={ROOM_DEPTH}
          height={WALL_HEIGHT}
          position={[offsetX - ROOM_WIDTH / 2, WALL_HEIGHT / 2, offsetZ]}
          rotation={[0, Math.PI / 2, 0]}
        />
      )}
      {/* Right wall: rotated -90° about Y so its front face points toward
          -X. Gets a doorway cut into it when this room connects to another
          one along +X. */}
      <Wall
        width={ROOM_DEPTH}
        height={WALL_HEIGHT}
        position={[offsetX + ROOM_WIDTH / 2, WALL_HEIGHT / 2, offsetZ]}
        rotation={[0, -Math.PI / 2, 0]}
        color={hasRightDoorway ? DOORWAY_WALL_COLOR : undefined}
        doorway={hasRightDoorway ? { width: DOORWAY_WIDTH, height: DOORWAY_HEIGHT } : null}
        doubleSided={hasRightDoorway}
      />

      {paintings.map((pic, i) => (
        <Painting key={pic.slug} pic={pic} position={wallPositions[i].pos} rotationY={wallPositions[i].rot} />
      ))}
    </group>
  );
}

// Four point lights spread over a room (rather than one central light)
// avoid a single hot spot in the middle — see the decay note below.
function RoomLights({ offsetX, offsetZ }) {
  const positions = [
    [offsetX - ROOM_WIDTH / 4, WALL_HEIGHT - 0.3, offsetZ - ROOM_DEPTH / 4],
    [offsetX + ROOM_WIDTH / 4, WALL_HEIGHT - 0.3, offsetZ - ROOM_DEPTH / 4],
    [offsetX - ROOM_WIDTH / 4, WALL_HEIGHT - 0.3, offsetZ + ROOM_DEPTH / 4],
    [offsetX + ROOM_WIDTH / 4, WALL_HEIGHT - 0.3, offsetZ + ROOM_DEPTH / 4],
  ];
  return positions.map((pos, i) => <pointLight key={i} position={pos} intensity={2.2} decay={0} />);
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

    // Clamp the camera inside the 2x2 room grid so you can't walk through
    // walls. Eye height is fixed since there's no fly/crouch — everything
    // stays on the same level, per the "no looking up/down" requirement.
    //
    // There are two internal wall lines, one per axis: X = MID_X (between
    // the A/B column and the C/D column) and Z = MID_Z (between the A/C row
    // and the B/D row). Each line is solid except for two doorway gaps —
    // one per room-pair straddling it — so crossing either line requires
    // being aligned with whichever gap is relevant on the *other* axis.
    const doorwayHalfWidth = DOORWAY_WIDTH / 2 - 0.3; // margin so you can't clip the doorway's edges
    const xBound = ROOM_WIDTH / 2 - 0.5;
    const zBound = ROOM_DEPTH / 2 - 0.5;
    const xMin = -xBound;
    const xMax = ROOM_C_OFFSET_X + xBound;
    const zMin = -zBound;
    const zMax = ROOM_B_OFFSET_Z + zBound;
    const MID_X = ROOM_WIDTH / 2; // A/C's shared wall == B/D's shared wall
    const MID_Z = ROOM_DEPTH / 2; // A/B's shared wall == C/D's shared wall

    // X-axis: blocked by the MID_X line except through the A/C doorway
    // (centered at Z=0) or the B/D doorway (centered at Z=ROOM_B_OFFSET_Z).
    const nearXDoorway =
      Math.abs(camera.position.z - 0) <= doorwayHalfWidth ||
      Math.abs(camera.position.z - ROOM_B_OFFSET_Z) <= doorwayHalfWidth;

    if (nearXDoorway) {
      camera.position.x = Math.max(xMin, Math.min(xMax, camera.position.x));
    } else if (camera.position.x < MID_X) {
      camera.position.x = Math.max(xMin, Math.min(MID_X - 0.5, camera.position.x));
    } else {
      camera.position.x = Math.max(MID_X + 0.5, Math.min(xMax, camera.position.x));
    }

    // Z-axis: blocked by the MID_Z line except through the A/B doorway
    // (centered at X=0) or the C/D doorway (centered at X=ROOM_C_OFFSET_X).
    // Reads camera.position.x after the X clamp above has already run.
    const nearZDoorway =
      Math.abs(camera.position.x - 0) <= doorwayHalfWidth ||
      Math.abs(camera.position.x - ROOM_C_OFFSET_X) <= doorwayHalfWidth;

    if (nearZDoorway) {
      camera.position.z = Math.max(zMin, Math.min(zMax, camera.position.z));
    } else if (camera.position.z < MID_Z) {
      camera.position.z = Math.max(zMin, Math.min(MID_Z - 0.5, camera.position.z));
    } else {
      camera.position.z = Math.max(MID_Z + 0.5, Math.min(zMax, camera.position.z));
    }

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
            black, plus a few point lights near the ceiling of each room as
            "room lights". Three's physically-correct lighting attenuates
            point lights by distance squared (decay=2 by default), which
            would leave the far corners of a 20x20 room almost unlit —
            decay={0} keeps brightness constant regardless of distance. */}
        <ambientLight intensity={1.1} />
        <RoomLights offsetX={0} offsetZ={0} />
        <RoomLights offsetX={0} offsetZ={ROOM_B_OFFSET_Z} />
        <RoomLights offsetX={ROOM_C_OFFSET_X} offsetZ={0} />
        <RoomLights offsetX={ROOM_C_OFFSET_X} offsetZ={ROOM_B_OFFSET_Z} />
        {/* Suspense shows nothing (fallback={null}) while painting textures
            load, then reveals the whole scene at once rather than paintings
            popping in one by one. */}
        <Suspense fallback={null}>
          <Room
            offsetX={0}
            offsetZ={0}
            paintings={featuredA}
            paintingWalls={ROOM_A_PAINTING_WALLS}
            hasBackWall
            hasFrontDoorway
            hasLeftWall
            hasRightDoorway
          />
          <Room
            offsetX={0}
            offsetZ={ROOM_B_OFFSET_Z}
            paintings={featuredB}
            paintingWalls={ROOM_B_PAINTING_WALLS}
            hasBackWall={false}
            hasFrontDoorway={false}
            hasLeftWall
            hasRightDoorway
          />
          <Room
            offsetX={ROOM_C_OFFSET_X}
            offsetZ={0}
            paintings={featuredC}
            paintingWalls={ROOM_C_PAINTING_WALLS}
            hasBackWall
            hasFrontDoorway
            hasLeftWall={false}
            hasRightDoorway={false}
          />
          <Room
            offsetX={ROOM_C_OFFSET_X}
            offsetZ={ROOM_B_OFFSET_Z}
            paintings={featuredD}
            paintingWalls={ROOM_D_PAINTING_WALLS}
            hasBackWall={false}
            hasFrontDoorway={false}
            hasLeftWall={false}
            hasRightDoorway={false}
          />
        </Suspense>
        <FirstPersonRig />
      </Canvas>
    </div>
  );
}
