import React from 'react';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  'All Products',
  'Fruits',
  'Vegetables',
  'Grocery Things',
  'Stationery Things',
];

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onSelectCategory(category)}
              className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-sky-100 text-sky-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
