import React from "react";

function Search({onSearchChange}) {
  function handleChange(e) {
    onSearchChange(e.target.value);
  }
  return (
    <div className="searchbar">
      <label htmlFor="search">Search Products:</label>
      <input
        type="text"
        id="search"
        placeholder="Search..."
        onChange={handleChange}
      />
    </div>
  );
}

export default Search;