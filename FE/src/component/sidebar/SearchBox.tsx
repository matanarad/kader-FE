import { FC } from "react";

interface SearchBoxProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBox: FC<SearchBoxProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search participants"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;
