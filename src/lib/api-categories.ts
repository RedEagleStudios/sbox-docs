import type { ApiType } from "./types";

export interface ApiCategory {
  id: string;
  label: string;
  icon: string;
  match: (type: ApiType) => boolean;
}

// Functional categories matching the s&box API sidebar
export const API_CATEGORIES: ApiCategory[] = [
  {
    id: "globals",
    label: "Globals",
    icon: "lucide:globe",
    match: (t) => !!t.IsStatic && !t.Namespace.startsWith("Editor"),
  },
  {
    id: "scene-system",
    label: "Scene System",
    icon: "lucide:box",
    match: (t) => {
      const ns = t.Namespace || "";
      const name = t.Name;
      return (
        ns.includes("Scene") ||
        ["GameObject", "GameObjectSystem", "GameTransform"].includes(name) ||
        (t.BaseType?.includes("GameObject") ?? false)
      );
    },
  },
  {
    id: "utility",
    label: "Utility",
    icon: "lucide:wrench",
    match: (t) => {
      const name = t.Name;
      return (
        t.IsExtension === true ||
        ["Utility", "StringExtensions", "MathExtensions", "FileSystem"].some(
          (u) => name.includes(u)
        )
      );
    },
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    icon: "lucide:bug",
    match: (t) =>
      (t.Namespace || "").includes("Diagnostics") ||
      ["Log", "Assert", "Debug", "Performance"].some((d) =>
        t.Name.includes(d)
      ),
  },
  {
    id: "input",
    label: "Input",
    icon: "lucide:gamepad-2",
    match: (t) =>
      (t.Namespace || "").includes("Input") ||
      (t.Namespace || "").includes("Bind") ||
      t.Name.includes("Input"),
  },
  {
    id: "audio",
    label: "Audio",
    icon: "lucide:music",
    match: (t) =>
      (t.Namespace || "").includes("Audio") ||
      ["Sound", "Music", "Audio", "Voice"].some((a) => t.Name.includes(a)),
  },
  {
    id: "graphics",
    label: "Graphics",
    icon: "lucide:monitor",
    match: (t) => {
      const ns = t.Namespace || "";
      const name = t.Name;
      return (
        ns.includes("Render") ||
        ["Color", "Color32", "ColorHsv", "Material", "Texture", "Shader", "Light", "Camera", "Particle", "Sprite"].some(
          (g) => name === g || name.startsWith(g)
        )
      );
    },
  },
  {
    id: "network",
    label: "Network",
    icon: "lucide:wifi",
    match: (t) =>
      (t.Namespace || "").includes("Network") ||
      ["Connection", "Rpc", "Broadcast"].some((n) => t.Name.includes(n)),
  },
  {
    id: "common-structs",
    label: "Common Structs",
    icon: "lucide:layers",
    match: (t) =>
      t.Group === "struct" &&
      ["", "Sandbox"].includes(t.Namespace || "") &&
      [
        "Vector2", "Vector3", "Vector4", "Angles", "Rotation", "Transform",
        "BBox", "Ray", "Plane", "Color", "Color32", "Range", "Capsule", "Cone",
        "TimeSince", "TimeUntil", "RealTimeSince", "RealTimeUntil", "Line", "Sphere",
      ].includes(t.Name),
  },
  {
    id: "components",
    label: "Components",
    icon: "lucide:puzzle",
    match: (t) =>
      (t.BaseType?.endsWith("Component") ?? false) ||
      (t.BaseType?.endsWith("BaseComponent") ?? false),
  },
  {
    id: "live-services",
    label: "Live Services",
    icon: "lucide:cloud",
    match: (t) =>
      ["Stats", "Leaderboard", "Achievement", "Lobby"].some((s) =>
        t.Name.includes(s)
      ),
  },
];

// "Everything" filter categories
export const EVERYTHING_FILTERS = [
  { id: "attributes", label: "Attributes", match: (t: ApiType) => !!t.IsAttribute },
  { id: "classes", label: "Classes", match: (t: ApiType) => t.Group === "class" },
  { id: "structs", label: "Structs", match: (t: ApiType) => t.Group === "struct" },
  { id: "enums", label: "Enums", match: (t: ApiType) => t.Group === "enum" },
  { id: "interfaces", label: "Interfaces", match: (t: ApiType) => t.Group === "interface" },
  { id: "editor", label: "Editor Classes", match: (t: ApiType) => (t.Namespace || "").startsWith("Editor") },
];

export function categorizeTypes(types: ApiType[]) {
  return API_CATEGORIES.map((cat) => ({
    ...cat,
    types: types.filter(cat.match),
  }));
}

export function filterByEverything(types: ApiType[], filterId: string) {
  const filter = EVERYTHING_FILTERS.find((f) => f.id === filterId);
  return filter ? types.filter(filter.match) : types;
}
