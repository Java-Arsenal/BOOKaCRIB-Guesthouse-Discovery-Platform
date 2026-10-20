
export const USE_MOCK = true;
export const USE_MOCK_RATINGS = false;

export const mockUser = {
  displayName: 'Kutlwano Joao',
  email: 'mskutlwanojoao@gmail.com',
  getIdToken: async () => 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjkwNGIwZjkxYmU2ZWIwODY3ZGFiYmFhYjU4N2RmYzJlMzNmMDBhMjQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYm9va2FjcmliLWRldi1jMjg3MyIsImF1ZCI6ImJvb2thY3JpYi1kZXYtYzI4NzMiLCJhdXRoX3RpbWUiOjE3OTIwNDcyNDMsInVzZXJfaWQiOiJlNDFha1ExTjNHZXB3RE45MzdyMHExbGR6c3oyIiwic3ViIjoiZTQxYWtRMU4zR2Vwd0ROOTM3cjBxMWxkenN6MiIsImlhdCI6MTc5MjA0NzI0MywiZXhwIjoxNzkyMDUwODQzLCJlbWFpbCI6ImJhY2tlbmR0ZXN0MDFAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYmFja2VuZHRlc3QwMUBleGFtcGxlLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.FJEV2uY1ukrXoltN0AIgwWp1fav9Up02GaldmK1SAG9lvzvlpRg34H9yJDTEGudMK-SGg8J6Q2Q66_nGNl7z2ci0Es088EfCr15WifbbRY2pYwhFO1txhhfFUc5IxS0Xl0qqVMx1vFOb91UQzRbIAzYCRl-3evEjQbbhD85ev89FkyQlkd2X7ah51GQn-d_5S98a9zPy4YpRt2VApAXwamA4Z3VkjqgZkCAHD0psDyR2CYLf7qbYpypCLmph1G8-Y5kEOZiEsaID8gurUyNTgnGpjSkTKa_ObkqLfP_wegkX8r5aaqF5a4E1x1YUohePxPaEfXv-X_oE2HjDtS9R5w',
};

export const mockLogout = () => console.log('[mock] logout pressed');

export type MockRating = { guesthouse_id: string; guesthouse_name: string; city?: string; rating: number; comment?: string };


export const mockRatings: MockRating[] = [
  { guesthouse_id: 'g1', guesthouse_name: 'Thamalakane River House', city: 'Maun', rating: 5, comment: 'Clean rooms, fantastic riverside deck, solar power never dropped.' },
  { guesthouse_id: 'g2', guesthouse_name: 'Kalahari Rest Lodge', city: 'Kang', rating: 4, comment: 'Quiet and friendly hosts.' },
  { guesthouse_id: 'g3', guesthouse_name: 'Tati River Cottage', city: 'Francistown', rating: 4 },
];