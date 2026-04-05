import React from 'react';
import PackageCard from '../Cards/PackageCard';
import img1 from "../../images/hero5.jpg"
import img2 from "../../images/Pokhara.png"
import img3 from "../../images/Chitwansafari.jpg"

const HomePackages = () => {
  const dummyPackages = [
    {
      title: "Everest Base Camp",
      desc: "An eco-conscious trek through the Khumbu valley with luxury tea-house stays.",
      duration: "14 Days",
      price: "$1,450",
      category: "Adventure",
      location: "Solu-Khumbu",
      image: img1
    },
    {
      title: "Chitwan Wildlife Safari",
      desc: "Sustainability-focused jungle tours to witness the rare One-Horned Rhino.",
      duration: "3 Days",
      price: "$350",
      category: "Nature",
      location: "Chitwan",
      image: img3
    },
    {
      title: "Pokhara Lakeside Retreat",
      desc: "A calm, cultural escape beside the pristine waters of Phewa Lake.",
      duration: "5 Days",
      price: "$550",
      category: "Relaxation",
      location: "Pokhara",
      image: img2
    }
  ];

  return (
    <section className="py-24 bg-white font-['Montserrat']">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h4 className="text-emerald-500 font-black uppercase tracking-[0.5em] text-[10px] mb-4">
            Curated Experiences
          </h4>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-none">
            Our Best <span className="text-emerald-500">Packages</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyPackages.map((pkg, index) => (
            <PackageCard key={index} data={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePackages;