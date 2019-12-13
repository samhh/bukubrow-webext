import React from 'react';
import mount from 'Modules/connected-mount';
import OptionsPage from 'Pages/options';
import { runIO } from 'Modules/fp';

runIO(mount(<OptionsPage />));

