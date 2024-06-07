import React, { useState, useEffect } from 'react';
import { Input, AutoComplete } from 'antd';
import { fetchItemsFromMongo } from '@/services/mongoService'; // Your service for fetching items from MongoDB

function ItemAutoComplete({ onSelect, setInputValue }) {
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchItemsFromMongo(searchValue); // Fetch filtered items based on searchValue
      const formattedOptions = items.map(item => ({
        value: item.name,
        label: (
          <div>
            <span>{item.name}</span>
            <br />
            <span style={{ color: 'gray' }}>{item.description}</span>
          </div>
        ),
        data: item, // Store the entire item object for easy access
      }));
      setOptions(formattedOptions);
    };

    if (searchValue.length >= 3) { // Start fetching after 3 characters
      fetchItems();
    } else {
      setOptions([]);
    }
  }, [searchValue]);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const handleSelect = (value, option) => {
    const { price, description } = option.data;
    onSelect(value, price, description);
  };

  return (
    <AutoComplete
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      value={searchValue}
      onChange={(value) => setInputValue(value)}
    >
      <Input placeholder="Item Name" />
    </AutoComplete>
  );
}

export default ItemAutoComplete;
