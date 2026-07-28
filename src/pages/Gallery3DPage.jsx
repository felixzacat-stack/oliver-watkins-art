import { Suspense, useMemo, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

import pics from "src/data/pics";
import "./Gallery3DPage.scss";

// Proof of concept: rectangular rooms tiled into a GRID_COLS x GRID_ROWS
// grid, each adjoining every orthogonal neighbor through a doorway (no
// diagonal connections). Paintings hang on the walls of each room, spread
// across the whole grid. Navigable with tank-style keyboard controls:
// forward/back moves along the direction you're facing, left/right turns
// you in place. The mouse complements this rather than replacing it: the
// wheel drives the same forward/back axis as W/S and the up/down arrows,
// and moving the cursor toward the left or right edge of the window turns
// the view that way (continuing for as long as it stays off-center), same
// axis as the left/right arrows. The camera never pitches up or down, so
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
const WALL_HEIGHT = 2.5; // a realistic room ceiling height, in meters
// Centered floor-to-ceiling on the wall, rather than at a fixed eye-level
// height, so paintings stay vertically centered whatever WALL_HEIGHT is set to.
const PAINTING_Y = WALL_HEIGHT / 2;
const MOVE_SPEED = 6; // units per second for forward/back movement
const ROTATE_SPEED = 2.2; // radians per second for turning left/right
// Scene units moved per unit of wheel deltaY. A single notch reportedly
// still moved ~2 units (a couple of meters) at the prior value, well above
// what deltaY~100 would suggest — some mice/OS scroll settings report a
// much larger deltaY per physical click than the ~100 baseline, and rapid
// notches can also fire faster than they're rendered, compounding into one
// visibly bigger jump. Dropped further so a single click reads as a small
// nudge rather than a stride.
const WHEEL_MOVE_SENSITIVITY = 0.00004;
// How close to the screen's horizontal center the cursor has to be before
// it's treated as dead-center (no turning) — as a fraction of half the
// window width. Without this, any tiny cursor drift off exact-center would
// register as a turn input and slowly spin the view.
const MOUSE_TURN_DEADZONE = 0.08;
// Touch-drag equivalent of MOUSE_TURN_DEADZONE/edge-turning: below this many
// CSS px of drag distance (per axis, from the touch-start point), input is
// treated as zero; at TOUCH_DRAG_MAX_PX or beyond it reaches full magnitude.
// Touch coordinates are already reported in device-independent CSS px, so
// these are consistent across phones/tablets without extra DPI scaling.
const TOUCH_DRAG_DEADZONE_PX = 12;
const TOUCH_DRAG_MAX_PX = 80;
// Caps how often a new frame is requested while moving. Without this, a
// held movement key re-invalidates every rendered frame, so the scene
// renders at the monitor's full refresh rate (60/120/144Hz) — capping it
// trades visual smoothness for lower sustained CPU/GPU load while walking.
const MAX_FPS = 30;
const MIN_FRAME_INTERVAL_MS = 1000 / MAX_FPS;

// A single point light per room (rather than the previous four) since
// Three's standard material shades every fragment against every light in
// the scene — with 6 rooms, four lights each meant 24 lights factored into
// every lit pixel's shader, which was the main cost behind the sluggish
// frame rate. Intensity is scaled up to roughly cover for the three removed
// lights (still comfortably under the range ACESFilmicToneMapping can roll
// off without clipping to white — see below).
const POINT_LIGHT_INTENSITY = 2.8;
const AMBIENT_LIGHT_INTENSITY = 0.4;

const DOORWAY_WIDTH = 2.6;
const DOORWAY_HEIGHT = 2.4; // leaves a lintel above, short of the WALL_HEIGHT ceiling
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

// Left out of the 3D gallery specifically (they still appear in the regular
// gallery page) — pics.js is unaffected.
const EXCLUDED_SLUGS = new Set(["awaken-the-monster", "squid", "the-literary-boor", "orange"]);
const GALLERY_PICS = pics.filter((pic) => !EXCLUDED_SLUGS.has(pic.slug));

// The "Stranger than paradise" series reads as one triptych, so it's kept
// together on a single wall (see Room below) instead of being round-robined
// across separate walls like every other painting.
const PARADISE_SLUGS = new Set(["paradise-1", "paradise-2", "paradise-3"]);
// Gap between the centers of series paintings hung side by side on the same
// wall — wide enough to clear a frame (paintings in this series are ~0.6m
// wide) with a little breathing room either side.
const SERIES_ITEM_GAP = 0.9;
// A wall's local offset axis (x for back/front, z for left/right) doesn't
// consistently line up with "screen-right" for a viewer facing that wall —
// walls facing +Z or -X (front, left) read backwards, since their rotation
// mirrors the offset axis relative to the viewer. Indexed by wall (back=0,
// front=1, left=2, right=3), this flips the spread direction on those walls
// so a group's paintings always read in array order left-to-right.
const WALL_READING_SIGN = [1, -1, -1, 1];

// Spread every painting across the 6 rooms, weighted by how many free walls
// each room actually has — otherwise a 1-wall connector room would get just
// as many paintings as a 2-wall room and end up crowded.
const roomPaintingCounts = distributeByWeight(
  GALLERY_PICS.length,
  ROOMS.map((room) => room.paintingWalls.length),
);
let paintingCursor = 0;
for (let i = 0; i < ROOMS.length; i++) {
  const count = roomPaintingCounts[i];
  ROOMS[i].paintings = GALLERY_PICS.slice(paintingCursor, paintingCursor + count);
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
      {/* <Html position={[0, -height / 2 - 0.25, 0]} center distanceFactor={8} occlude>
        <div className="gallery3d-label">{pic.title}</div>
      </Html> */}
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
  // can't hold paintings). Paintings are handed out round-robin by group —
  // ordinarily each group is just one painting, except the "Stranger than
  // paradise" series, which is bundled into a single group so all of it
  // lands on the same wall — and each wall's groups are spaced out evenly
  // along its length using the "slot index on that wall" (t).
  const wallPositions = useMemo(() => {
    const groups = [];
    for (const pic of paintings) {
      const isParadise = PARADISE_SLUGS.has(pic.slug);
      const prevGroup = groups[groups.length - 1];
      if (isParadise && prevGroup?.isParadise) {
        prevGroup.pics.push(pic);
      } else {
        groups.push({ isParadise, pics: [pic] });
      }
    }

    const positions = [];
    const wallCount = paintingWalls.length;
    groups.forEach((group, gi) => {
      const wall = paintingWalls[gi % wallCount];
      const t = Math.floor(gi / wallCount) + 1; // this group's slot index on that wall (1-based)
      // +1 in the denominator leaves a gap at both ends of the wall instead
      // of butting paintings right up against the corners.
      const spacing = ROOM_WIDTH / (Math.ceil(groups.length / wallCount) + 1);
      const baseOffset = -ROOM_WIDTH / 2 + spacing * t;

      group.pics.forEach((pic, k) => {
        // A multi-painting group (the paradise series) is spread evenly
        // around its slot instead of all painting centers landing on top of
        // each other; a single-painting group collapses this to baseOffset.
        const offset =
          baseOffset + WALL_READING_SIGN[wall] * (k - (group.pics.length - 1) / 2) * SERIES_ITEM_GAP;

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
      });
    });
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

// One centered, near-ceiling point light per room. decay={0} means it
// doesn't fall off with distance, so a single central fixture still reaches
// every corner — position mostly matters for the angle of incidence on
// walls, not for its reach.
function RoomLights({ offsetX, offsetZ }) {
  return <pointLight position={[offsetX, WALL_HEIGHT - 0.3, offsetZ]} intensity={POINT_LIGHT_INTENSITY} decay={0} />;
}

function FirstPersonRig() {
  const { camera, invalidate, gl } = useThree();
  // Keys are tracked in a ref (not state) so key presses don't trigger React
  // re-renders — useFrame reads the latest values directly every frame instead.
  const keys = useRef({});
  // Current facing angle (yaw) in radians, turned by left/right input. Kept
  // in a ref rather than derived from camera.rotation.y each frame so it
  // accumulates smoothly regardless of anything else touching the camera.
  const yaw = useRef(0);
  // How far the cursor sits from the horizontal center of the window, as a
  // signed fraction from -1 (left edge) to 1 (right edge), beyond the dead
  // zone. Read every frame in useFrame as a continuous turn input — the
  // cursor's position (not its raw movement) drives turning, like steering
  // toward whichever side of the screen the mouse sits on, so turning
  // continues for as long as the mouse stays off-center without requiring
  // it to keep moving or the page to capture the pointer.
  const mouseTurn = useRef(0);
  // Tracks the single finger currently driving touch movement: null when no
  // touch is active, otherwise { id, startX, startY } — the touch
  // identifier (so a second finger touching down can't hijack the drag) and
  // the point it started at (so drag distance is measured from there).
  const activeTouch = useRef(null);
  // Continuous -1..1 inputs from touch drag distance, analogous to the
  // keyboard's forward axis and to mouseTurn respectively — see
  // onTouchMove below.
  const touchForward = useRef(0);
  const touchTurn = useRef(0);

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
    const onBlur = () => {
      keys.current = {};
      mouseTurn.current = 0;
      activeTouch.current = null;
      touchForward.current = 0;
      touchTurn.current = 0;
    };
    // Maps cursor X position to a signed turn input: 0 within the dead zone
    // around center, ramping up to ±1 at the window's left/right edges.
    const onMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const offset = Math.max(-1, Math.min(1, (e.clientX - centerX) / centerX));
      const magnitude = Math.abs(offset);
      // Negated: positive yaw (see useFrame below) turns the view left, but
      // a positive offset means the cursor is to the right, which should
      // turn the view right.
      mouseTurn.current =
        magnitude < MOUSE_TURN_DEADZONE
          ? 0
          : -Math.sign(offset) * ((magnitude - MOUSE_TURN_DEADZONE) / (1 - MOUSE_TURN_DEADZONE));
      invalidate();
    };
    // The cursor leaving the window entirely (relatedTarget null on the
    // outgoing mouseout) should stop turning, same as losing focus — without
    // this, moving the mouse off-screen while off-center would leave it
    // turning indefinitely since no further mousemove events would arrive.
    const onMouseOut = (e) => {
      if (!e.relatedTarget) mouseTurn.current = 0;
    };
    // Wheel input moves the camera directly (rather than feeding into the
    // held-key forward/back state read in useFrame below) since a wheel
    // event is a one-off delta, not a press-and-hold signal like a key.
    // Applying it here and calling invalidate() still lets the clamp logic
    // in useFrame run against the new position on the very next rendered
    // frame, so wheel movement can't clip through walls any more than
    // keyboard movement can.
    const onWheel = (e) => {
      e.preventDefault();
      // Scrolling up/forward (negative deltaY) moves ahead; scrolling
      // down/back (positive deltaY) moves behind — matching the up/down
      // arrow keys' forward/back sense.
      const distance = -e.deltaY * WHEEL_MOVE_SENSITIVITY;
      const dir = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
      camera.position.addScaledVector(dir, distance);
      invalidate();
    };
    // Converts a drag distance in px to a signed -1..1 input: 0 within the
    // dead zone near the touch-start point, ramping up to ±1 at
    // TOUCH_DRAG_MAX_PX — the touch equivalent of the mouse dead-zone above.
    const normalizeDrag = (offsetPx) => {
      const magnitude = Math.abs(offsetPx);
      if (magnitude < TOUCH_DRAG_DEADZONE_PX) return 0;
      const eased = (magnitude - TOUCH_DRAG_DEADZONE_PX) / (TOUCH_DRAG_MAX_PX - TOUCH_DRAG_DEADZONE_PX);
      return Math.sign(offsetPx) * Math.min(1, eased);
    };
    // First-finger-wins: only starts tracking if no touch is already active,
    // so a second finger touching down mid-drag can't hijack or corrupt it.
    const onTouchStart = (e) => {
      if (activeTouch.current !== null) return;
      const touch = e.changedTouches[0];
      activeTouch.current = { id: touch.identifier, startX: touch.clientX, startY: touch.clientY };
      e.preventDefault();
    };
    // Drag up moves forward (like W/ArrowUp); drag left/right turns (like
    // the left/right arrows) — both continuous, proportional to drag
    // distance, mirroring how mouseTurn works for cursor position.
    const onTouchMove = (e) => {
      const touch = Array.from(e.changedTouches).find((t) => t.identifier === activeTouch.current?.id);
      if (!touch) return;
      e.preventDefault();
      const dx = touch.clientX - activeTouch.current.startX;
      const dy = touch.clientY - activeTouch.current.startY;
      touchForward.current = normalizeDrag(-dy);
      // Negated to match mouseTurn's sign convention (dragging/cursor right
      // turns the view right).
      touchTurn.current = -normalizeDrag(dx);
      invalidate();
    };
    const onTouchEnd = (e) => {
      const touch = Array.from(e.changedTouches).find((t) => t.identifier === activeTouch.current?.id);
      if (!touch) return;
      activeTouch.current = null;
      touchForward.current = 0;
      touchTurn.current = 0;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseout", onMouseOut);
    gl.domElement.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("touchcancel", onTouchEnd, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseout", onMouseOut);
      gl.domElement.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [camera, invalidate, gl]);

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
    // arrows are reserved for turning instead of strafing. Touch drag
    // (touchForward, continuous -1..1) is combined in on the same axis,
    // clamped to ±1 like the turn axis below.
    const keyboardForward =
      Number(!!keys.current["KeyW"] || !!keys.current["ArrowUp"]) -
      Number(!!keys.current["KeyS"] || !!keys.current["ArrowDown"]);
    const forward = Math.max(-1, Math.min(1, keyboardForward + touchForward.current));
    // A/D still strafe sideways without turning, complementing the arrow
    // keys' turn-in-place behavior. No touch equivalent — touch drag only
    // drives forward/back and turn, per the left/right-arrow analogy.
    const strafe = Number(!!keys.current["KeyD"]) - Number(!!keys.current["KeyA"]);
    // Left/right arrows rotate the view instead of moving sideways — tank
    // controls rather than a mouse-look FPS scheme. The mouse's position-
    // based turn input (see mouseTurn above) and touch drag's horizontal
    // component (touchTurn) are combined in on the same axis, clamped to ±1
    // so combining inputs doesn't turn faster than any one alone.
    const keyboardTurn = Number(!!keys.current["ArrowLeft"]) - Number(!!keys.current["ArrowRight"]);
    const turn = Math.max(-1, Math.min(1, keyboardTurn + mouseTurn.current + touchTurn.current));

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
      const raw = new THREE.Vector3().addScaledVector(dir, forward).addScaledVector(right, strafe);
      // Normalizing then scaling by this capped magnitude (rather than just
      // normalizing) keeps diagonal movement (forward + strafe) no faster
      // than a single direction, while still preserving fractional
      // magnitude for continuous touch-drag input — keyboard input is
      // always exactly -1/0/1 per axis, so raw.length() there is always >=
      // 1 and this reduces to the old normalize-only behavior.
      const magnitude = Math.min(1, raw.length());
      const move = raw.normalize().multiplyScalar(magnitude * MOVE_SPEED * delta);
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
      {/* <div className="gallery3d-overlay">
        <p>Arrow keys or WASD: up/down (W/S) to move, left/right to turn. A/D to strafe. No mouse needed.</p>
      </div> */}
      <Canvas
        shadows
        frameloop="demand"
        camera={{ fov: 70, position: [0, 1.7, 6] }}
        // ACESFilmicToneMapping rolls off bright areas smoothly instead of
        // Three's default hard-clipping anything past 1.0 straight to white
        // — with several point lights able to hit the same wall (see
        // POINT_LIGHT_INTENSITY above), some highlight headroom is expected,
        // and filmic tone mapping is what keeps that from reading as pale.
        gl={{ toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Flat ambient fill so unlit sides of paintings/walls aren't pitch
            black, plus a few point lights near the ceiling of each room as
            "room lights". Three's physically-correct lighting attenuates
            point lights by distance squared (decay=2 by default), which
            would leave the far corners of a room almost unlit — decay={0}
            keeps brightness constant regardless of distance. */}
        <ambientLight intensity={AMBIENT_LIGHT_INTENSITY} />
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
