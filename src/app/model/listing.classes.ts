export class Listings {
  listings: Listing[];
}
export class Listing {
  address: Address;
  photos: Photo[];
  price: Price;
  type: string;
  id: string;
  url: string;
  photo: string;
  show_big_open_house: boolean;
}

export class Address {
  street: string;
  city: string;
  city_id: number
  region: string;
  province: string;
}

export class Photo {
  is_primary: boolean;
  alternative_text: string;
  formats: Formats;
}

export class Price{
  raw: number;
  display: string;
  term: string;
}

export class Formats {
  100: string;
  155: string;
  320: string;
  600: string;
  1024: string;
  1600: string;
}
