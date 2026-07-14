// DropdownBox.js
import React, { useState } from 'react';

const DropdownBoxTeam = ({ options, onSelect, error }) => {


    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);

    // Toggle dropdown visibility
    const handleToggle = () => setIsOpen((prev) => {
        setFilteredOptions(options);
        return !prev
    });

    // Filter options based on the search input
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredOptions(
            options.filter(
                ({ name, role }) =>
                    name.toLowerCase().includes(value) || role.toLowerCase().includes(value)
            )
        );
    };

    // Handle selecting an option
    const handleSelect = (option) => {
        onSelect(option); // Pass the selected object back
        setIsOpen(false);
        setSearchTerm(''); // Reset search on selection
        setFilteredOptions(options); // Reset options on selection
    };

    return (
        <div className="relative inline-block w-full border rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
            <button
                type="button"
                onClick={handleToggle}
                className={`w-full px-4 py-2 border rounded-md text-left ${error ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
                Select Team Members
            </button>
            {isOpen && options && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                    <input
                        type="text"
                        placeholder="Search by name or role..."
                        className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className="block w-full px-4 py-2 text-left hover:bg-blue-100"
                            >
                                {option.name} 
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-500">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropdownBoxTeam;
