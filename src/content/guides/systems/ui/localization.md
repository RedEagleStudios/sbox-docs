---
title: "Tokens"
slug: "systems/ui/localization"
order: 67
category: "systems"
source: "https://sbox.game/dev/doc/systems/ui/localization/"
---

When displaying text such as `Hello World`, you should instead use a localization token like `#menu.helloworld`. This will automatically replace the text with the corresponding language set by the user when set on a Label, allowing you to easily support multiple languages.

# Tokens

In UI, any displayed string that begins with a `#` will be recognized as a token, which means it will look for it's real value in the localization system.

# Example

Filename: `Localization/en/sandbox.json`

```csharp
{
  "menu.helloworld": "Hello World",
  "spawnmenu.props": "Models",
  "spawnmenu.tools": "Tools"
  "spawnmenu.cloud": "sbox.game",
}
```

Then it's as easy as doing the following:

```csharp
#spawnmenu.props
```

# Languages

| English Name | API Language Code |
| --- | --- |
| Arabic | ar |
| Bulgarian | bg |
| Simplified Chinese | zh-cn |
| Traditional Chinese | zh-tw |
| Czech | cs |
| Danish | da |
| Dutch | nl |
| English | en |
| Finnish | fi |
| French | fr |
| German | de |
| Greek | el |
| Hungarian | hu |
| Italian | it |
| Japanese | ja |
| Korean | ko |
| Norwegian | no |
| Pirate | en-pt |
| Polish | pl |
| Portuguese | pt |
| Portuguese-Brazil | pt-br |
| Romanian | ro |
| Russian | ru |
| Spanish-Spain | es |
| Spanish-Latin America | es-419 |
| Swedish | sv |
| Thai | th |
| Turkish | tr |
| Ukrainian | uk |
| Vietnamese | vn |