module Env where

import Settings (Theme(..))

initial :: Env
initial =
    { prefs:
        { theme: Light
        }
    }

type Env =
    { prefs :: Prefs
    }

type Prefs =
    { theme :: Theme
    }

