import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Input } from "semantic-ui-react";
import { DataContext } from "../state/data";

export const SearchComponent = () => {
  const [search, updateSearch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getPlayerData } = useContext(DataContext);
  const history = useHistory();

  const handleSearchClick = async () => {
    if (!search || search.length < 3) {
      return;
    }

    setLoading(true);

    try {
      const results = await getPlayerData(search);

      if (results) {
        history.push(`/players/${search}`);
      } else {
        setError("Player matched no current results. Try again later or contact the side admin");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Input
      action={{
        color: "orange",
        labelPosition: "left",
        icon: "search",
        content: "Search",
        onClick: handleSearchClick,
      }}
      size="small"
      disabled={loading}
      loading={loading}
      error={error}
      style={{ margin: "auto", paddingRight: "25%" }}
      onChange={(e) => {
        updateSearch(e.target.value);
      }}
      placeholder="search for player"
    />
  );
};
