import React, { useCallback, useEffect, useState } from "react";
import { ReactComponent as Map } from "./LumiaIslandMap.svg";
import { v4 as uuidv4 } from "uuid";
import { Loader } from "semantic-ui-react";
import { Locations } from "erbs-sdk";

type Props = {
  onClick?: any;
  selected?: Locations[];
};

export const MapCoreComponent: React.FC<Props> = ({ onClick, selected }) => {
  const [id, setId] = useState(null);
  const el = useCallback(
    (node) => {
      if (node) {
        const links = node.getElementsByTagName("a");

        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          const location = link.getAttribute("data-location");

          if (
            selected &&
            link.className &&
            link.className.baseVal &&
            selected.length &&
            selected.some((sel) => link.className.baseVal.indexOf(sel) >= 0)
          ) {
            link.classList.add("selected");
          } else {
            link.classList.remove("selected");
          }

          if (onClick && location) {
            link.addEventListener("click", (e) => {
              e.preventDefault();

              onClick(location);
            });
          }
        }
      }
    },
    [onClick, selected]
  );

  useEffect(() => {
    if (!id) {
      setId(uuidv4());
    }
  }, [id]);

  if (!id) {
    return <Loader />;
  }

  return (
    <div id={id} ref={el}>
      <Map />
    </div>
  );
};

export default MapCoreComponent;
