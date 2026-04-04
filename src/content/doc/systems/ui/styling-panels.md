---
title: "Using Stylesheets"
slug: "systems/ui/styling-panels"
order: 65
category: "systems"
source: "https://sbox.game/dev/doc/systems/ui/styling-panels/"
---

# Using Stylesheets

It is common to have a file system like this:

- Health.razor

- Health.razor.scss

If you do this, the scss file is automatically included by your Health.razor panel.

If you want to specify a different location for the loaded Stylesheet, you can add this to your Panel class:

```csharp
[StyleSheet("main.scss")]
```

You can also import a stylesheet from within another stylesheet like so:

```csharp
@import "buttons.scss";
```

# Styling Directly

There are a few ways to style your Panels without a stylesheet. It's really recommended that you use a stylesheet to keep things organized, but there are also valid reasons to use the following methods.

### Styling the Element

You can directly style any element just like you can in HTML, but can inject C# when necessary:

```csharp
DANGER!

  

```

### Style Block

Before or after your `` element, you can add a `` block that is read just like a Stylesheet:

```csharp

  MyPanel {
    width: 100%;
    height: 100%;
  }
  .hp { color: red; }
  .armor { color: blue; }

```

### Styling in Code

You can a Panel's [Style](https://sbox.game/api/Sandbox.UI.BaseStyles) directly and modify the values however you'd like via `Tick()` or `OnUpdate()`:

```csharp
myPanel.Style.Width = Length.Percent(Progress * 100f);
```