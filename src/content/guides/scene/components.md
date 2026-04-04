---
title: "Adding Components"
slug: "scene/components"
order: 74
category: "scene"
source: "https://sbox.game/dev/doc/scene/components/"
---

A Component is added to a GameObject to provide functionality. This functionality can vary wildly.

You could add a component that renders a model at the GameObject's position. Or you could add a component that created a physics object at the GameObject's position.

You can create your own components too. This is how games are programmed. For example, you could write a component that moved an object forward when the Forward key is held down.

# Adding Components

To add a component to a GameObject in editor, select the GameObject and then click on Add Component in the inspector.

To add a component to a GameObject in code

```csharp
// Create
var modelRenderer = go.AddComponent();

// Set up
modelRenderer.Model = Model.Load( "models/dev/box.vmdl" );
modelRenderer.Tint = Color.Red;
```

You can also GetOrAddComponent if you want it to exist if it doesn't already.

```csharp
// Get or create
var modelRenderer = go.GetOrAddComponent();

// Set up
modelRenderer.Model = Model.Load( "models/dev/box.vmdl" );
modelRenderer.Tint = Color.Green;
```

# Querying Components

You can query a GameObject for components in multiple different ways.

```csharp
// Get a multiple components of the same type
var x = go.GetComponents();

// Get a single component from a gameobject
var x = go.GetComponent();

// Get a single component from a gameobject, and its children
var x = go.GetComponentInChildren();

// Get all components from a gameobject, and its children
var x = go.GetComponentsInChildren();

// Get all components from a gameobject's ancestors and itself
var x = go.Components.GetComponentsInParent();

// Get a single component from a gameobject's ancestors and itself
var x = go.Components.GetComponentInParent();
```

# Specialized Queries

If you're wanting to go even more granular:

```csharp
// Get disabled components in ancestors
var x = go.Components.Get( FindMode.Disabled | FindMode.InAncestors );

// Get all enabled components in ancestors and self
var x = go.Components.GetAll( FindMode.Enabled | FindMode.InAncestors | FindMode.InSelf );

// Get all components on a gameobject
var x = go.Components.GetAll();
```

# Component References

You can get component references as variables in two main ways.

```csharp
// Creates a property in the inspector, you can drag any ModelRenderer from the scene in to reference it
[Property] ModelRenderer BodyRenderer { get; set; }

// References the first ModelRenderer on the same GameObject as this component, or creates one if none exist
[RequireComponent] ModelRenderer BodyRenderer { get; set; }
```

# Removing Components

To remove a component from a GameObject, you call DestroyComponent(). You cannot reuse this component - at this point it is destroyed forever and you should stop using it.

```csharp
var depthOfField = GetComponent();
dephOfField.Destroy();
```

# Destroying GameObject from Component

`DestroyGameObject()`, nice and easy. You can also use `GameObject.Destroy()` if you want.