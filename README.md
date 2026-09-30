# Sukkar Site

A static site for Sukkar (sugarcane juice pop-up). No build step required — just open `index.html` in a browser, or use a simple local server (e.g. the VS Code "Live Server" extension) for the best experience.

## Structure

```
sukkar-site/
├── index.html        # Page markup for every route (Home, About, Book Us, Events, Contact, Privacy)
├── css/
│   └── styles.css    # All site styles
├── js/
│   └── main.js        # Routing, calendar, light-toggle animations, form handling
└── images/            # All photos and illustrations used on the site
```

## Notes

- This is a single-page app: `main.js` swaps which `.page` div is visible based on the URL hash (`#/`, `#/about`, `#/book`, `#/events`, `#/contact`).
- The canopy/market illustrations use small overlay "halo" elements (CSS glow dots) positioned by percentage coordinates in `main.js` (`STAND_BULBS` array and the `TENT_LINES` wire generator) to line up with the light bulbs drawn in the artwork.
- The contact form posts to Netlify Forms (`data-netlify="true"`) — it expects to be deployed on Netlify, or you'll need to wire up your own form handler.
