import { Client } from 'pg';
import { readProductsList } from '../index';

jest.mock('pg', () => {
  const mockClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mockClient) };
});

describe('readProductsList', () => {
  it('should retrieve the list of products, default 5', async () => {
    const sampleResponse = [
      {
        id: 1,
        name: 'Camo Onesie',
        slogan: 'Blend in to your crowd',
        description:
          'The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.',
        category: 'Jackets',
        default_price: 140,
      },
      {
        id: 2,
        name: 'Bright Future Sunglasses',
        slogan: "You've got to wear shades",
        description:
          "Where you're going you might not need roads, but you definitely need some shades. Give those baby blues a rest and let the future shine bright on these timeless lenses.",
        category: 'Accessories',
        default_price: 69,
      },
      {
        id: 3,
        name: 'Morning Joggers',
        slogan: 'Make yourself a morning person',
        description:
          "Whether you're a morning person or not.  Whether you're gym bound or not.  Everyone looks good in joggers.",
        category: 'Pants',
        default_price: 40,
      },
      {
        id: 4,
        name: "Slacker's Slacks",
        slogan: 'Comfortable for everything, or nothing',
        description: "I'll tell you how great they are after I nap for a bit.",
        category: 'Pants',
        default_price: 65,
      },
      {
        id: 5,
        name: 'Heir Force Ones',
        slogan: 'A sneaker dynasty',
        description:
          "Now where da boxes where I keep mine? You should peep mine, maybe once or twice but never three times. I'm just a sneaker pro, I love Pumas and shell toes, but can't nothin compare to a fresh crispy white pearl",
        category: 'Kicks',
        default_price: 99,
      },
    ];
    // const response = await readProductsList();
    // console.log('response:', response);

    // expect(response.length).toEqual(sampleResponse.length);
  });
});
