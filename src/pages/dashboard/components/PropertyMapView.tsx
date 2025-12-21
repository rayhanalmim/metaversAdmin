import React, { useState } from 'react';
import { Button } from '@/components/custom/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import AdminAPI, { MetaverseUser } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

interface PropertyData {
    id: number;
    owner_id?: number;
    owner_username?: string;
    is_assigned: boolean;
}

interface PropertyMapViewProps {
    users: MetaverseUser[];
    properties: PropertyData[];
    onPropertyUpdate: () => void;
}

const Market_ara_left = [
    [795, 794, 781, 780, 767, 766, 753, 752, 739, 738, 725, 724, 711, 710, 398, 397],
    [793, 792, 779, 778, 765, 764, 751, 750, 737, 736, 723, 722, 709, 708, 396, 395],
    [791, 790, 777, 776, 763, 762, 749, 748, 735, 734, 721, 720, 707, 706, 394, 393],
    [789, 788, 775, 774, 761, 760, 747, 746, 733, 732, 719, 718, 705, 704, 392, 391],
    [787, 786, 773, 772, 759, 758, 745, 744, 731, 730, 717, 716, 703, 702, 390, 389],
    [785, 784, 771, 770, 757, 756, 743, 742, 729, 728, 715, 714, 701, 700, 388, 387],
    [783, 782, 769, 768, 755, 754, 741, 740, 727, 726, 713, 712, 399, 398, 386, 385],
];

const Market_ara_right = [
    [384, 383, 369, 368, 355, 354, 341, 340, 327, 326, 313, 312, null, null],
    [382, 381, 367, 366, 353, 352, 339, 338, 325, 324, 311, 310, null, null],
    [380, 379, 365, 364, 351, 350, 337, 336, 323, 322, 309, 308, null, null],
    [378, 377, 363, 362, 349, 348, 335, 334, 321, 320, 307, 306, null, 799],
    [376, 375, 361, 360, 347, 346, 333, 332, 319, 318, 305, 304, null, 798],
    [373, 372, 359, 358, 345, 344, 331, 330, 317, 316, 303, 302, null, 797],
    [371, 370, 357, 356, 343, 342, 329, 328, 315, 314, 301, 300, null, 796],
];

