import { Category } from 'src/types';

import img_rebirth from "src/images/mind_to_infinity_80_by_60_COMP.jpg";
import img_rebirth_mu1 from "src/images/mind_to_infinity_mu1.png";
import img_rebirth_mu2 from "src/images/mind_to_infinity_mu2.png";

import img_warrior from "src/images/victory_60_by_60.jpg";
import img_summer_party from "src/images/summer_party_80_by_60_COMP.jpg";
import img_summer_party_mu1 from "src/images/summer_party_mu1.png";
import windmill from "src/images/windmill_60_by_45_COMP.jpg";
import windmill_mu1 from "src/images/windmill_mu1.png";
import abstr_greece from "src/images/abstract_greece_COMP.jpg";
import agnes from "src/images/agnes_COMP.jpg";
import agnes_mu1 from "src/images/agnes_mu1.jpg";
import cat_dinner from "src/images/cat_dinner_50_by_60_COMP.jpg";
import dogs from "src/images/dogs_COMP.jpg";
import dogs_mu1 from "src/images/dogs_mu1.jpg";
import figure from "src/images/figure_COMP.jpg";
import khole from "src/images/khole_60_by_45_COMP.jpg";
import lady1 from "src/images/lady_1_COMP.jpg";
import lady1_mu1 from "src/images/lady_1_mu1.jpg";
import lady2 from "src/images/lady_2_COMP.jpg";
import monster from "src/images/monster_COMP.jpg";
import overpass from "src/images/overpass_70_by_50_COMP.jpg";
import overpass_mu1 from "src/images/overpass_mu1.png";
import paradise1 from "src/images/paradise_1_COMP.jpg";
import paradise2 from "src/images/paradise_2_COMP.jpg";
import paradise3 from "src/images/paradise_3_COMP.jpg";
import perm_vacation from "src/images/perm_vacation.jpg";
import perm_vacation_mu1 from "src/images/perm_vacation_mu1.jpg";
import shapes from "src/images/shapes_COMP.jpg";
import shapes_mu1 from "src/images/shapes_mu1.jpg";
import pink from "src/images/pink_COMP.jpg";
import orange from "src/images/orange_COMP.jpg";
import blue from "src/images/blue_COMP.jpg";
import abstractX from "src/images/abstractX_COMP.jpg";
import abstractX_mu1 from "src/images/abstractX_mu.jpg";
import squid from "src/images/squid_50_by_60_COMP.jpg";
import cubens from "src/images/cubensis_80_by_60_COMP.jpg";
import frank from "src/images/Frankestenstein_50_by_50_COMP.jpg";
import man_snake from "src/images/man_snake_60_by_90_COMP.jpg";
import man_snake_mu1 from "src/images/man_snake_60_by_90_mu1.jpg";
import man_snake_mu2 from "src/images/man_snake_60_by_90_mu2.jpg";
import pirranhas from "src/images/Parrhanas_60_by_90_COMP.jpg";
import desynchronicity from "src/images/desynchronicity_60_by_90_COMP.jpg";
import desynchronicity_mu1 from "src/images/desynchronicity_60_by_90_mu1.jpg";
import desynchronicity_mu2 from "src/images/desynchronicity_60_by_90_mu2.jpg";
import desynchronicity_mu3 from "src/images/desynchronicity_60_by_90_mu3.jpg";
import desynchronicity_mu4 from "src/images/desynchronicity_60_by_90_mu4.jpg";

import deity from "src/images/deity_60_by_45.jpg";
import deity_mu1 from "src/images/deity_60_by_45_mu1.jpg";
import deity_mu2 from "src/images/deity_60_by_45_mu2.jpg";

import octopus from "src/images/octopus_90_by_60_COMP.jpg";
import octopus_mu1 from "src/images/octopus_90_by_60_mu1.jpg";
import octopus_mu2 from "src/images/octopus_90_by_60_mu2.jpg";
import octopus_mu3 from "src/images/ocotpus_90_by_60_mu3.jpg";
import octopus_mu4 from "src/images/octopus_90_by_60_mu4.jpg";
import octopus_mu5 from "src/images/octopus_90_by_60_mu5.jpg";

