Three-Body Gravitational Simulation (JavaScript / Three.js)

Developed a real-time 3D N-body gravitational simulation inspired by the classical three-body problem.

Implemented Newtonian gravity using typed arrays (Float32Array) for efficient memory layout.

Wrote a custom Velocity Verlet integrator for improved numerical stability over Euler integration.

Applied Plummer softening to avoid singularities in close-range interactions.

Designed modular architecture separating physics engine (simulation state, integrator, gravity) from rendering layer.

Implemented collision detection and mass merging with momentum conservation.

Added orbit camera controls and custom trail rendering with ring buffers for visualizing trajectories.

Explored stability of Lagrange triangular configuration for three-body systems.
