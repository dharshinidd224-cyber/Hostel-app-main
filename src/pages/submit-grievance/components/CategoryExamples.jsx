import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CategoryExamples = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const examples = [
    {
      category: 'water',
      title: 'Water Issues',
      icon: 'Droplet',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      items: [
        'Water tap leaking continuously',
        'No water supply in bathroom',
        'Low water pressure in shower',
        'Hot water not working in geyser'
      ]
    },
    {
      category: 'electricity',
      title: 'Electricity Issues',
      icon: 'Zap',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      items: [
        'Frequent power cuts in room',
        'Light bulb not working',
        'Fan making unusual noise',
        'Socket not functioning properly'
      ]
    },
    {
      category: 'food',
      title: 'Food Issues',
      icon: 'Utensils',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      items: [
        'Food quality not up to standard',
        'Unhygienic food preparation',
        'Insufficient food quantity',
        'Menu variety concerns'
      ]
    },
    {
      category: 'internet',
      title: 'Internet Issues',
      icon: 'Wifi',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      items: [
        'WiFi not connecting in room',
        'Very slow internet speed',
        'Frequent disconnections',
        'Unable to access certain websites'
      ]
    },
    {
      category: 'cleanliness',
      title: 'Cleanliness Issues',
      icon: 'Sparkles',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      items: [
        'Bathroom not cleaned regularly',
        'Garbage not collected on time',
        'Common area needs cleaning',
        'Pest control required'
      ]
    },
    {
      category: 'security',
      title: 'Security Issues',
      icon: 'Shield',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      items: [
        'Gate lock not working properly',
        'Unauthorized person entry',
        'CCTV camera not functioning',
        'Security guard absent during duty'
      ]
    }
  ];

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="HelpCircle" size={20} color="var(--color-primary)" />
        <h3 className="text-base font-semibold text-foreground">
          Common Grievance Examples
        </h3>
      </div>
      <div className="space-y-3">
        {examples?.map((example) => (
          <div
            key={example?.category}
            className="border border-border rounded-lg overflow-hidden bg-card transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => toggleCategory(example?.category)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${example?.bgColor} flex items-center justify-center`}>
                  <Icon name={example?.icon} size={20} className={example?.color} />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {example?.title}
                </span>
              </div>
              <Icon 
                name={expandedCategory === example?.category ? 'ChevronUp' : 'ChevronDown'} 
                size={20} 
                color="var(--color-muted-foreground)"
              />
            </button>

            {expandedCategory === example?.category && (
              <div className="px-4 pb-4 pt-2 border-t border-border bg-muted/30">
                <ul className="space-y-2">
                  {example?.items?.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground caption">
                      <Icon name="Check" size={14} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryExamples;