export const markerHouseImg = "assets/img/house.png";
export const markerCityImg = "assets/img/smallcity.png";

export interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

export interface House {
  id:string;
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  price?: Price;
  url?:string;
  photo?:string;
  photos?:Photo[];
  address?:Address;
  marker?: Marker;
  type?: string;
  show_big_open_house?: boolean;
}

export class Listings {
  listings: House[];
}

export class Address {
  street?: string;
  city?: string;
  city_id?: number
  region?: string;
  province?: string;
  postal_code?:string;
  country?:string;
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

export const markers_declared =
[
    {
        latitude: 46.6123225,
        longitude: -72.7156227,
        title: "Grand-Mere"
    },
    {
        latitude: 46.6655206,
        longitude: -72.6249238,
        title: "Herouxville"
    },
    {
        latitude: 46.6218409,
        longitude: -72.628147,
        title: "Lac-a-la-Tortue"
    },
    {
        latitude: 46.4902378,
        longitude: -72.6663659,
        title: "Notre-Dame-du-Mont-Carmel"
    },
    {
        latitude: 46.3953949,
        longitude: -72.8795198,
        title: "Saint-Barnabe"
    },
    {
        latitude: 46.4987642,
        longitude: -72.8265911,
        title: "Saint-Boniface-de-Shawinigan"
    },
    {
        latitude: 46.4881512,
        longitude: -72.9623064,
        title: "Saint-Elie-de-Caxton",
    },
    {
        latitude: 46.4299709,
        longitude: -72.7780498,
        title: "Saint-Etienne-des-Gres"
    },
    {
        latitude: 46.5975099,
        longitude: -72.8245392,
        title: "Saint-Gerard-des-Laurentides"
    },
    {
        latitude: 46.5736319,
        longitude: -72.9297378,
        title: "Saint-Mathieu-du-Parc"
    },
    {
        latitude: 46.4714846,
        longitude: -72.5377148,
        title: "Saint-Maurice"
    },
    {
        latitude: 46.5633829,
        longitude: -72.4820078,
        title: "Saint-Narcisse"
    },
    {
        latitude: 46.418214,
        longitude: -73.0198445,
        title: "Saint-Paulin"
    },
    {
        latitude: 46.518729,
        longitude: -72.7435557,
        title: "Shawinigan-Sud"
    },
    {
        latitude: 46.5618296,
        longitude: -72.74353,
        title: "Shawinigan"
    },
    {
        latitude: 46.3426025,
        longitude: -72.562119,
        title: "Trois-Rivieres"
    },
    {
        latitude: 46.2809623,
        longitude: -72.8349377,
        title: "Yamachiche"
    }
];