import ship from "src/images/ship_60_by_45_COMP.jpg";
import ship_mu1 from "src/images/ship_60_by_45_mu1.jpg";
import ship_mu2 from "src/images/ship_60_by_45_mu2.jpg";
import ship_mu3 from "src/images/ship_60_by_45_mu3.jpg";

import img_rebirth_mu3 from "src/images/mind_to_infinity_80_by_60_mu1.jpg";
import img_rebirth_mu4 from "src/images/mind_to_infinity_80_by_60_mu2.jpg";
import img_rebirth_mu5 from "src/images/mind_to_infinity_80_by_60_mu3.jpg";
import img_rebirth_mu6 from "src/images/mind_to_infinity_80_by_60_mu4.jpg";

import pirranhas_mu1 from "src/images/Parrhanas_60_by_90_mu1.jpg";
import pirranhas_mu2 from "src/images/Parrhanas_60_by_90_mu2.jpg";
import pirranhas_mu3 from "src/images/Parrhanas_60_by_90_mu3.jpg";
import pirranhas_mu4 from "src/images/Parrhanas_60_by_90_mu4.jpg";

import img_warrior_mu1 from "src/images/victory_80_by_60_mu1.jpg";
import img_warrior_mu2 from "src/images/victory_80_by_60_mu2.jpg";
import img_warrior_mu3 from "src/images/victory_80_by_60_mu3.jpg";

import blue_mu1 from "src/images/blue_60_by_40_mu1.jpg";
import blue_mu2 from "src/images/blue_60_by_40_mu2.jpg";

const { Abstract, Figurative, Portrait } = Category;

