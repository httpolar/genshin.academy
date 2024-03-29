import type { CharacterType } from "../character.schema";

import { Character } from "../character.schema";

const kamisato_ayaka: CharacterType = {
  id: "kamisato_ayaka",
  accentColor: "#96c3e8",

  name: "Kamisato Ayaka",
  description:
    "Daughter of the Yashiro Commission's Kamisato Clan from Inazuma. Dignified and elegant, wise and determined. Sincere and pleasant to others. Universally loved by the Inazuma people, she has earned the title of Shirasagi Himegimi.",
  region: "INAZUMA",
  birthday: [28, 9],

  rarity: 5,

  vision: "CRYO",
  weapon: "SWORD",

  constellations: [
    {
      level: 1,
      title: "Snowswept Sakura",
      description:
        "When Kamisato Ayaka's Normal or Charged Attacks deal Cryo DMG to opponents, it has a 50% chance of decreasing the CD of Kamisato Art: Hyouka by 0.3s. This effect can occur once every 0.1s.",
    },
    {
      level: 2,
      title: "Blizzard Blade Seki no To",
      description:
        "When casting Kamisato Art: Soumetsu, unleashes 2 smaller additional Frostflake Seki no To, each dealing 20% of the original storm's DMG.",
    },
    {
      level: 3,
      title: "Frostbloom Kamifubuki",
      description:
        "Increases the Level of Kamisato Art: Soumetsu by 3. Maximum upgrade level is 15.",
    },
    {
      level: 4,
      title: "Ebb and Flow",
      description:
        "Opponents damaged by Kamisato Art: Soumetsu's Frostflake Seki no To will have their DEF decreased by 30% for 6s.",
    },
    {
      level: 5,
      title: "Blossom Cloud Irutsuki",
      description: "Increases the Level of Kamisato Art: Hyouka by 3. Maximum upgrade level is 15.",
    },
    {
      level: 6,
      title: "Dance of Suigetsu",
      description:
        "Kamisato Ayaka gains Usurahi Butou every 10s, increasing her Charged Attack DMG by 298%. This buff will be cleared 0.5s after Ayaka's Charged ATK hits an opponent, after which the timer for this ability will restart.",
    },
  ],

  story: [],
};

export default Character.parse(kamisato_ayaka);
