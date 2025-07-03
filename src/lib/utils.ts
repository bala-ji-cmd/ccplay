import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import confetti from 'canvas-confetti';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fireConfetti = () => {
  // First burst - center
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.6 }
  });

  // Delayed side bursts
  setTimeout(() => {
    // Left side burst
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { x: 0, y: 0.6 },
      angle: 60,
      colors: ['#9B6DFF', '#7DD181', '#FFE66D']
    });

    // Right side burst
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { x: 1, y: 0.6 },
      angle: 120,
      colors: ['#9B6DFF', '#7DD181', '#FFE66D']
    });
  }, 200);

  // Final top burst
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { x: 0.5, y: 0 },
      gravity: 0.8,
      ticks: 400
    });
  }, 400);
};

export const getRandomItem = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

export const generateRandomName = (): string => {
  const adjectives: string[] = [
    "Happy", "Silly", "Bright", "Sparkly", "Wobbly", "Zany",
    "Magical", "Dancing", "Playful", "Bouncy", "Giggly", "Colorful",
    "Brave", "Curious", "Friendly", "Sneaky", "Speedy", "Tiny",
    "Giant", "Sleepy", "Singing", "Flying"
  ];

  const nouns: string[] = [
    "Doodle", "Picture", "Creation", "Masterpiece", "Imagination", "Drawing",
    "Sketch", "Adventure", "Story", "Wonder", "Dream", "Fantasy",
    "World", "Land", "Kingdom", "Galaxy", "Forest", "Ocean",
    "Castle", "House", "Playground", "Party", "Journey", "Surprise"
  ];

  const characters: string[] = [
    "Mickey", "Minnie", "Goofy", "Donald", "Daisy",
    "SpongeBob", "Patrick", "Sandy",
    "Peppa", "George",
    "Bluey", "Bingo",
    "Pikachu", "Charmander",
    "Sonic", "Tails"
  ];

  const actions: string[] = [
    "LovesToDraw", "IsPainting", "MakesArt", "ImaginesThings", "DreamsBig",
    "GoesOnAdventure", "ExploresTheWorld", "PlaysGames", "HasFun", "SingsLoud",
    "BuildsCastles", "FindsTreasure"
  ];

  const places: string[] = [
    "Wonderland", "Neverland", "CandyKingdom", "BikiniBottom",
    "TheSavanna", "OuterSpace", "RainbowRoad", "PirateShip"
  ];

  const randomAdjective = getRandomItem(adjectives);
  const randomNoun = getRandomItem(nouns);
  const randomCharacter = getRandomItem(characters);
  const randomAction = getRandomItem(actions);
  const randomPlace = getRandomItem(places);
  const randomNumber = Math.floor(Math.random() * 100);

  const structureOptions: string[] = [
    `${randomAdjective}${randomNoun}${randomNumber}`,
    `${randomCharacter}${randomAction}`,
    `${randomAdjective}In${randomPlace}`,
    `${randomCharacter}The${randomNoun}`,
    `${randomAction}With${randomCharacter}`
  ];

  return getRandomItem(structureOptions);
};

export const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};
