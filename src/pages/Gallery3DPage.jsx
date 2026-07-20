import { Suspense, useMemo, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

import pics from "src/data/pics";
import "./Gallery3DPage.scss";

// Proof of concept: rectangular rooms tiled into a GRID_COLS x GRID_ROWS
// grid, each adjoining every orthogonal neighbor through a doorway (no
// diagonal connections). Paintings hang on the walls of each room, spread
// across the whole grid. Navigable with tank-style keyboard controls only
// (no mouse): forward/back moves along the direction you're facing,
// left/right turns you in place. The camera never pitches up or down, so
// the view always stays level — like classic Doom/Wolfenstein-style
// movement.
//
// Three.js uses a right-handed, Y-up coordinate system: X is left/right,
// Y is up/down, Z is forward/back (with the camera looking down -Z by
// default). All positions and rotations below are in that space.
//
// The room at grid (row 0, col 0) is centered on the origin; every other
// room is offset along +X (by column * ROOM_WIDTH) and/or +Z (by row *
// ROOM_DEPTH) so they tile edge-to-edge. Doorway ownership always flows
// toward +X/+Z — a room's front or right wall is the one that (optionally)
// carries a doorway and is rendered double-sided, while its back or left
// wall is either solid (a dead end, no neighbor there) or omitted entirely
// when a neighboring room already owns that shared boundary. Two rooms
// both drawing the same boundary wall would coincide and z-fight, which is
// why only one side ever renders it. Every adjacent room pair is connected
// (a full grid graph, no diagonal shortcuts) — see ROOMS below.

const GRID_COLS = 2; // rooms across, along X
const GRID_ROWS = 3; // rooms deep, along Z
const ROOM_WIDTH = 16; // room size along X, in arbitrary "meters"
const ROOM_DEPTH = 16; // room size along Z
const WALL_HEIGHT = 3; // a realistic room ceiling height, in meters
// Standard gallery/museum hanging convention centers artwork around eye
// level, roughly 150cm off the floor — just below the camera's fixed
// 1.7m eye height, so paintings sit naturally in view while walking past.
const PAINTING_Y = 1.5;
const MOVE_SPEED = 6; // units per second for forward/back movement
const ROTATE_SPEED = 2.2; // radians per second for turning left/right
// Caps how often a new frame is requested while moving. Without this, a
// held movement key re-invalidates every rendered frame, so the scene
// renders at the monitor's full refresh rate (60/120/144Hz) — capping it
// trades visual smoothness for lower sustained CPU/GPU load while walking.
const MAX_FPS = 30;
const MIN_FRAME_INTERVAL_MS = 1000 / MAX_FPS;

const DOORWAY_WIDTH = 2.6;
const DOORWAY_HEIGHT = 2.4; // leaves a lintel above, short of the 3-unit ceiling
// A noticeably darker shade for walls that carry a doorway, so they read as
// a distinct "this is an opening" surface rather than blending into the
// plain walls (#eae7df) or the floor (#d8d4cb).
const DOORWAY_WALL_COLOR = "#a8a396";

// pics.js dimensions strings look like "(80cm by 60cm)" — <width>cm by
// <height>cm, matching the <width>_by_<height> image filename convention.
// Scene units are documented as "arbitrary meters" (see ROOM_WIDTH above),
// so cm values are converted 1:1 to meters.
const DIMENSIONS_CM_RE = /(\d+(?:\.\d+)?)\s*cm\s*by\s*(\d+(?:\.\d+)?)\s*cm/i;
const CM_TO_SCENE_UNITS = 1 / 100;
// Fallback on-wall height for the one painting whose dimensions field isn't
// parseable ("(xxx)"), roughly the median real painting height so it
// doesn't stick out among its now-correctly-sized neighbors.
const FALLBACK_HEIGHT = 0.6;
// How far the frame peeks out past the canvas on each side — a realistic
// ~5cm frame width, now that paintings are sized to their real dimensions.
const FRAME_PADDING = 0.05;

function parseDimensionsMeters(dimensions) {
  const match = DIMENSIONS_CM_RE.exec(dimensions ?? "");
  if (!match) return null;
  return {
    width: Number(match[1]) * CM_TO_SCENE_UNITS,
    height: Number(match[2]) * CM_TO_SCENE_UNITS,
  };
}

// Splits `total` items across `weights` (one weight per bucket) so each
// bucket's share is proportional to its weight, using the largest-remainder
// method so the integer counts still sum to exactly `total`.
function distributeByWeight(total, weights) {
  const weightSum = weights.reduce((sum, w) => sum + w, 0);
  const raw = weights.map((w) => (total * w) / weightSum);
  const counts = raw.map(Math.floor);
  let remainder = total - counts.reduce((sum, c) => sum + c, 0);
  const byFractionDesc = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < remainder; k++) counts[byFractionDesc[k].i] += 1;
  return counts;
}

