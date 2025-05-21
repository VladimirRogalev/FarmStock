// // import { useEffect, useState } from 'react';
//
// type  SurpriseBag = {
// 	id: string;
// 	name: string;
// 	price: number;
// 	description: string;
// 	image: string;
// 	quantity: number;
// 	category: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// 	deletedAt: Date;
// };
//
// const mockSurpriseBag: SurpriseBag[] = [
// 	{
// 		id: '1',
// 		name: 'Galilee Fruit Pack',
// 		description: 'Juicy apples, pears, and figs from local farms.',
// 		price: 25,
// 		image: 'https://www.rootsplants.co.uk/cdn/shop/files/Mini_Orchard_Collection_Apple_Pear_Plum.jpg?crop=center&height=620&v=1742395255&width=620',
// 		quantity: 10,
// 		category: 'fruits',
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		deletedAt: null as any
// 	},
// 	{
// 		id: '2',
// 		name: 'Vegetable Mix',
// 		description: 'A fresh assortment of locally grown vegetables.',
// 		price: 18,
// 		image: 'https://freshforward.wpenginepowered.com/wp-content/uploads/2021/01/locally-grown-produce-1536x1024.jpeg',
// 		quantity: 15,
// 		category: 'vegetables',
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		deletedAt: null as any
// 	},
// 	{
// 		id: '3',
// 		name: 'Farmer’s Surprise',
// 		description: 'Each bag contains a random mix of seasonal produce.',
// 		price: 20,
// 		image: 'https://www.marthastewart.com/thmb/ss0fVAXAReJJAIoMizh7yY4e-wY=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/fruits-vegetables-what-season-when-getty-0323-2df940a74f2847fdaafbc7932746d16d.jpg',
// 		quantity: 8,
// 		category: 'mixed',
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		deletedAt: null as any
// 	}
// ];
//
// // export function Home() {
// // 	const [surpriseBags, setSurpriseBags] = useState<SurpriseBag[]>([]);
// // 	useEffect(() => {
// // 		const shuffled = mockSurpriseBag.sort(() => 0.5 - Math.random());
// // 		setSurpriseBags(shuffled.slice(0, 2));
// // 	}, []);
// // 	return <div>Home</div>;
// // }
