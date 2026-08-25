---
title: Physics & Simulation Engine
category: Modeling & Simulation
description: A custom C++20 engine for interactive two-dimensional simulations, with a fixed-timestep loop, batched OpenGL rendering, spatial data structures and real-time debugging tools.
technologies:
  - C++20
  - OpenGL
  - GLFW
  - ImGui
  - CMake
skills:
  - name: Software architecture
    evidence: Provides reusable Application, Window, Input, Camera2D and Renderer2D layers while simulations implement focused lifecycle hooks.
  - name: Real-time rendering
    evidence: Groups line, rectangle and circle primitives into separate batches and applies the active camera projection before drawing.
  - name: Debugging tools
    evidence: Integrates ImGui with GLFW and OpenGL, including run/pause, single-step, delta-time and FPS controls at the engine level.
  - name: Build tooling
    evidence: Uses CMake to build Engine, physics and application targets, linking OpenGL, GLFW, GLAD and ImGui as static libraries.
---

## What

I developed a C++20 engine intended for interactive two-dimensional simulations. It provides the infrastructure shared by computational experiments: a GLFW window, input handling, a predictable application loop, 2D camera support, OpenGL rendering and runtime debugging tools.

The SPH fluid simulation is one experiment that can be built on this foundation.

## Why

Small simulation projects often begin by mixing model code, rendering and input handling in one place. That is convenient initially, but makes it harder to compare experiments or reuse reliable infrastructure. The engine was created to separate those concerns and make new simulations faster to prototype.

The fixed-timestep loop was especially important. Simulation models need a stable and predictable cadence, while rendering should remain responsive even when the display refresh rate varies.

## How

### Application lifecycle and fixed physics updates

Applications inherit lifecycle hooks such as `OnUpdate`, `OnPhysicsUpdate`, `OnRender2D`, `OnInput` and `OnImGuiRender`. The engine measures frame delta time for input and visual updates, but advances physics through an accumulator and a fixed timestep. This keeps model updates consistent without tying numerical behavior to the display frame rate.

```cpp
while (window.isOpen()) {
    accumulator += deltaTime;

    while (accumulator >= fixedDeltaTime) {
        simulation.update(fixedDeltaTime);
        accumulator -= fixedDeltaTime;
    }

    renderer.draw(simulation);
}
```

### Rendering and diagnostics

`Renderer2D` exposes line, rectangle, circle, grid and bounding-box primitives. It owns separate line, rectangle and circle batches; at the start of a frame it computes the active camera view-projection matrix, begins each batch and flushes them after the application submits its geometry. GLFW manages the OpenGL window and input context, while GLAD loads the OpenGL functions.

ImGui is initialized against GLFW/OpenGL and is available to every application. The base engine includes run/pause and single-step physics controls plus a performance window showing frame delta time and FPS. Individual simulations can then add their own parameter panels without rebuilding this infrastructure.

### Reusable systems

Camera movement is provided through a reusable 2D editor camera. Rendering utilities, math types and input APIs live at the engine level rather than inside an individual experiment. The project is organized with CMake into engine, physics and app targets, so simulations such as SPH or electrostatics can share the same runtime foundation.

## Results and learnings

The engine turns a simulation project into a repeatable workflow: create a model, connect it to the fixed update hook, visualize it with 2D primitives and inspect it through live controls. The main lesson was that developer tooling shortens the feedback loop needed to test a hypothesis.

Future work could include additional simulation modules, deterministic recording and replay, and automated performance benchmarks.
