---
title: "Limitations"
slug: "systems/navigation/navmesh-areas"
order: 39
category: "systems"
source: "https://sbox.game/dev/doc/systems/navigation/navmesh-areas/"
---

NavNesh Areas can affect NavNesh generation and agent behavior/pathing.
 ![](https://cdn.sbox.game/doc/d5eda4fd-ed43-41f9-9ee4-358b059ac062)The NavMeshArea component is used to define the location, shape and type of an area.

![](https://cdn.sbox.game/doc/c2f35aa4-e22d-4341-95a4-0fdbb648ee54)

You can also specify the Area for a link component.

![](https://cdn.sbox.game/doc/67a7f9a0-55f2-4842-90ce-202a2c2f5d14)The NavMeshAreaDefinition resource is used to define properties of the Area.

# Limitations

- Currently there is a limit of 24 NavMeshAreaDefinition, but you can assign them to as many Area Components as you like

- Static areas are basically free.

- Moving areas are a bit more expensive, but you should be able to have at least a couple of dozens of them.