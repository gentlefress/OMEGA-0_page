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