const Township_ara_left = [
    [null, null, null, null, 699, 698, 697, 692, null, null, 696, 695, 694, 693, 691, 690, 689, 688, 687, 686, 685, 684, 683, 682, null, null, null],
    [null, null, null,null, 110, 109, 108, 2, null, null, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 0, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [167, null, null, 171, 170, 169, 168, 7, null, null, 123, 122, 121, 120, 119, 118, 117, 116, 115, 114, 113, 112, 111, 3, null, null, null, null, null],
    [166, null, null, null, null, null, null, null, null, null, 149, 148, 147, 146, 145, 144, 143, 142, 141, 140, 139, 138, 137, 5, null, null, null, null, null],
    [165, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [164, null, null, 206, 205, 204, 203, 11, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [163, null, null, 218, null, null, null, 202, null, null, 227, 226, null, 225, 16, null, null, 224, null, null, 20, null, null, 240, null, null, 24, null, null],
    [162, null, null, 217, null, null, null, 201, null, null, 223, null, null, null, 224, null, null, 232, null, null, 233, null, null, 238, null, null, 239, null, null],
    [161, null, null, 216, null, null, null, 200, null, null, 14, null, null, null, 15, null, null, 18, null, null, 19, null, null, 22, null, null, 23, null, null],
    [160, null, null, 215, null, null, null, 199, null, null, 231, 230, 229, 228, 17, null, null, 237, 236, 235, 21, null, null, 243, 242, 241, 25, null, null],
    [159, null, null, 214, null, null, null, 198, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [158, null, null, 213, null, null, null, 197, null, null, null, 538, 537, 536, 535, 534, 533, 532, 531, 530, 529, 528, 527, 526, 525, 61, null, null, null, null],
    [157, null, null, 212, null, null, null, 196, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],

    [156, null, null, null, null, null, null, 195, null, null, 547, null, 556, null, 565, null, null, 250, 249, 248, 247, 27, null, null, 651, 650, 659, 648, 78],
    [155, null, null, null, null, null, null, 194, null, null, 546, null, 555, null, 564, null, null, 255, null, null, null, 246, null, null, 664, null, null, null, 647],
    [154, null, null, 211, null, null, null, 193, null, null, 545, null, 554, null, 563, null, null, 254, null, null, null, 245, null, null, 663, null, null, null, 646],
    [153, null, null, 210, null, null, null, 192, null, null, 544, null, 553, null, 562, null, null, 253, null, null, null, null, null, null, 662, null, null, null, 645],
    [152, null, null, 209, null, null, null, 191, null, null, 543, null, 552, null, 561, null, null, 252, null, null, null, null, null, null, 661, null, null, null, 644],
    [151, null, null, 208, null, null, null, 190, null, null, 542, null, 551, null, 560, null, null, 251, null, null, null, 244, null, null, 660, null, null, null, 643],
    [150, null, null, 207, null, null, null, 189, null, null, 541, null, 550, null, 559, null, null, 28, null, null, null, 26, null, null, 659, null, null, null, 642],
    [6, null, null, 12, null, null, null, 10, null, null, 540, null, 549, null, 558, null, null, 259, 258, 257, 256, 29, null, null, 658, null, null, null, null],
    [null, null, null, 188, 187, 186, 185, 9, null, null, 539, null, 548, null, 557, null, null, null, null, null, null, null, null, null, 657, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, 62  , null,  63, null, 64, null, null, 264, 263, null, 262, 31, null, null, 656, null, null, null, 641],

    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 266, null, null, null, 261, null,null, 655, null, null, null, 640],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 265, null, null , null,260, null,null, 654, null, null, null, 639],
    [null, null, null, null, 222, 221, 220, 219, 13, 636, 635, 634, 77, null, null, null, null, 32,  null, null,   null, 30,null,null, 653, null, null, null, 638],
    [null, null, null, null, null, null, null, null, null, null, null, null, 76, null, null, null,null, 270, 269, 268, 267, 33, null,null, 652, null, null, null, 637],
    [null, null, null, null, null, null, null, null, null, null, null, null, 630, null, null, null, null,  null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 271, 272, null, 271, 34, null, null, null, null],
];

export const PropertyMapView: React.FC<PropertyMapViewProps> = ({
    users,
    properties,
    onPropertyUpdate
}) => {
    const [activeTab, setActiveTab] = useState<'market' | 'residential' | 'township'>('market');
    const [marketSubTab, setMarketSubTab] = useState<'left' | 'right'>('left');
    const [townshipSubTab, setTownshipSubTab] = useState<'left' | 'right'>('left');
    const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

    const getPropertyData = (propertyId: number): PropertyData | undefined => {
        return properties.find(p => p.id === propertyId);
    };

    const handlePropertyClick = (propertyId: number) => {
        const property = getPropertyData(propertyId);
        if (property) {
            setSelectedProperty(property);
            setIsAssignDialogOpen(true);
        }
    };

    const handleAssignProperty = async (userId: number) => {
        if (!selectedProperty) return;

        try {
            await AdminAPI.assignPropertyToUser(userId, selectedProperty.id);

            setIsAssignDialogOpen(false);
            setSelectedProperty(null);

            toast({
                title: "Success",
                description: `Property #${selectedProperty.id} assigned successfully`,
            });

            onPropertyUpdate();
        } catch (error) {
            console.error('Error assigning property:', error);
            toast({
                title: "Error",
                description: "Failed to assign property",
                variant: "destructive",
            });
        }
    };

    const handleRemoveProperty = async () => {
        if (!selectedProperty || !selectedProperty.owner_id) return;

        try {
            await AdminAPI.removePropertyFromUser(selectedProperty.owner_id, selectedProperty.id);

            setIsAssignDialogOpen(false);
            setSelectedProperty(null);

            toast({
                title: "Success",
                description: `Property #${selectedProperty.id} unassigned successfully`,
            });

            onPropertyUpdate();
        } catch (error) {
            console.error('Error removing property:', error);
            toast({
                title: "Error",
                description: "Failed to remove property assignment",
                variant: "destructive",
            });
        }
    };

    const PropertyBox: React.FC<{ propertyId: number; highlight?: boolean }> = ({ propertyId, highlight }) => {
        const property = getPropertyData(propertyId);
        const isAssigned = property?.is_assigned || false;

        return (
            <div
                onClick={() => handlePropertyClick(propertyId)}
                className={`
                    relative border-2 rounded-md cursor-pointer transition-all 
                    hover:shadow-xl hover:scale-110 hover:z-10
                    flex items-center justify-center text-sm font-bold
                    min-w-[52px] h-[42px] p-2
                    ${isAssigned
                        ? 'bg-blue-500 border-blue-600 text-white dark:bg-blue-600 dark:border-blue-700'
                        : 'bg-white border-gray-400 text-gray-800 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-100'
                    }
                    ${highlight ? 'ring-4 ring-orange-500 ring-offset-2' : ''}
                `}
            >
                <span className="select-none">{propertyId}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex items-center gap-4 border-b">
                <button
                    onClick={() => setActiveTab('market')}
                    className={`px-4 py-2 border-b-2 transition-colors ${activeTab === 'market'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Market Area
                </button>
                <button
                    onClick={() => setActiveTab('residential')}
                    className={`px-4 py-2 border-b-2 transition-colors ${activeTab === 'residential'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Residential Area
                </button>
                <button
                    onClick={() => setActiveTab('township')}
                    className={`px-4 py-2 border-b-2 transition-colors ${activeTab === 'township'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Township Area
                </button>
            </div>

            {/* Map Content */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg overflow-x-auto">
                {activeTab === 'market' && (
                    <MarketAreaMap
                        PropertyBox={PropertyBox}
                        subTab={marketSubTab}
                        setSubTab={setMarketSubTab}
                    />
                )}
                {activeTab === 'residential' && (
                    <div className="text-center py-12 text-muted-foreground">
                        Residential Area map coming soon...
                    </div>
                )}
                {activeTab === 'township' && (
                    <TownshipAreaMap
                        PropertyBox={PropertyBox}
                        subTab={townshipSubTab}
                        setSubTab={setTownshipSubTab}
                    />
                )}
            </div>

            {/* Property Assignment Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Property #{selectedProperty?.id} Management
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedProperty?.is_assigned ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">Current Owner</span>
                                    </div>
                                    <div className="text-sm">{selectedProperty.owner_username}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleRemoveProperty}
                                        className="flex-1"
                                    >
                                        Remove Assignment
                                    </Button>
                                    <Select onValueChange={(value) => handleAssignProperty(parseInt(value))}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Reassign to..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map(user => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.username}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        This property is currently unassigned
                                    </div>
                                </div>
                                <Select onValueChange={(value) => handleAssignProperty(parseInt(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user to assign..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map(user => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.username}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const MarketAreaMap: React.FC<{
    PropertyBox: React.FC<{ propertyId: number; highlight?: boolean }>;
    subTab: 'left' | 'right';
    setSubTab: (tab: 'left' | 'right') => void;
}> = ({ PropertyBox, subTab, setSubTab }) => {
    return (
        <div className="flex flex-col items-center gap-6 py-4">
            {/* Title */}

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
                        {/* Bridge to Market Indicator */}


                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
                                <div className='flex justify-center pb-4'>
                                    <div className="bg-gray-300 dark:bg-gray-600 px-8 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
                                        bridge to market
                                    </div>
                                </div>
                                {Market_ara_left.map((row, rowIndex) => (
                                    <React.Fragment key={rowIndex}>
                                        <div className="flex items-center gap-0.5">
                                            {row.map((propertyId, colIndex) => (
                                                <React.Fragment key={colIndex}>
                                                    <PropertyBox
                                                        propertyId={propertyId}
                                                        highlight={propertyId === 398}
                                                    />
                                                    {/* Add gap after every 2 columns */}
                                                    {colIndex % 2 === 1 && colIndex < row.length - 1 && (
                                                        <div className="w-6" />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        {/* Regular spacing between rows */}
                                        {rowIndex < Market_ara_left.length - 1 && (
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
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-4 items-center">
                            {/* Main Middle Road Indicator - Left Side */}
                            <div className="relative flex items-center">
                                <div className="absolute right-0 bg-gray-300 dark:bg-gray-600 tracking-wider px-4 py-1 rounded text-xs font-bold text-white shadow-sm transform rotate-90 whitespace-nowrap origin-center">
                                    main road
                                </div>
                            </div>

                            <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
                                <div className='flex justify-center pb-4'>
                                    <div className="bg-gray-300 dark:bg-gray-600 px-8 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 shadow-sm">
                                        bridge to market
                                    </div>
                                </div>
                                {Market_ara_right.map((row, rowIndex) => (
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
                                        {rowIndex < Market_ara_right.length - 1 && (
                                            <div className="h-2" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TownshipAreaMap: React.FC<{
    PropertyBox: React.FC<{ propertyId: number; highlight?: boolean }>;
    subTab: 'left' | 'right';
    setSubTab: (tab: 'left' | 'right') => void;
}> = ({ PropertyBox, subTab, setSubTab }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeft, setScrollLeft] = React.useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

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
            <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                className="overflow-x-auto cursor-grab active:cursor-grabbing w-full"
            >
                {subTab === 'left' && (
                    <div className="flex flex-col items-start gap-4 w-max mx-auto">
                        <div className="flex gap-4 items-center w-max">
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
                                                            className="min-w-[52px] h-[42px] bg-transparent"
                                                        />
                                                    )}
                                                    {/* Add gap after every 2 columns */}
                                                
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
