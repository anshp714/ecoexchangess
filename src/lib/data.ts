
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export type Listing = {
  id: string;
  title: string;
  seller: {
    name: string;
    avatarUrl: string;
  };
  price: number;
  unit: string;
  quantity: number;
  quantityUnit: string;
  location: string;
  image: {
    url: string;
    hint: string;
  };
  attributes: {
    type: string;
    quality: string;
    moisture: string;
    calorificValue: string;
  };
};

export type PurchaseHistory = {
  item: string;
  quantity: number;
  date: string;
  price: number;
};

export type SpendByCategory = {
    name: string;
    value: number;
}

export type Order = {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  product: string;
};


const findImage = (id: string): ImagePlaceholder => {
    return PlaceHolderImages.find(p => p.id === id) || { id: '', description: '', imageUrl: '', imageHint: '' };
};

export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'High-Quality Wheat Straw Bales',
    seller: {
      name: 'GreenFarms Inc.',
      avatarUrl: 'https://picsum.photos/seed/avatar1/40/40',
    },
    price: 12500,
    unit: 'INR',
    quantity: 50,
    quantityUnit: 'tons',
    location: 'California, USA',
    image: {
      url: findImage('listing-wheat-straw').imageUrl,
      hint: findImage('listing-wheat-straw').imageHint,
    },
    attributes: {
      type: 'Wheat Straw',
      quality: 'Premium Grade',
      moisture: '12%',
      calorificValue: '17.5 MJ/kg',
    },
  },
  {
    id: '2',
    title: 'Organic Corn Stover',
    seller: {
      name: 'Heartland Organics',
      avatarUrl: 'https://picsum.photos/seed/avatar2/40/40',
    },
    price: 10000,
    unit: 'INR',
    quantity: 100,
    quantityUnit: 'tons',
    location: 'Iowa, USA',
    image: {
      url: findImage('listing-corn-stover').imageUrl,
      hint: findImage('listing-corn-stover').imageHint,
    },
    attributes: {
      type: 'Corn Stover',
      quality: 'Standard Grade',
      moisture: '15%',
      calorificValue: '16.0 MJ/kg',
    },
  },
  {
    id: '3',
    title: 'Bulk Rice Husks for Biofuel',
    seller: {
      name: 'Delta Rice Co.',
      avatarUrl: 'https://picsum.photos/seed/avatar3/40/40',
    },
    price: 6500,
    unit: 'INR',
    quantity: 250,
    quantityUnit: 'tons',
    location: 'Arkansas, USA',
    image: {
      url: findImage('listing-rice-husks').imageUrl,
      hint: findImage('listing-rice-husks').imageHint,
    },
    attributes: {
      type: 'Rice Husks',
      quality: 'Utility Grade',
      moisture: '10%',
      calorificValue: '14.0 MJ/kg',
    },
  },
  {
    id: '4',
    title: 'Sugarcane Bagasse',
    seller: {
      name: 'Sunshine Sugars',
      avatarUrl: 'https://picsum.photos/seed/avatar4/40/40',
    },
    price: 8000,
    unit: 'INR',
    quantity: 500,
    quantityUnit: 'tons',
    location: 'Florida, USA',
    image: {
      url: findImage('listing-sugarcane-bagasse').imageUrl,
      hint: findImage('listing-sugarcane-bagasse').imageHint,
    },
    attributes: {
      type: 'Sugarcane Bagasse',
      quality: 'Standard Grade',
      moisture: '50%',
      calorificValue: '9.6 MJ/kg',
    },
  },
    {
    id: '5',
    title: 'Processed Wood Chips',
    seller: {
      name: 'Forestry Fuels',
      avatarUrl: 'https://picsum.photos/seed/avatar5/40/40',
    },
    price: 16000,
    unit: 'INR',
    quantity: 80,
    quantityUnit: 'tons',
    location: 'Oregon, USA',
    image: {
      url: findImage('listing-wood-chips').imageUrl,
      hint: findImage('listing-wood-chips').imageHint,
    },
    attributes: {
      type: 'Wood Chips',
      quality: 'Premium Grade',
      moisture: '20%',
      calorificValue: '19.0 MJ/kg',
    },
  },
];


export const mockPurchaseHistory: PurchaseHistory[] = [
  { item: 'Corn Stover', quantity: 20, date: '2024-01-15', price: 200000 },
  { item: 'Corn Stover', quantity: 22, date: '2024-02-14', price: 220000 },
  { item: 'Wheat Straw', quantity: 15, date: '2024-03-10', price: 187500 },
  { item: 'Corn Stover', quantity: 25, date: '2024-03-16', price: 250000 },
  { item: 'Rice Husks', quantity: 50, date: '2024-04-05', price: 325000 },
  { item: 'Corn Stover', quantity: 23, date: '2024-04-18', price: 230000 },
  { item: 'Wheat Straw', quantity: 18, date: '2024-05-12', price: 225000 },
  { item: 'Corn Stover', quantity: 26, date: '2024-05-20', price: 260000 },
];

export const mockSpendByCategory: SpendByCategory[] = mockPurchaseHistory.reduce((acc, purchase) => {
    const existingCategory = acc.find(cat => cat.name === purchase.item);
    if (existingCategory) {
        existingCategory.value += purchase.price;
    } else {
        acc.push({ name: purchase.item, value: purchase.price });
    }
    return acc;
}, [] as SpendByCategory[]);


export const mockOrders: Order[] = [
    { id: 'ORD001', customer: 'BioEnergy Corp', date: '2024-05-28', amount: 125000, status: 'Shipped', product: 'Wheat Straw' },
    { id: 'ORD002', customer: 'Central Biogas', date: '2024-05-27', amount: 200000, status: 'Processing', product: 'Corn Stover' },
    { id: 'ORD003', customer: 'Southern Renewables', date: '2024-05-25', amount: 81250, status: 'Delivered', product: 'Rice Husks' },
    { id: 'ORD004', customer: 'Gulf Power', date: '2024-05-24', amount: 400000, status: 'Delivered', product: 'Sugarcane Bagasse'},
    { id: 'ORD005', customer: 'Eco-Gen Solutions', date: '2024-05-22', amount: 150000, status: 'Cancelled', product: 'Wheat Straw' },
];
