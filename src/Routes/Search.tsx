import { useLocation } from "react-router-dom";

function Search() {
  // Home에서 보낸 keyword에 접근
  const location = useLocation();
  // keyword parse
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  return null;
}

export default Search;
