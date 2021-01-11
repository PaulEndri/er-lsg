import React, { lazy, Suspense } from "react";
import { Locations } from "erbs-sdk";
import { Dimmer, Loader } from "semantic-ui-react";

const MapCoreComponent = lazy(() => import("./component"));

type Props = {
  onClick?: (any) => void;
  selected?: Locations[];
};

export const MapComponent: React.FC<Props> = ({ onClick, selected }) => {
  return (
    <Suspense
      fallback={
        <Dimmer active={true}>
          <Loader />
        </Dimmer>
      }
    >
      <MapCoreComponent onClick={onClick} selected={selected} />
    </Suspense>
  );
};
