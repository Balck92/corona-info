import React from "react";

const SearchBox = ({ value, onChange }) => {
    return (
        <input
            type="text"
            name="query"
            className="form-control my-3"
            placeholder="Search latest news"
            value={value}
            onChange={e => onChange(e.currentTarget.value)}
        />
    );
};

export default SearchBox;
