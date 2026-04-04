---
title: "Variables"
slug: "systems/actiongraph/variables"
order: 16
category: "systems"
source: "https://sbox.game/dev/doc/systems/actiongraph/variables/"
---

Variables are useful for making your graph easier to understand, cleaning up link spaghetti, and when performing calculations in loops.

![A simple example setting and getting an example variable](https://cdn.sbox.game/doc/753b5db8-c904-4cc3-91e0-396864c09b52)

You can create a new variable by dragging a link from an output with the value type you want the variable to hold, selecting "Add Variable", then giving it a name.

![Creating a new Vector3 variable named "Example".](https://cdn.sbox.game/doc/cdb95f9a-9ae3-4530-98af-1a8555f93f38)

This will create an action node that sets the new variable upon receiving an input signal. You can then create more nodes to get or set the value of the variable by righ-clicking, then looking under *Variables*.

![Creating a node to get or set the "Example" variable.](https://cdn.sbox.game/doc/670ad327-8c5d-435e-888b-cee5dc10b947)

You can also directly use a variable in an input socket by right-clicking on it, then selecting the variable from the context menu.

![Directly using a variable in an input socket.](https://cdn.sbox.game/doc/e3541b69-8155-44b1-b455-f355edfb2a19)