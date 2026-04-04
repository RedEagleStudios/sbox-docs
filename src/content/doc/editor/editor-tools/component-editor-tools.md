---
title: "Defining"
slug: "editor/editor-tools/component-editor-tools"
order: 94
category: "editor"
source: "https://sbox.game/dev/doc/editor/editor-tools/component-editor-tools/"
---

Component Editor Tools work a lot like regular Editor Tools, but they're always active when a specific [Component](/doc/scene/components) is selected. These tools generally create UI in the scene view, but they can also override input too.

![The camera preview is created using a Component EditorTool](https://cdn.sbox.game/doc/4cb18c8d-d0fd-4d23-89da-3ccc37ec438e)

An example of a component tool is the camera preview - which is shown when a [GameObject](/doc/scene/gameobject) with a CameraComponent is shown.

# Defining

To define an EditorTool for your Component, you create a class like this.

```csharp
public class MyEditorTool : EditorTool
{

	public override void OnEnabled()
	{

	}

	public override void OnUpdate()
	{

	}

	public override void OnDisabled()
	{

	}

	public override void OnSelectionChanged()
	{
		var target = GetSelectedComponent();
	}
}
```

The method `OnSelectionChanged` is called after the tool is created and registered. It can also be called later if the selection is changed to another component.

The tool is automatically deleted/destroyed when the selection no longer contains the specific component type.