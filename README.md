# Tarot Reader's Desk

A tarot reference and reading tool built from *Tarot Secrets Unveiled* Vol I and Vol II.

## Folder layout
```
index.html          page shell
css/style.css       all styling (colours are CSS variables at the top)
js/app.js           the app
data/cards.js       the 78 cards (meanings, reversed text, associations, image file name)
data/library.js     full book chapters (Books tab)
data/reference.js   zodiac, planets, houses, year numbers
data/remedies.js    gems, crystals, chakras, rudraksha, yantras, angels, Kabbalah, guide
images/cards/       card images (PNG). See images/cards/README.txt for the naming
.nojekyll           tells GitHub Pages to serve files as they are
```

## Change the card pictures
Replace or add PNG files in `images/cards/` using the same file names. Each card's file name is the `img` field in `data/cards.js`.

## Host on GitHub Pages
1. Upload everything in this folder to a repository (keep the folders).
2. Settings, Pages, Deploy from a branch, `main`, `/ (root)`.
3. Open `https://<your-username>.github.io/<repository>/`.

To test on your computer, double-click `index.html` (works as is), or run `python3 -m http.server` in this folder and open http://localhost:8000.

Saved cards and readings are stored in each visitor's browser (localStorage).
The data folder holds the full text of both books and the card images are a third-party deck: make sure you may publish them before making the repository public.
