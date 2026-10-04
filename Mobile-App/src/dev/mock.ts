
export const USE_MOCK = true;

export const mockUser = {
  displayName: 'Kutlwano Joao',
  email: 'mskutlwanojoao@gmail.com',
  getIdToken: async () => 'mock-token',
};

export const mockLogout = () => console.log('[mock] logout pressed');

export type MockRating = { guesthouse_id: string; guesthouse_name: string; city?: string; rating: number; comment?: string };


export const mockRatings: MockRating[] = [
  { guesthouse_id: 'g1', guesthouse_name: 'Thamalakane River House', city: 'Maun', rating: 5, comment: 'Clean rooms, fantastic riverside deck, solar power never dropped.' },
  { guesthouse_id: 'g2', guesthouse_name: 'Kalahari Rest Lodge', city: 'Kang', rating: 4, comment: 'Quiet and friendly hosts.' },
  { guesthouse_id: 'g3', guesthouse_name: 'Tati River Cottage', city: 'Francistown', rating: 4 },
];