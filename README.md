# Three-Body / N-Body Space Simulation (Three.js)

A real-time 3D gravitational simulation built with JavaScript and Three.js, inspired by the classical three-body problem.

The project combines a simple physics engine (Newtonian gravity + numerical integration) with a stylized visual presentation (trails, star glow, starfield/nebula background, retro pixel rendering).

## What This Project Is

This is an interactive orbital simulation where multiple bodies (currently 3 stars + 1 planet) move under mutual gravity.

It is not meant to be a perfect astrophysics simulator. The goal is to:

- explore chaotic multi-body dynamics
- visualize orbital behavior in 3D
- learn how numerical integration works in practice
- build a clean separation between simulation code and rendering code

## What Is Implemented

### Physics / Simulation

- Newtonian N-body gravity
- Plummer softening (`eps`) to prevent singularities at very short distances
- Velocity Verlet integration (more stable than simple Euler integration)
- Typed-array state storage (`Float32Array`) for positions, velocities, accelerations, and masses
- Configurable initial conditions
- 4-body setup (3 stars + 1 planet)
- Lagrange-triangle-inspired initial condition for the three stars
- Center-of-mass momentum correction (removes overall drift)
- Optional collision/merge system (currently disabled by default)

### Rendering / Visuals

- Three.js scene/camera/renderer setup
- OrbitControls for camera movement
- Rendered bodies for stars and planet
- Custom trail rendering for all bodies
- Trail fading + glow-like additive blending
- Star glow shells (glowing sphere look)
- Procedural starfield background
- Colored nebula/fog atmosphere
- Retro pixelated render mode (low internal resolution + scaled canvas)

## Why These Choices Were Made

### Why Velocity Verlet?

Euler integration is simple, but it tends to drift and become unstable quickly in orbital simulations.

Velocity Verlet is still lightweight, but usually gives much better behavior for gravitational systems:

- better energy behavior over time
- smoother orbits
- fewer numerical explosions (for the same `dt`)

### Why Softening (`eps`)?

In pure Newtonian gravity, acceleration becomes extremely large when two bodies get very close.

That can cause:

- huge velocity spikes
- unstable trajectories
- numerical blowups

Softening modifies the distance term so close encounters are less singular, which makes the simulation much more robust and visually usable.

### Why a Lagrange-style Start for the Stars?

Random initial velocities often collapse immediately into collisions or ejections.

Using a triangular rotating configuration gives a more structured and educational starting point:

- the system starts in a recognizable dynamic configuration
- you can still introduce controlled chaos (e.g. perturbing the planet)
- it looks better and runs longer before becoming visually unreadable

## How to Run

### Requirements

- Node.js (recommended: current LTS)
- npm

### Install

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal (typically something like `http://localhost:5173`).

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Controls

- Mouse drag: orbit camera
- Scroll: zoom
- Right mouse drag (or trackpad equivalent): pan (depends on device/browser settings)

## Things You Can Experiment With

Most simulation tuning happens in `src/sim/state.js` and `src/main.js`.

### In `src/sim/state.js`

- `planetMass` to make the planet more/less influential
- `planetRadius` to move the planet closer/farther from the star system
- initial perturbations (small velocity changes) to increase chaos
- star masses to explore asymmetric systems

### In `src/main.js`

- `dt` (time step): smaller = more stable, slower
- `eps` (softening): larger = smoother/less violent close encounters
- `ENABLE_COLLISIONS`: toggle collision/merge behavior

### In `src/render/*`

- trail length / colors / opacity
- star glow intensity
- starfield density
- nebula colors and fog density
- retro pixel scale

## Notes / Limitations

- This is a real-time visual simulation, not a high-precision astrophysics solver.
- Multi-body systems are chaotic; ejections and dramatic slingshots are expected.
- Numerical stability depends heavily on `dt`, `eps`, and initial conditions.

