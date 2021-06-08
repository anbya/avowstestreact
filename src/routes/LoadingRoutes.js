import React from 'react';
import { ScaleLoader } from 'react-spinners';

function PublicRoutes() {
    return (
        <div>
          <div className="overlayMask">
            <ScaleLoader
              height={90}
              width={20}
              radius={10}
              margin={10}
              color={'#ffffff'}
            />
          </div>
        </div>
    );
}

export default PublicRoutes;
