---
title: "Visual Indicators"
slug: "scene/prefabs/instance-overrides"
order: 82
category: "scene"
source: "https://sbox.game/dev/doc/scene/prefabs/instance-overrides/"
---

Prefab instance overrides allow you to customize individual instances of a prefab without affecting the original prefab or other instances. This lets you create variations of the same prefab while maintaining the connection to the original template.

When you modify a property, add a component, or change the hierarchy of a prefab instance, these changes are stored as overrides. The instance remembers what's different from the original prefab while still receiving updates when the prefab itself changes.

# Visual Indicators

In the scene hierarchy, prefab instances with overrides are clearly marked to show their modified state.

![](https://cdn.sbox.game/doc/ec8022c1-c396-4aaf-8ca2-6eba31fbf1e1)

Overridden properties and components are highlighted in the inspector, making it easy to see what's been customized on each instance.

![](https://cdn.sbox.game/doc/3f7b3afe-3db2-461b-8705-ed538200fa1e)

# Types of Overrides

## Property Overrides

Change any property value on GameObjects or Components within the prefab instance. Position, rotation, scale, component properties, and GameObject settings can all be overridden.

![](https://cdn.sbox.game/doc/12fecea3-5c44-4d61-a8d2-27471b7de65d)

## Component Additions

Add new components to GameObjects within the prefab instance. These components only exist on this specific instance.

![](https://cdn.sbox.game/doc/a19ff92c-bd82-48b9-9c7f-13c18961fb5d)

## GameObject Additions

Add new child GameObjects to the prefab instance hierarchy. These children are unique to this instance.

![](https://cdn.sbox.game/doc/c319b278-24c8-4128-871c-3736269185ee)

# Managing Overrides

The inspector and scene hierarchy provides controls to manage overrides on individual properties and objects:

![](https://cdn.sbox.game/doc/b77f68a2-8565-41f6-9bb1-094a453ef36f)

![](https://cdn.sbox.game/doc/163e2024-dff8-40b8-b582-4f4dcaa48b6b)

## Reverting Overrides

Right-click on any overridden property or object and select `Revert Override` to restore the original prefab value. You can also revert all overrides on a GameObject or the entire prefab instance.

## Applying Overrides

To make your instance changes permanent, right-click and select `Apply to Prefab`. This updates the original prefab with your changes, affecting all other instances.

# Nested Prefabs

When working with prefabs that contain other prefabs (nested prefabs), overrides work hierarchically. Changes to nested prefab instances are stored on the outermost prefab instance.

![](https://cdn.sbox.game/doc/ed67ca94-9c3c-47ac-9876-0397b991495c)

This ensures that all override data is centralized and properly managed even in complex prefab hierarchies.