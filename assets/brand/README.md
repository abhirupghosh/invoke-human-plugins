# Ping

The Invoke Human Tool mark. The two master SVGs are the geometry. Raster files are renders of those SVGs.

## Colors

| Part | Hex |
| --- | --- |
| Background plate | `#FBF8F2` |
| Head | `#FF7A6E` |
| Stem, squares, connectors | `#161616` |

`invoke-human-ping-mark.svg` paints the ink with `currentColor` and keeps the head at `#FF7A6E`. It has no background.

## Files

- `invoke-human-ping.svg` — 1024 square icon, plate included.
- `invoke-human-ping-mark.svg` — transparent mark, same coordinates.
- `invoke-human-ping-1024.png`, `invoke-human-ping-512.png`, `invoke-human-ping-256.png` — rasters of the square icon. All three are RGB PNGs with no alpha channel. The 1024 file is the iOS and Mac app icon.
- `invoke-human-ping-64.svg` and `invoke-human-ping-64.png` — the same positions, for use at 64px and below. The three connector lines use stroke width 12 instead of 6 so they stay visible. The stem, squares, and head are unchanged.

Listings that ask for an SVG plus 512 and 256 PNGs should use the square icon files above. The 64px files are for a tiny slot, such as the ChatGPT composer icon. Each package under `plugins/` carries copies. The site serves the square SVG at `https://invokehumantool.com/brand/invoke-human-ping.svg`.
