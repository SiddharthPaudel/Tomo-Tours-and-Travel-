import React from 'react';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';
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
          {/* <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-emerald-600 transition-colors border-b-2 border-slate-900 hover:border-emerald-600 pb-1">
            Explore All Articles <ArrowRight size={14} />
          </button> */}
        </div>

        {/* --- ASYMMETRIC GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* FEATURED POST (Left - 7 Columns) */}
          <div className="lg:col-span-7 group cursor-pointer">
            <div className="relative overflow-hidden rounded-[2rem] mb-8 aspect-[16/10]">
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
          <div className="lg:col-span-5 flex flex-col gap-10">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Trending Now</h4>
            
            {trendingPosts.map((post, idx) => (
              <div key={idx} className="group flex items-center gap-6 cursor-pointer">
                {/* Small Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden shadow-lg border-2 border-transparent group-hover:border-emerald-500 transition-all">
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

            {/* Newsletter Mini-Card */}
            <div className="mt-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
              <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Get the Digest</h5>
              <p className="text-xs text-slate-500 mb-4">Adventure insights delivered weekly.</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Email" className="flex-1 bg-white border border-slate-200 rounded-lg px-4 text-xs focus:outline-none focus:border-emerald-500" />
                <button className="p-3 bg-slate-900 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BlogSection;