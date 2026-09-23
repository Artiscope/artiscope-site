/*
  Site content lives here so it is easy to edit without touching the
  page logic in main.js. Replace or add entries as the real catalogue
  and storefronts are confirmed.
*/

const ARTISTS = [
  {
    id: "frank-canvas",
    name: "Frank Canvas",
    tag: "Bold colour, layered abstraction",
    gradient: "#EDEAE3",
    logoBadge: "frank-canvas-signature.png",
    url: "https://frankcanvas.com/"
  },
  {
    id: "los-talgia",
    name: "Los-talgia",
    tag: "Nostalgic toy art from the 70s, 80s and 90s",
    gradient: "#F5E7C4",
    logoBadge: "lostalgia-logo.png",
    url: "https://los-talgia.com/"
  },
  {
    id: "konn-artiss",
    name: "Konn Artiss",
    tag: "Geometric line, sharp contrast",
    gradient: "#0A0A0A",
    logoBadge: "konn-artiss-logo.png",
    url: null
  },
  {
    id: "zen-xander",
    name: "Zen Xander",
    tag: "Satirical prints in aid of real causes",
    gradient: "#EAF1F3",
    logoBadge: "zenxander-logo.png",
    url: "https://zenxander.com/"
  },
  {
    id: "animal-gallery",
    name: "Animal Gallery",
    tag: "Wildlife portraiture, fine detail",
    gradient: "linear-gradient(160deg, #808080 0%, #2E2E2E 100%)",
    url: null
  }
];

/*
  Two kinds of release card:
  - "featured": a specific, real piece with a title and price, linking
    straight to that product page.
  - "invite": no specific product confirmed yet, just points people to
    that artist's store.
*/
const RELEASES = [
  {
    id: "r1",
    kind: "featured",
    title: "Space Rats \u2013 Red",
    artist: "Zen Xander",
    price: 250,
    url: "https://zenxander.com/products/space-rats-red",
    gradient: "linear-gradient(160deg, #ECECEC 0%, #B8B8B8 100%)"
  },
  {
    id: "r2",
    kind: "invite",
    artist: "Frank Canvas",
    message: "New work is live on his own store.",
    url: "https://frankcanvas.com/",
    gradient: "linear-gradient(160deg, #4A4A4A 0%, #0A0A0A 100%)"
  },
  {
    id: "r3",
    kind: "invite",
    artist: "Los-talgia",
    message: "Fresh nostalgic prints just dropped.",
    url: "https://los-talgia.com/",
    gradient: "linear-gradient(160deg, #D4D4D4 0%, #9A9A9A 100%)"
  }
];

const JOURNAL = [
  { title: "Frank Canvas on colour, layering, and starting over" }
];
