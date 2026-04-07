import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import blog1 from "../../images/hero8.jpg";
import blog2 from "../../images/manaslu.webp";
import blog3 from "../../images/Temple.jpg";
import blog4 from "../../images/hero3.jpg";

const BlogSection = () => {
  const trendingPosts = [
    {
      category: "Expedition",
      title: "The Silent Peaks of Manaslu",
      date: "Nov 02, 2025",
      image: blog2
    },
    {
      category: "Culture",
      title: "Monasteries & Morning Mist",
      date: "Oct 28, 2025",
      image: blog3
    },
    {
      category: "Guide",
      title: "Navigating High Altitude Safety",
      date: "Oct 15, 2025",
      image: blog4
    }
  ];

  return (
    <section className="py-24 px-6 bg-white font-montserrat" id='blogs'>
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="border-b border-slate-100 pb-10 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.4em] mb-3">Tomo Journal</p>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              Stories from <br/> <span className="text-slate-300">the Edge.</span>
            </h2>
          </div>
        </div>

        {/* --- ASYMMETRIC GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* FEATURED POST (Left - 7 Columns) */}
          <div className="lg:col-span-7 group cursor-pointer">
            <div className="relative overflow-hidden rounded-[2.5rem] mb-8 aspect-[16/10] shadow-2xl shadow-slate-200/50">
              <img 
                src={blog1} 
                alt="Featured trek" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute top-8 left-8">
                <span className="px-5 py-2 bg-slate-900/90 backdrop-blur text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
                  Featured Story
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <span>Oct 12, 2025</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>12 min read</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-tight group-hover:text-emerald-600 transition-colors">
                The Forgotten Trails of the Upper Mustang Region.
              </h3>
              <p className="text-slate-500 leading-relaxed max-w-xl">
                A journey into the forbidden kingdom, where ancient architecture meets the raw, desolate beauty of the Himalayan rain shadow.
              </p>
            </div>
          </div>

          {/* TRENDING POSTS (Right - 5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8 md:gap-10">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Trending Now</h4>
            
            {trendingPosts.map((post, idx) => (
              <div key={idx} className="group flex items-center gap-6 cursor-pointer">
                {/* Small Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-3xl overflow-hidden shadow-lg border-2 border-transparent group-hover:border-emerald-500 transition-all duration-500">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <span className="text-emerald-600 text-[9px] font-black uppercase tracking-widest mb-1 block">
                    {post.category}
                  </span>
                  <h5 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h5>
                  <div className="flex items-center gap-2 text-slate-400 text-[9px] font-bold uppercase">
                    <span>{post.date}</span>
                    <ChevronRight size={10} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Added a subtle call to action button at the bottom since the newsletter was removed */}
            {/* <div className="mt-6 pt-6 border-t border-slate-50">
               <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-emerald-600 transition-all group">
                View All Journal Entries <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div> */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default BlogSection;