// Walls are numbered back=0 (-Z), front=1 (+Z), left=2 (-X), right=3 (+X).
// Build the room grid: for each cell, a room's back/left walls only exist
// when there's no neighbor there to own that shared boundary (row 0 / col
// 0), and its front/right walls carry a doorway whenever a neighbor exists
// to the south/east. A wall that exists and has no doorway is available
// for hanging paintings — interior rooms (with doorways on both front and
// right) can end up with only one free wall, which is expected for a
// "connector" room sitting between two others.
const ROOMS = [];
for (let row = 0; row < GRID_ROWS; row++) {
  for (let col = 0; col < GRID_COLS; col++) {
    const hasBackWall = row === 0;
    const hasLeftWall = col === 0;
    const hasFrontDoorway = row < GRID_ROWS - 1;
    const hasRightDoorway = col < GRID_COLS - 1;
    const paintingWalls = [0, 1, 2, 3].filter(
      (wall) =>
        (wall === 0 && hasBackWall) ||
        (wall === 1 && !hasFrontDoorway) ||
        (wall === 2 && hasLeftWall) ||
        (wall === 3 && !hasRightDoorway),
    );
    ROOMS.push({
      offsetX: col * ROOM_WIDTH,
      offsetZ: row * ROOM_DEPTH,
      hasBackWall,
      hasLeftWall,
      hasFrontDoorway,
      hasRightDoorway,
      paintingWalls,
    });
  }
}

// Spread every painting in pics.js across the 6 rooms, weighted by how many
// free walls each room actually has — otherwise a 1-wall connector room
// would get just as many paintings as a 2-wall room and end up crowded.
const roomPaintingCounts = distributeByWeight(
  pics.length,
  ROOMS.map((room) => room.paintingWalls.length),
);
let paintingCursor = 0;
for (let i = 0; i < ROOMS.length; i++) {
  const count = roomPaintingCounts[i];
  ROOMS[i].paintings = pics.slice(paintingCursor, paintingCursor + count);
  paintingCursor += count;
}

function Painting({ pic, position, rotationY }) {
  // useTexture (from drei) loads the image via Three's TextureLoader and
  // suspends the component until it's ready — that's why <Room> is wrapped
  // in <Suspense> below.
  const texture = useTexture(pic.img[0]);
  // Size the painting to its real-world dimensions (from pics.js) so
  // paintings on the wall are proportionate to each other, rather than all
  // sharing one fixed on-wall height. Falls back to an aspect-ratio-derived
  // size only for the rare painting whose dimensions aren't parseable.
  const real = parseDimensionsMeters(pic.dimensions);
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const height = real ? real.height : FALLBACK_HEIGHT;
  const width = real ? real.width : height * aspect;

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
        <boxGeometry args={[width + FRAME_PADDING, height + FRAME_PADDING, 0.06]} />
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
  const { camera, invalidate } = useThree();
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
    // With frameloop="demand" the Canvas only renders when invalidate() is
    // called, so a fresh keypress needs to kick off the first frame itself.
    const onKeyDown = (e) => {
      keys.current[e.code] = true;
      invalidate();
    };
    const onKeyUp = (e) => (keys.current[e.code] = false);
    // If the window loses focus while a key is held (alt-tab, clicking into
    // devtools, switching tabs), the browser never delivers the matching
    // keyup — that key stays stuck "down" forever, which with
    // frameloop="demand" means invalidate() keeps firing every frame
    // indefinitely, even though nothing is actually being pressed. Clearing
    // all keys on blur prevents that stuck state.
    const onBlur = () => (keys.current = {});
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [invalidate]);

  // useFrame runs once per rendered frame (driven by requestAnimationFrame),
  // giving us `delta` (seconds since the last frame) so movement/turn speed
  // stays consistent regardless of frame rate.
  useFrame((_, rawDelta) => {
    // With frameloop="demand" the render clock keeps ticking even while
    // idle (no frames rendered), so the first frame after a pause can
    // report a large delta — clamping it stops a resumed keypress from
    // applying a whole idle gap's worth of turn/movement in one jump.
    const delta = Math.min(rawDelta, 1 / 30);

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

    // Clamp the camera inside the GRID_COLS x GRID_ROWS room grid so you
    // can't walk through walls. Eye height is fixed since there's no
    // fly/crouch — everything stays on the same level, per the "no looking
    // up/down" requirement.
    //
    // Every room's front/right wall carries a doorway into its south/east
    // neighbor (see ROOMS above), so doorway gaps recur at every room
    // center along the cross axis: crossing a column boundary is only
    // possible while aligned (in Z) with some room's center, and crossing a
    // row boundary only while aligned (in X) with some room's center.
    // Away from a gap, the camera is clamped to the column/row band it's
    // currently in, so it can't clip through a solid stretch of wall.
    const doorwayHalfWidth = DOORWAY_WIDTH / 2 - 0.3; // margin so you can't clip the doorway's edges
    const MARGIN = 0.5; // keeps the camera from clipping into a solid wall
    const xMin = -(ROOM_WIDTH / 2 - MARGIN);
    const xMax = (GRID_COLS - 1) * ROOM_WIDTH + (ROOM_WIDTH / 2 - MARGIN);
    const zMin = -(ROOM_DEPTH / 2 - MARGIN);
    const zMax = (GRID_ROWS - 1) * ROOM_DEPTH + (ROOM_DEPTH / 2 - MARGIN);

    const nearRoomCenter = (value, cellSize) =>
      Math.abs(value - Math.round(value / cellSize) * cellSize) <= doorwayHalfWidth;

    // X-axis: crossing a column boundary requires being near some room's Z
    // center (a doorway on that row); otherwise stay within the current
    // column's band.
    if (nearRoomCenter(camera.position.z, ROOM_DEPTH)) {
      camera.position.x = Math.max(xMin, Math.min(xMax, camera.position.x));
    } else {
      const col = Math.max(0, Math.min(GRID_COLS - 1, Math.round(camera.position.x / ROOM_WIDTH)));
      const colCenter = col * ROOM_WIDTH;
      const low = Math.max(xMin, colCenter - ROOM_WIDTH / 2 + MARGIN);
      const high = Math.min(xMax, colCenter + ROOM_WIDTH / 2 - MARGIN);
      camera.position.x = Math.max(low, Math.min(high, camera.position.x));
    }

    // Z-axis: same idea, but the gap check uses camera.position.x after the
    // X clamp above has already run.
    if (nearRoomCenter(camera.position.x, ROOM_WIDTH)) {
      camera.position.z = Math.max(zMin, Math.min(zMax, camera.position.z));
    } else {
      const row = Math.max(0, Math.min(GRID_ROWS - 1, Math.round(camera.position.z / ROOM_DEPTH)));
      const rowCenter = row * ROOM_DEPTH;
      const low = Math.max(zMin, rowCenter - ROOM_DEPTH / 2 + MARGIN);
      const high = Math.min(zMax, rowCenter + ROOM_DEPTH / 2 - MARGIN);
      camera.position.z = Math.max(low, Math.min(high, camera.position.z));
    }

    camera.position.y = 1.7;

    // frameloop="demand" only renders in response to invalidate() — with
    // movement/turning applied above, keep requesting the next frame so
    // motion stays smooth. The moment every key is released, this stops
    // firing and rendering (and CPU usage) drops back to idle. The request
    // is delayed (rather than invalidating immediately) to cap the rate at
    // MAX_FPS instead of re-rendering on every monitor refresh.
    if (forward !== 0 || strafe !== 0 || turn !== 0) {
      setTimeout(invalidate, MIN_FRAME_INTERVAL_MS);
    }
  });

  return null;
}

export default function Gallery3DPage() {
  return (
    <div className="gallery3d-page">
      <div className="gallery3d-overlay">
        <p>Arrow keys or WASD: up/down (W/S) to move, left/right to turn. A/D to strafe. No mouse needed.</p>
      </div>
      <Canvas shadows frameloop="demand" camera={{ fov: 70, position: [0, 1.7, 6] }}>
        {/* Flat ambient fill so unlit sides of paintings/walls aren't pitch
            black, plus a few point lights near the ceiling of each room as
            "room lights". Three's physically-correct lighting attenuates
            point lights by distance squared (decay=2 by default), which
            would leave the far corners of a room almost unlit — decay={0}
            keeps brightness constant regardless of distance. */}
        <ambientLight intensity={1.1} />
        {ROOMS.map((room, i) => (
          <RoomLights key={i} offsetX={room.offsetX} offsetZ={room.offsetZ} />
        ))}
        {/* Suspense shows nothing (fallback={null}) while painting textures
            load, then reveals the whole scene at once rather than paintings
            popping in one by one. */}
        <Suspense fallback={null}>
          {ROOMS.map((room, i) => (
            <Room
              key={i}
              offsetX={room.offsetX}
              offsetZ={room.offsetZ}
              paintings={room.paintings}
              paintingWalls={room.paintingWalls}
              hasBackWall={room.hasBackWall}
              hasFrontDoorway={room.hasFrontDoorway}
              hasLeftWall={room.hasLeftWall}
              hasRightDoorway={room.hasRightDoorway}
            />
          ))}
        </Suspense>
        <FirstPersonRig />
      </Canvas>
    </div>
  );
}
