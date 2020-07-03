/* istanbul ignore file */
export const RentalServiceFake = {
  findRentalOrThrow: jest.fn(),
  findRental: jest.fn(),
  updateReturned: jest.fn(),
  saveOne: jest.fn(),
  createRent: jest.fn(),
};
