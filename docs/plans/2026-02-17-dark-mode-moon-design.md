# Dark Mode Moon Design

## Summary

Transform the existing Sun element into a hyper-detailed Moon when dark mode is activated, with crater detail, surface texture, and cool blue-silver moonlight illuminating the sky layer.

## Approach

**Pure CSS** - Transform existing `.sun-core`, `.sun-glow`, `.sun-halo`, `.sun-rays` elements using `.dark` CSS selectors. Craters via `box-shadow` on pseudo-elements. Moonlight via color shifts on existing glow layers.

## Moon Core (`.sun-core` in dark mode)

- Shrinks from 160px to ~120px radius
- `radial-gradient` shifts from warm yellow/orange to cool silver-white (`#e8e8f0` center -> `#c0c0d0` edge)
- Maria (dark lunar seas) via subtle `radial-gradient` overlay with blue-grey patches
- 8-10 `box-shadow` craters on `::before` pseudo-element, varying sizes (4px-15px), positioned to mimic real lunar crater distribution
- Terminator shadow via `linear-gradient` on `::after` to darken one edge for 3D depth

## Moonlight Effects

- **Inner glow** (`.sun-glow`): Warm yellow -> cool `rgba(180, 200, 255, 0.15)`, 500px radius
- **Outer halo** (`.sun-halo`): Cool blue `rgba(150, 180, 230, 0.06)`, 1000px radius, 10s pulse
- **Moonbeams** (`.sun-rays`): Silver-blue `conic-gradient`, opacity ~0.04, rotation slows to 200s
- **Sky tint**: `radial-gradient` overlay on sky layer adds faint blue-silver wash near moon position

## Transition Animation

- 1s ease-in-out on all properties
- Color shift starts immediately, size at 0.2s, craters fade in at 0.4s, moonlight completes at 0.8s
- `prefers-reduced-motion`: instant state change, no animations

## Files to Modify

- `src/pages/index.astro` - Sun/moon element styles (`.sun-core`, `.sun-glow`, `.sun-halo`, `.sun-rays` dark mode variants)

## Decisions

- **Placement**: Sun morphs into Moon (same element, CSS transforms)
- **Detail level**: Hyper-detailed with craters, maria, moonlight rays
- **Transition**: Smooth morph over 1s
- **Approach**: Pure CSS (zero JS overhead, GPU-accelerated)
