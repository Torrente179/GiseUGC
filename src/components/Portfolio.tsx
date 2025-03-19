
import { useState } from 'react';
import { Play, Maximize } from 'lucide-react';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'tech', name: 'Tech' },
    { id: 'lifestyle', name: 'Lifestyle' }
  ];

  const portfolioItems = [
    {
      id: 1,
      title: 'Summer Fashion Collection',
      category: 'fashion',
      thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'image'
    },
    {
      id: 2,
      title: 'Skincare Review Series',
      category: 'beauty',
      thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'video'
    },
    {
      id: 3,
      title: 'Tech Gadget Showcase',
      category: 'tech',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'image'
    },
    {
      id: 4,
      title: 'Home Decor Ideas',
      category: 'lifestyle',
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'image'
    },
    {
      id: 5,
      title: 'Makeup Tutorial',
      category: 'beauty',
      thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'video'
    },
    {
      id: 6,
      title: 'Athletic Wear Collection',
      category: 'fashion',
      thumbnail: 'https://images.unsplash.com/photo-1520999166575-37d109989923?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'image'
    },
    {
      id: 7,
      title: 'Smartphone Review',
      category: 'tech',
      thumbnail: 'https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'video'
    },
    {
      id: 8,
      title: 'Morning Routine',
      category: 'lifestyle',
      thumbnail: 'https://images.unsplash.com/photo-1498575732665-aac7705c2c7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'video'
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <section id="portfolio" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary/60 mb-3 uppercase tracking-wider">My Work</p>
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6">Featured Portfolio</h2>
          <div className="w-20 h-1 bg-primary/20 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-2 rounded-full text-sm transition-all ${
                activeFilter === category.id
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-primary hover:bg-primary/10'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group relative overflow-hidden rounded-xl shadow-sm hover-grow cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="aspect-w-16 aspect-h-9 w-full">
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <h3 className="text-white font-medium mb-1">{item.title}</h3>
                <p className="text-white/70 text-sm capitalize">{item.category}</p>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  {item.type === 'video' ? (
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-primary fill-primary" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                      <Maximize className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden animate-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-w-16 aspect-h-9 w-full bg-black">
              <img 
                src={selectedItem.thumbnail}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-medium">{selectedItem.title}</h3>
              <p className="text-muted-foreground capitalize">{selectedItem.category}</p>
            </div>
            <button 
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
              onClick={closeModal}
            >
              <X className="h-5 w-5 text-primary" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

import { X } from "lucide-react";

export default Portfolio;
