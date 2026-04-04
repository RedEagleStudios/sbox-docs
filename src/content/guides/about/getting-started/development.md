---
title: "Creating a project"
slug: "about/getting-started/development"
category: "about"
source: "https://sbox.game/dev/doc/about/getting-started/development/"
---

Creating a game in s&box is easy, but you probably want to know how to do things in the right order.

# Creating a project

The first step is to create a game project. Open the s&box Game Editor and the project window will appear. Simply click on **New Game Project** and fill out the wizard.

![](https://cdn.sbox.game/doc/025a7aff-f37b-4f07-b985-03e41f937973)

# The Scene System

We use a scene system to create our games in s&box. We feel this is the easiest system for people to pick up, while still being powerful.

### Scenes

A **Scene** is your game world. Everything that renders and updates in your game at one time should be in a scene. Scenes can be saved and loaded to disk.

### GameObject

A scene contains multiple **GameObjects**. The GameObject is a world object which has a position, rotation and scale. They can be arranged in a hierarchy, so that children GameObjects move relative to their parents.

### Component

GameObjects can contain Components. A component provides modular functionality to a GameObject. For example, a GameObject might have a ModelRender component - which would render a model. It might also have a BoxCollider component - which would make it solid.

The game developer ultimately creates games by programming new Components and configuring scenes with GameObjects and Components.