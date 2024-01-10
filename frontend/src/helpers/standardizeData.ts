// forSale => For Sale.  house => House
export const listingType = (word: string): string => {
  return word ? word.toLowerCase().startsWith('for') ? 
    `For ${word.slice(3)}` 
    : word.charAt(0).toUpperCase() + word.slice(1) : word;
};


type RoomType = "bedrooms" | "bathrooms" | "kitchens" | "livingRooms";

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
