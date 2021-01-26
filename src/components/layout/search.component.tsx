import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Input, Label } from "semantic-ui-react";
import { DataContext } from "../../state/data";

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
      await getPlayerData(search);

      history.push(`/players/${search}`);
    } catch (e) {
      setError(e.message || "Player could not be found");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <>
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
        style={{ margin: "auto" }}
        onChange={(e) => {
          updateSearch(e.target.value);
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSearchClick();
          }
        }}
        placeholder="search for player"
      />
      {error && <Label color="red">{error}</Label>}
    </>
  );
};
