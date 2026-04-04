---
title: "Transform"
slug: "scene/gameobject"
category: "scene"
source: "https://sbox.game/dev/doc/scene/gameobject/"
---

A `GameObject` represents an object in the scene world. It contains a few different elements.

# Transform

Represents where the GameObject is in the scene. Its positioning, its rotation and its scale.

If it has a parent then its transform is held relative to them, so when their parent moves, so does the child.

Here's how you can interact with them in code

// Set world position
GameObject.WorldPosition = new Vector3( 100, 100, 100 );

// Set position relative to parent
GameObject.LocalPosition = new Vector3( 100, 100, 100 );

// Set world transform
GameObject.WorldTransform = new Transform( Vector3.Zero, new Angles( 90, 90, 180 ), 2.0f )

# Tags

The GameObject's tags are used for multiple things. They're used to group physics objects to decide what should collide with each other. They can be used by cameras to decide which objects should and shouldn't render. And they can be used by programmers to do whatever they want.

if ( GameObject.Tags.Has( "enemy" ) )
{
	GameObject.Destroy();
}

GameObject.Tags.Add( "enemy" );
GameObject.Tags.Set( "enemy", isEnemy );
GameObject.Tags.Remove( "enemy" );

Tags are inherited. If a parent has the tag, then so does the child. The only way to remove the tag from the child is to remove it from the parent.

# Children

GameObject children are available via `GameObject.Children`. This is just a list of GameObjects.

We should really lock this down a bit more. Make it readonlylist or something.

# Components

GameObjects implement functionality using [Components](/guides/scene/components).