import React from "react"
import mount from "~/modules/connected-mount"
import OptionsPage from "~/pages/options"
import { runIO } from "~/modules/fp"

runIO(mount(<OptionsPage />))
