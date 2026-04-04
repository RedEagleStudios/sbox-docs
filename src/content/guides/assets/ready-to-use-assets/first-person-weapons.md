---
title: "How to use our weapons"
slug: "assets/ready-to-use-assets/first-person-weapons"
category: "assets"
source: "https://sbox.game/dev/doc/assets/ready-to-use-assets/first-person-weapons/"
---

![](https://cdn.sbox.game/doc/c6ffc3f8-0e3b-4227-8198-d3e2dce38e65)

Facepunch provides some ready-to-use first-person weapons for you!

## ➡️ https://sbox.game/facepunch/sboxweapons

These first-person resources are "open-source". If downloaded from the editor, they will come bundled with their source files: VMDL, FBX, animgraphs & subgraphs…

**… But source files are currently NOT included with downloads, while the feature is getting re-implemented in a better way.**

Our first-person arms are also in the collection; [here's a direct link for convenience](https://sbox.game/facepunch/v_first_person_arms_human). By themselves, they contain and are assigned the "punching" animgraph, for all of your barehanded melee needs.

# How to use our weapons

You may be familiar with the classic Source 1 setup of [bonemerging](https://developer.valvesoftware.com/wiki/$bonemerge) separate weapon models onto a single common arms model. **However, our weapon assets require the opposite.**

You must bonemerge the arms ***→ onto →*** the weapons.

The recommended *maximum* FOV for these is 80° (horizontal) at 16:9. I try to keep them looking OK in 4:3 and at higher FOVs, but this is not a guarantee.

# Common animgraph parameters

Now that you've bonemerged arms onto our weapons, you can send animgraph inputs to the weapon just like you would with any other model.

![](https://cdn.sbox.game/doc/c4f1b91b-3c29-4bfc-a597-c89fc52ab552)

As a reminder, **♻️ self-resetting parameters** set themselves immediately back to default after one frame. For example, you don't need to set `b_attack` back to `false` yourself; it does that on its own.

## Movement

**Parameters**
**Type & values**
**Description**

`b_grounded`
☑️ bool
Behaves like on characters; can be replicated as-is from third-person to first-person.

`b_jump`
☑️ bool, ♻️ self-resets
Behaves like on characters; can be replicated as-is from third-person to first-person.

`b_sprint`
☑️ bool
Controls sprinting stance. I recommend to set to true only if sprint key held ***and*** player is moving.

`move_bob`
🎚️ float, 0.0↔1.0
Intensity of movement animations sway/bob (equivalent to `move_groundspeed` in 3P).

`move_bob_cycle_control`
🎚️ float, 0.0↔1.0
Manual control of movement animation phase. Think of it like scrubbing through the animation yourself. Active if ≠ 0.0. If = 0.0, auto-resumes normal behaviour after 100ms.

`move_x`, `move_y`, `move_z`
🎚️ float, -1.0↔1.0
Normalized movement input; unused but reserved for future, and should ideally be set anyway.

## Weapon mechanics, actions, and states

**Parameters**
**Type & values**
**Description**

`b_attack`
☑️ bool, ♻️ self-resets
Plays the gun's fire animation, or throws a punch.

`b_attack_dry`
☑️ bool
Use this instead of b_attack when the gun is empty.

`b_attack_hit`
☑️ bool
Set to true if the attack connects (used for melee hit/miss animation variations).

`attack_hold`
🎚️ float, 0.0↔1.0
Staggered recoil for continuous fire; blend toward 1 when holding fire and continuously firing.

`b_reload`
☑️ bool, ♻️ self-resets
Triggers reload animation.

`b_empty`
☑️ bool
Set to true if magazine/clip is empty; is used to switch to different reload animations and affect weapon visuals (e.g. slide pulled back).

`ironsights`
🗂️ enum, 1 = ADS
Trigger "aim down sights" stance. The animation is only in charge of aligning the gun in its default state, additional offsets (for attachments) are up to you in code.

`ironsights_fire_scale`
🎚️ float, 0.0↔1.0
Scale down strength of fire animations while aiming down sights.

`firing_mode`
🗂️ enum
Reflects firing mode selector on the weapon. Values vary. Usually: 0 = safety/off, 1 = single, 2 = burst, 3 = auto.

`b_deploy_skip`
☑️ bool
Skip the deploy animation when the animgraph initializes.

`b_twohanded`
☑️ bool
Toggle between one-handed and two-handed animation sets. Only supported by some weapons.

`b_lower_weapon`
☑️ bool
Aim the weapon away from center and lower it (HL2-style ally-friendly aim posture).

`b_holster`
☑️ bool
Holster the weapon. Unticking will trigger a re-deploy, but it's not guaranteed to be ideal. Recommendation: once your code detects the 🏷️`holster_finished` tag, destroy the GameObject. Recreate it if the same weapon is drawn again.

`weapon_pose`
🗂️ enum
Adjust pose for attachments. Used by some weapons; refer to the section below.

`b_grab`
☑️ bool
Trigger the "grab stance" (left hand ready, towards the center of the screen).

`grab_action`
🗂️ enum, ♻️ self-resets
Trigger a "grab gesture". 1 = sweep down, 2 = sweep right, 3 = sweep left, 4 = push button.

`deploy_type`, `reload_type`
🗂️ enum
Used by some weapons; refer to the section below.

## Others

**Parameters**
**Type & values**
**Description**

`camera_position_scale`<br>`camera_rotation_scale`
🎚️ float, 0.0↔2.0
Control the strength of camera animations. Setting the float above 1.0 makes them stronger (but only up to 2.0).

## Speed scaling

You can change these 🎚️ floats at any time, including in the middle of the animations they affect!

**Parameters**
**What's affected**

`speed_reload`
Reload animations

`speed_deploy`
Deploy & holster animations

`speed_ironsights`
Ironsight transitions

`speed_grab`
Grab stance & grab gestures

## Aim modifiers

The `aim_pitch_inertia` and `aim_yaw_inertia` parameters (🎚️ floats, exploitable range of `-45↔45`) control an animated, bouncy "lag" of the weapon when looking around (or other parts, e.g. the left arm when "grab stance" is active).

## Parameters & behaviours specific to certain weapons

### v_first_person_arms (🤜 punching animgraph)

- (todo…)

### v_crowbar (λ)

- Swings every 400-450ms are recommended.

- The implementation of a ["viewpunch"](https://developer.valvesoftware.com/wiki/ViewPunch)-style camera rotation kick when you hit something is, as of the time of writing, up to you.

- `b_attack_has_hit` is used.

### v_m4a1 (assault rifle)

- `weapon_pose` (🔢 int) should be set to 1 if the handguard covers bodygroup is active.

- `reload_type` (🗂️ enum) can be set to 1 for a "pull" animation, instead of tossing the magazine.

- `deploy_type` (🗂️ enum) can be set to 1 for a faster variant.

### v_m700 (sniper rifle)

- `b_reload_bolt` (☑️ bool, ♻️ self-resets) triggers a bolt action. This can be done at any time. The firing pin (striker) will be sent back to its ready position only after using this parameter.

- `deploy_type` (🗂️ enum) can be set to 1 for a faster variant.

### v_mp5 (submachine gun)

- `deploy_type` (🗂️ enum) can be set to 1 for a faster variant.

### v_physgun

- `b_button` (☑️ bool) makes the right hand push down the big button on the iron part.

- `brake`  (🎚️ float, 0.0↔1.0) makes the left hand squeeze the bicycle brake.

- `stylus`  (🎚️ float, -1.0↔1.0) makes the record player stylus needles go in/out.

### v_recoillessrifle (🚀 rocket launcher)

- `deploy_type` & `reload_type` (🗂️ enums) can be set to 1 for faster variants.

### v_spaghellim4 (shotgun, automatic)

- `b_reload` is NOT self-resetting. Toggle it on to start reloading, toggle it off to end. This is the "simple" way to handle reloads. See below for advanced controls.

- `b_reloading` (☑️ bool) activates a "reloading stance".

During this, you can fire `b_reloading_shell` (☑️ bool ♻️ self-resets) at any pace.

- The animation for inserting the first shell through the carrier can be triggered with `b_reloading_first_shell` (☑️ bool ♻️ self-resets) regardless of the other parameters.

*↳ You can trigger these parameters in (mostly) any order, at (mostly) the pace that you want.*

- `deploy_type` (🗂️ enum) can be set to 1 for a faster variant.

- The 🏷️`reload_bodygroup` tag should be used as a hint to display the shell bodygroup when it's active, and to keep it disabled whenever it's not.

### v_toolgun

- `b_twohanded` (☑️ bool) is supported.

- `trigger_press`  (🎚️ float, 0.0↔1.0) will make the hand visually squeeze the trigger. This is because the toolgun is not a "conventional" weapon, and it needs to be able to "fire" without that actually being an "attack".

- `b_joystick` (☑️ bool) activates a "joystick stance".

During this, use `joystick_x` and `joystick_y` (🎚️ floats, -1.0↔1.0) to make the right thumb control the joystick. with Note that diagonal directions would be roughly ±0.71 in both axises (because the joystick is a circle, not a square).

- `firing_mode` is assigned to the state of the side switch. 0 = middle, 1 = up, 2 = down.

- `coil` (🎚️ float, 0.0↔1.0) controls the orientation of the coil, so it can be spun.

### v_trenchknife & v_m9bayonet (🔪 knives)

- Melee attacks automatically chain into different swing animations if `b_attack` is called again within ≈500ms. The animations & animgraph were made with swings every 350ms in mind.

- `b_backstab` (☑️ bool) activates a "backstab stance". During this stance:

Attacks will change to be "heavy" attacks, similar to Counter-Strike games.

- You can toggle this stance at any time, but note that doing so during an attack will interrupt it.

- `b_attack_has_hit` is used during this state.

### v_usp (🔫 pistol)

- `b_twohanded` (☑️ bool) is supported.

- `deploy_type` (🗂️ enum) can be set to 1 for a different animation, without the safety being turned off.

### 💣 Throwables

These include: v_flash_grenade, v_decoy_grenade, v_he_grenade, v_molotov, and v_incendiary_grenade.

- `b_charge` (☑️ bool, ♻️ self-resets) triggers the "ready to throw state".

*↳* then `b_attack` will play the "throw" animation at any time (but preferably during this state).

- `b_pin_remove` (☑️ bool) will instantly remove the pin from all animations (and should therefore be set as soon as the graph initializes). This is useful if you set `charge_type` to 1 (so that it doesn't look like the player is throwing a grenade that still has its pin).

- `charge_type` (🗂️ enum) determines which type of "readying" is performed: pulling the pin or not. (Has no effect on v_molotov.)

- `throw_blend`(🎚️ float, 0.0↔1.0) blends the left hand between far (0) & near (1) poses in the "ready to throw" state, similar to Counter-Strike.

- `throw_type` (🗂️ enum) determines the throw animation. 0 = far, 1 = near.

Once a throw animation has finished, you must trigger `b_reload` to bring up a new throwable.

With these parameters at your disposal, there are three ways you can implement grenades:

- Counter-Strike style: deploy normally → `charge_type` = 0 (pull pin) → throw.

- Faster style: deploy with `b_pin_remove` = true → `charge_type` = 1 (lift) → throw.

- Cook style: deploy with `b_pin_remove` = true → trigger `b_lever_release` = true → `charge_type` = 1 (lift) → throw.

# Tags

Animgraphs can use "Internal Tags" for various purposes (letting parts of the graph communicate with one another without spaghetti wiring) — but there are also "Event Tags" that are sent to the game code to let it know about various events. The most common example is changing the bodygroup of a mesh mid-reload animation, so that a held empty magazine becomes full again.

![](https://cdn.sbox.game/doc/edf53a14-0d07-4cc8-ae3a-bc8884e2442e)

See [OnAnimTagEvent](https://sbox.game/api/Sandbox.SkinnedModelRenderer/OnAnimTagEvent). Tags are passed as a string, as-is; they are effectively "hints" for the code, they don't contain any other data than their name. You won't have to hard-code lengths, timings, etc. and handle logic that scales those timings based on speed scaling parameters. All you have to do is listen for these tags!

## Standard "Event Tags"

- 🏷️`attack_discouraged`: you probably shouldn't let the player attack/fire right now (because it would look weird or off), but there's nothing stopping you; this is just a hint. For example, when it comes to reload animations, this tag will let you know when the weapon will be "ready" again (aiming at the crosshair).

- 🏷️`holster_finished`: fired once the holster animation is done playing; this lets you know when it's safe to switch without interrupting the animation (which might feel weird, as some weapons significantly animate the camera's position).

- 🏷️`reload_bodygroup`: the clip/magazine/etc. went off-screen during the reload animation, and now's the time for code to swap something to a different bodygroup (e.g. from empty to full).

- 🏷️`reload_increment`: lets you know exactly when in the animation a mag/clip/etc. has been inserted, and you can change the ammo counter.

- 🏷️`melee_swing`: active across an entire melee swing (in case you want some sort of continuous hit detection)

- 🏷️`melee_hit`: the actual time when a melee swing connects with its target, in the center of the screen. Swinging takes a bit of time, so you could use this to delay sounds, particle effects, etc.

- 🏷️`melee_plant`: the time range during which a melee weapon stays planted inside something or someone (e.g. a knife in someone's back). Example use case: during this tag, freeze player movement, freeze the camera, or freeze the viewmodel rotation relative to the player view + soft-clamp player look to ±10°…

# 🦴 Camera bone

The camera is animated through the `🦴camera` bone. Its position (relative to the first-person 0,0,0) and orientation (relative to +X forwards, +Y left, +Z up) should **add** onto your in-game camera.

Our animgraphs automatically "weaken" this camera animation by 50% while moving (this is mapped to the use of the `move_bob` float).

**The "positional" part of these animations should always be used.** As for rotations, feel free to offer a toggle for players prone to motion sickness, or to simply not play it back.

# Replacing weapons with your own

![](https://cdn.sbox.game/doc/95d00064-a9f0-4789-8cb9-11e183315f97)

You might want to use your own weapon meshes. You can hide them, and then bonemerge (or simply parent) yours on top. For example, as pictured in this image, you could grab v_crowbar, hide the crowbar itself, then add a police baton on top.

Then, instead of manually rotating GameObjects through the viewport, you can correct the grip of the hand(s) with our simple finger adjustment parameters!

They're all floats with a range of `-60,60`, emulating a 3ds Max CAT-style finger controller setup. The syntax goes like this: `FingerAdjustment_{``*L*``|``*R*``}{``*1*``|``*2*``|``*3*``|``*4*``|``*5*``}_{``*Bend*``|``*Curl*``|``*Roll*``|``*Spread*``}`

For example: `FingerAdjustment_L3_Bend` will bend the left hand's middle finger.

This approach has many benefits. Here's one: you can store collections of different finger adjustment parameters through your C# code, and easily switch between them based on conditions. For example, if you were to swap the arms mesh for thick heavy gloves, you might add a slight offset to all curl and spread parameters, to account for the thickness.

# Technical details

Each weapon contains its own skeleton. There are three separate root hierarchies: the weapon bones, the arms bones, and the camera.

Under `🦴weapon_root`, there's `🦴weapon_root_children`, and under that one, different bones for every weapon (as the various mechanical bits of every gun are different).

There are two IK bones under `🦴weapon_root`, one for each hand.

The control rig used to create animation has these bones constrained to be at the same position and orientation as the hand bones, and this data is baked out during export, when the exporter "flattens" the animation by making every frame a keyframe. This means that the weapon knows where the hands should be relative to itself at any time — and the hands are always corrected back via IK in their animgraphs.

From there, it becomes very easy to apply various layers and additives (like movement bobbing) and have the hands always stick where they should be. Most of the time, only `🦴weapon_root` needs to move… and this means a lot of animations can be shared between guns!