/** @type {import('src/types').Pic[]} */
const pics = [
    {
        slug: "abstract-untitled",
        title: "ABSTRACT UNTITLED -",
        category: [Abstract],
        img: [img_rebirth, img_rebirth_mu1, img_rebirth_mu2, img_rebirth_mu3, img_rebirth_mu4, img_rebirth_mu5, img_rebirth_mu6],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "350€ + PPH"
    },
    {
        slug: "man-wrestling-snake",
        title: "Man wrestling snake",
        category: [Abstract],
        img: [man_snake, man_snake_mu1, man_snake_mu2],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 90cm)",
        price: "450€ + PPH"
    },
    {
        slug: "deity",
        title: "Deity",
        category: [Abstract],
        img: [deity, deity_mu1, deity_mu2],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 45cm)",
    },
    {
        slug: "octopus",
        title: "Octopus",
        category: [Abstract],
        img: [octopus, octopus_mu1, octopus_mu2, octopus_mu3, octopus_mu4, octopus_mu5],
        spec: "Acrylic on stretched canvas",
        dimensions: "(90cm by 60cm)",
    },
    {
        slug: "ship",
        title: "Ship",
        category: [Abstract],
        img: [ship, ship_mu1, ship_mu2, ship_mu3],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 45cm)",
    },
    {
        slug: "pirranhas",
        title: "Pirranhas",
        category: [Abstract],
        img: [pirranhas, pirranhas_mu1, pirranhas_mu2, pirranhas_mu3, pirranhas_mu4],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 90cm)",
        price: "450€ + PPH"
    },
    {
        slug: "keyhole",
        title: "Keyhole - ",
        category: [Abstract],
        img: [khole],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "100€ + PH"
    },
    {
        slug: "desynchronicity",
        title: "Desynchronicity",
        category: [Abstract],
        img: [desynchronicity, desynchronicity_mu1, desynchronicity_mu2, desynchronicity_mu3, desynchronicity_mu4],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 90cm)",
        price: "450"
    },
    {
        slug: "cubendemensis",
        title: "Cubendemensis",
        category: [Abstract],
        img: [cubens],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 90cm)",
        price: "450"
    },
    {
        slug: "comunion-x",
        title: "Comunion X",
        category: [Figurative],
        img: [frank],
        spec: "Acrylic on stretched canvas",
        dimensions: "(60cm by 90cm)",
        price: "450"
    },
    {
        slug: "warrior",
        title: "Warrior",
        category: [Abstract],
        img: [img_warrior, img_warrior_mu1, img_warrior_mu2, img_warrior_mu3],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "300€ + PPH (frame included)"
    },
    {
        slug: "agnes",
        title: "Agnes - ",
        category: [Portrait],
        img: [agnes, agnes_mu1],
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",
        price: "100€ + PPH (frame included)"
    },
    {
        slug: "summer",
        title: "Summer ",
        category: [Abstract],
        img: [img_summer_party, img_summer_party_mu1],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "250€ + PPH"
    },
    {
        slug: "windmill",
        title: "Windmill -",
        category: [Abstract],
        img: [windmill, windmill_mu1],
        spec: "Acrylic on canvas board (60cm by 45cm) ",
        dimensions: "(60cm by 45cm)",
        price: "80€ + PPH",
        sold: true
    },
    {
        slug: "impressions-of-greece",
        title: "Impressions of Greece - ",
        category: [Abstract],
        img: [abstr_greece],
        spec: "Acrylic on paper ",
        dimensions: "(xxx)",
        price: "50€ + PPH"
    },
    {
        slug: "pink",
        title: "Pink ",
        category: [Abstract],
        img: [pink],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "150€ + PH",
        sold: true
    },
    {
        slug: "dinner-with-cat",
        title: "Dinner with Cat - ",
        category: [Abstract],
        img: [cat_dinner],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "100€ + PPH"
    },
    {
        slug: "dog-siblings",
        title: "Dog Siblings -",
        category: [Figurative],
        img: [dogs, dogs_mu1],
        spec: "Acrylic on canvas board ",
        dimensions: "(60cm by 45cm)",
        sold: true
    },
    {
        slug: "figure-1",
        title: "Figure #1 - ",
        category: [Portrait],
        img: [figure],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "50€ + PPH",
        sold: true
    },
    {
        slug: "lady-on-sofa",
        title: "Lady on Sofa -",
        category: [Figurative],
        img: [lady1, lady1_mu1],
        spec: "Acrylic on canvas board ",
        dimensions: "(60cm by 45cm)",
        price: "150€ + PH (frame included)"
    },
    {
        slug: "plasmodesmata",
        title: "Plasmodesmata",
        category: [Abstract],
        img: [blue, blue_mu1, blue_mu2],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "150€ + PH",
    },
    {
        slug: "figure-2",
        title: "Figure #2 - ",
        category: [Figurative],
        img: [lady2],
        spec: "Acrylic on paper ",
        dimensions: "(80cm by 60cm)",
        price: "30€ + PH",
    },
    {
        slug: "awaken-the-monster",
        title: "Awaken the Monster -",
        category: [Figurative],
        img: [monster],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "40€ + PH",
    },
    {
        slug: "squid",
        title: "Squid - ",
        category: [Abstract],
        img: [squid],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(50cm by 60cm)",
        price: "50€ + PH",
    },
    {
        slug: "abstract-x",
        title: "Abstract X - ",
        category: [Abstract],
        img: [abstractX, abstractX_mu1],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(40cm by 40cm)",
        price: "80€ + PH",
    },
    {
        slug: "overpass",
        title: "Overpass - ",
        category: [Abstract],
        img: [overpass, overpass_mu1],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
    },
    {
        slug: "paradise-1",
        title: "Stranger than paradise series #1 -",
        category: [Figurative],
        img: [paradise1],
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",
        sold: true
    },
    {
        slug: "paradise-2",
        title: "Stranger than paradise series #2 -",
        category: [Figurative],
        img: [paradise2],
        spec: "Acrylic on paper ",
        dimensions: "(80cm by 60cm)"
    },
    {
        slug: "paradise-3",
        title: "Stranger than paradise series #3 -",
        category: [Figurative],
        img: [paradise3],
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",
        sold: true
    },
    {
        slug: "the-literary-boor",
        title: "The literary boor - ",
        category: [Figurative],
        img: [perm_vacation, perm_vacation_mu1],
        spec: "Acrylic on paper   ",
        dimensions: "(60cm by 45cm)",
        price: "80€ + PH (frame included)",
    },
    {
        slug: "shapes",
        category: [Abstract],
        img: [shapes, shapes_mu1],
        spec: "Acrylic on paper ",
        dimensions: "(60cm by 45cm)",
    },
    {
        slug: "orange",
        title: "Orange ",
        category: [Abstract],
        img: [orange],
        spec: "Acrylic on stretched canvas ",
        dimensions: "(80cm by 60cm)",
        price: "150€ + PH",
    },

];

export default pics;
