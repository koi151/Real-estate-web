import { RoomType } from "../../../backend/commonTypes";

// forSale => For Sale.  house => House
export const listingType = (word: string): string => {
  return word ? word.toLowerCase().startsWith('for') ? 
    `For ${word.slice(3)}` 
    : word.charAt(0).toUpperCase() + word.slice(1) : word;
};

// For Sale => forSale.  House => house
export const reverseListingType = (formattedWord: string): string => {
  if (!formattedWord) 
    return formattedWord;

  const [prefix, ...rest] = formattedWord.split(' ');

  return prefix.toLowerCase() === 'for' 
    ? `for${rest.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`
    : formattedWord.toLowerCase();
};

export const getRoomCount = (roomList: string[], type: RoomType) => {
  try {
    const room = roomList.find((f) => f.startsWith(`${type}-`));
    if (room) {
      const number = parseInt(room.split('-')[1], 10);
      return isNaN(number) ? null : number;
    }
    return null;

  } catch (error) {
    console.log('Error occurred in getRoomCount helper function:', error);
  }
}
