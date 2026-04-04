---
title: "Enabling VR"
slug: "systems/vr"
category: "systems"
source: "https://sbox.game/dev/doc/systems/vr/"
---

# Enabling VR

**Editor:** Launch the editor with a headset connected. You'll see a VR button at the top right of your editor. It should be on by default.
**Game:** If you have a VR headset plugged in and it's active, you'll launch in VR.

# Components

- VR Anchor: locks the player's playspace to a GameObject's transform

- VR Tracked Object: moves a GameObject's transform to a tracked device, e.g. a controller or headset

- VR Hand: matches the animgraph for a hand model with SteamVR's skeletal inputs

# Example Setup

An example setup is available on [sbox-scenestaging](https://github.com/Facepunch/sbox-scenestaging) under the "test.vr" scene.

Here's a basic explanation of the different parts you'll come across:

## Anchor

The anchor represents the center of the player's playspace.

If you want your player to be able to move around, add the "VR Anchor" component to the same GameObject that you're using for your player. This will move the virtual playspace along with it.

## Camera

### Rendering

The Target Eye represents the eye(s) that the camera can render to. A basic VR setup should have both Left and Right eye targets in order to display properly inside the headset.

![Click on this dropdown and check LeftEye and RightEye](https://cdn.sbox.game/doc/0c8cad28-fe2f-473f-a960-38a245b7208c)

### Tracking

A basic VR setup should also have a VR Tracked Object component on the camera, set up with the Head pose source, in order for the camera to follow the player's head movements.

![](https://cdn.sbox.game/doc/600c0d1a-d14c-4b87-8a3d-ca2721ed6ca0)

## Input

### Tracking

On any object you want to track the player's controllers, add a VR Tracked Component for the object you want to track.

For example, this component will make the GameObject it's attached to follow the player's left controller:

![](https://cdn.sbox.game/doc/bfc60b10-7210-4952-b93d-25f6da8169e1)

# API

Here's a basic overview of the VR C# API:

## Input

Get controller values

// Get left hand controller grip
var grip = Input.VR.LeftHand.Grip.Value;

// Check if the player is pulling the trigger a bit
if ( Input.VR.LeftHand.Trigger.Value > 0.5f )
{
  Log.Trace( "Shoot!" );
  
  // Vibrate the controller
  Input.VR.LeftHand.TriggerHapticVibration( duration: 0.5f, frequency: 10, amplitude: 1.0f );
}

## Check if the player is running in VR

if ( Game.IsRunningInVR )
{
   Log.Info( "I am running the game in VR!" );
}