/*
  Site content lives here so it is easy to edit without touching the
  page logic in main.js. Replace or add entries as the real catalogue
  and storefronts are confirmed.

  navTheme: "dark" or "light" — the colour the sticky nav's text/icons
  should turn to while this section is in view. "dark" means dark text
  (the section behind it is light), "light" means white text (the
  section behind it is dark).
*/

const ARTISTS = [
  {
    id: "frank-canvas",
    name: "Frank Canvas",
    tag: "Bold colour, layered abstraction",
    bg: "#EDEAE3",
    navTheme: "dark",
    logoBadge: "frank-canvas-signature.png",
    url: "https://frankcanvas.com/"
  },
  {
    id: "los-talgia",
    name: "Los-talgia",
    tag: "Nostalgic toy art from the 70s, 80s and 90s",
    bg: "#F5E7C4",
    navTheme: "dark",
    logoBadge: "lostalgia-logo.png",
    url: "https://los-talgia.com/"
  },
  {
    id: "konn-artiss",
    name: "Konn Artiss",
    tag: "Geometric line, sharp contrast",
    bg: "#0A0A0A",
    navTheme: "light",
    logoBadge: "konn-artiss-logo.png",
    url: null
  },
  {
       id: "zen-xander",
    name: "Zen Xander",
    tag: "Satirical prints in aid of real causes",
    bg: "#EAF1F3",
    bgImage: "zenxander-bg.jpg",
    navTheme: "light",
    logoBadge: "zenxander-logo.png",
    url: "https://zenxander.com/"
  },
  {
    id: "animal-gallery",
    name: "Animal Gallery",
    tag: "Wildlife portraiture, fine detail",
    bg: "linear-gradient(160deg, #6E6E6E 0%, #2A2A2A 100%)",
    navTheme: "light",
    logoBadge: null,
    url: null
  }
];

/*
  Real pieces only. "price" is a confirmed number, "priceLabel" is used
  when the exact price still needs confirming from the artist.
*/
const WORKS = [
    {
    id: "w1",
    title: "Space Rats \u2013 Red",
    artist: "Zen Xander",
    price: 250,
    url: "https://zenxander.com/products/space-rats-red",
    photo: "https://zenxander.com/cdn/shop/files/White-frame-None-mount-landscape_27.png?v=1763568300",
    image: "linear-gradient(160deg, #ECECEC 0%, #B8B8B8 100%)"
  },
  {
    id: "w2",
    title: "Tim Bear",
    artist: "Zen Xander",
    price: 250,
    url: "https://zenxander.com/products/tim-bear",
    photo: "https://zenxander.com/cdn/shop/files/White-frame-None-mount-landscape_8.png?v=1763568396",
    image: "linear-gradient(160deg, #D8D8D8 0%, #9E9E9E 100%)"
  },
  {
    id: "w3",
    title: "WWJD",
    artist: "Frank Canvas",
    price: null,
    priceLabel: "Price on request",
    url: "https://frankcanvas.com/product/wwjd",
    image: "linear-gradient(160deg, #4A4A4A 0%, #0A0A0A 100%)"
  },
  {
    id: "w4",
    title: "Playground Chaos I",
    artist: "Los-talgia",
    price: null,
    priceLabel: "Price on request",
    url: "https://los-talgia.com/product/playground-chaos-i",
    image: "linear-gradient(160deg, #D4D4D4 0%, #9A9A9A 100%)"
  }
];

/*
  Journal posts, newest first. "kicker", "excerpt" and "url" are optional;
  a post with a "url" links out to where the full piece lives.
*/
const JOURNAL = [
  {
    title: "Frank Canvas on colour, layering, and starting over",
    kicker: "In the studio",
    excerpt: "A short conversation about how a piece begins as one idea and ends as another, and why he never plans the final layer in advance.",
    url: "https://frankcanvas.com/"
  }
];

/*
  Where the contact form on about.html sends to. The site has no server,
  so the form opens the visitor's email app with their message filled in,
  addressed here. While this is null the form shows as "not connected".
*/
const CONTACT = {
  email: null
};

/*
  Homepage featured artwork, shown as a slideshow in the hero. "artist"
  is optional and appears beside the "Featured artwork" label; "position"
  is optional and moves the crop (CSS object-position) for that image.
  "imagePortrait" is optional: a separate image used on tall, narrow screens
  such as phones, where the main image would put its detail behind the text.
  It is anchored to its bottom edge, so keep the detail low in the frame.
*/
const FEATURED = [
  {
    image: "featured-konn-artiss.jpg",
    imagePortrait: "featured-konn-artiss-portrait.jpg",
    alt: "Mixed-media artwork by Konn Artiss: a glossy black disc bearing the name KONN ARTISS over layered yellow, red and black paint and torn posters",
    artist: "Konn Artiss",
    position: "center 100%"
  },
  {
    image: "featured-space-rats.jpg",
    alt: "Stencil artwork by Zen Xander of two rats in space helmets with spray-can air tanks, standing beside a rocket on a violet background",
    artist: "Zen Xander",
    position: "72% 75%"
  }
];
