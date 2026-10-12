// src/dev/guesthouseData.ts
export interface Guesthouse {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  availableRooms: number;
  isFeatured?: boolean;
}

export const INITIAL_GUESTHOUSES: Guesthouse[] = [
  {
    id: "1",
    name: "Serowe Serene Stay",
    location: "Serowe",
    pricePerNight: 450,
    availableRooms: 3,
    isFeatured: false,
  },
  {
    id: "2",
    name: "Palapye Luxury Oasis",
    location: "Palapye",
    pricePerNight: 750,
    availableRooms: 5,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Gaborone Central Inn",
    location: "Gaborone",
    pricePerNight: 380,
    availableRooms: 2,
    isFeatured: false,
  },
  {
    id: "4",
    name: "Maun Safari Lodge",
    location: "Maun",
    pricePerNight: 1200,
    availableRooms: 4,
    isFeatured: true,
  },
  {
    id: "5",
    name: "Kasane Riverfront Cabin",
    location: "Kasane",
    pricePerNight: 950,
    availableRooms: 1,
    isFeatured: true,
  },
];
