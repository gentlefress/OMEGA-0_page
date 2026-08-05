# Omega-0 Project Page

A dependency-free research project page inspired by the information architecture of the SONIC project site. It is ready to host on GitHub Pages.

## Customize

The page content is populated from the ω-0 paper. Update the paper, arXiv, code, dataset, demo, and author links in `index.html` once their public URLs are available.

For videos, replace a `.media-placeholder` block with:

```html
<video autoplay muted loop playsinline poster="assets/poster.webp">
  <source src="assets/demo.mp4" type="video/mp4" />
</video>
```

Then add the media files under an `assets/` directory. Keep videos compressed for fast loading.

The ω-HOME section reserves three dataset video slots. Their suggested filenames are `dataset_loco_manipulation.mp4`, `dataset_collection.mp4`, and `dataset_modalities.mp4`. Replace the corresponding `.dataset-video-placeholder` element with the `<video>` markup above; dataset videos already have responsive sizing in `styles.css`.

## Publish with GitHub Pages

1. Push this directory to a GitHub repository.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`, then save.

The site uses only relative paths and works from both user and project GitHub Pages URLs.

## Replace colors in SVG files

Use the Python helper to replace an exact color token
(case-insensitively) in SVG attributes, inline styles, and embedded CSS. This
includes element `background` and `background-color` declarations:

```bash
# Write assets/figures/teaser_final.recolored.svg (keeps the original)
uv run python scripts/replace_svg_color.py assets/figures/teaser_final.svg '#ff0000' '#2563eb'

# Preview a recursive batch replacement
uv run python scripts/replace_svg_color.py assets/figures '#ff0000' '#2563eb' -r --dry-run

# Replace all matching files in place
uv run python scripts/replace_svg_color.py assets/figures '#ff0000' '#2563eb' -r --in-place
```

Pass `-o OUTPUT` to choose an output file or directory. By default, changed
files are written beside the originals with the `.recolored.svg` suffix. The
script preserves the SVG's formatting and only replaces complete color tokens,
and recognizes equivalent common CSS spellings. For example, `#fff`, `#ffffff`,
`rgb(255, 255, 255)`, and Inkscape's `rgb(100%, 100%, 100%)` are treated as the
same source color.

Colors close to the source are replaced as well. The default maximum Euclidean
RGB distance is `10`; adjust it with `--tolerance` (`0` means exact matching):

```bash
uv run python scripts/replace_svg_color.py figure.svg '#ffffff' '#2563eb' --tolerance 20
```

Base64-embedded PNG, JPEG, WebP, and BMP `<image>` elements are processed too:
every pixel whose RGB value exactly matches the source color is replaced while
its alpha value is preserved. JPEG is lossy, so saving an embedded JPEG can
slightly alter nearby pixel values. External raster files referenced by path or
URL are not modified.
