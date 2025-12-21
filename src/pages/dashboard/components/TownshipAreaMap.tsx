import React from 'react';

const TownshipAreaMap: React.FC<{
    PropertyBox: React.FC<{ propertyId: number; highlight?: boolean }>;
    subTab: 'left' | 'right';
    setSubTab: (tab: 'left' | 'right') => void;
    Township_ara_left: (number | null)[][];
}> = ({ PropertyBox, subTab, setSubTab, Township_ara_left }) => {
    return (
        <div className="flex flex-col items-center gap-6 py-4">
            {/* Sub-tab Navigation */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-md">
                <button
                    onClick={() => setSubTab('left')}
                    className={`px-6 py-2 rounded-md font-semibold transition-all ${subTab === 'left'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    Left Side
                </button>
                <button
                    onClick={() => setSubTab('right')}
                    className={`px-6 py-2 rounded-md font-semibold transition-all ${subTab === 'right'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    Right Side
                </button>
            </div>

            {/* Content - Show only active sub-tab */}
            <div className="flex justify-center">
                {subTab === 'left' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
                                <div className='flex justify-center pb-4'>
                                    <div className="bg-gray-300 dark:bg-gray-600 px-8 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
                                        bridge to township
                                    </div>
                                </div>
                                {Township_ara_left.map((row, rowIndex) => (
                                    <React.Fragment key={rowIndex}>
                                        <div className="flex items-center gap-0.5">
                                            {row.map((propertyId, colIndex) => (
                                                <React.Fragment key={colIndex}>
                                                    {propertyId !== null ? (
                                                        <PropertyBox
                                                            propertyId={propertyId}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="min-w-[52px] h-[42px] bg-white dark:bg-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-md"
                                                        />
                                                    )}
                                                    {/* Add gap after every 2 columns */}
                                                    {colIndex % 2 === 1 && colIndex < row.length - 1 && (
                                                        <div className="w-6" />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        {/* Regular spacing between rows */}
                                        {rowIndex < Township_ara_left.length - 1 && (
                                            <div className="h-2" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Main Middle Road Indicator - Right Side */}
                            <div className="relative flex items-center">
                                <div className="absolute left-0 bg-gray-300 dark:bg-gray-600 tracking-wider px-4 py-1 rounded text-xs font-bold text-white shadow-sm transform rotate-90 whitespace-nowrap origin-center">
                                    main road
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {subTab === 'right' && (
                    <div className="text-center py-12 text-muted-foreground">
                        Township Right Side coming soon...
                    </div>
                )}
            </div>
        </div>
    );
};

export default TownshipAreaMap;
