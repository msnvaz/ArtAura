import React from 'react';

const NavigationTabs = ({ activeTab, setActiveTab, tabs = [] }) => {
    const defaultTabs = [
        { id: 'portfolio', label: 'Portfolio', count: 0 },
        { id: 'artworks', label: 'Artworks', count: 0 },
        { id: 'exhibitions', label: 'Exhibitions', count: 0 },
        { id: 'achievements', label: 'Achievements', count: 0 }
    ];

    const tabsToShow = tabs.length > 0 ? tabs : defaultTabs;

    return (
        <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b border-[#fdf9f4]/50">
                <nav className="flex space-x-8 px-6">
                    {tabsToShow.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-[#7f5539] text-[#7f5539]'
                                    : 'border-transparent text-[#7f5539]/60 hover:text-[#7f5539] hover:border-[#7f5539]/30'
                                }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className="ml-2 bg-[#7f5539]/10 text-[#7f5539] px-2 py-1 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default NavigationTabs;
