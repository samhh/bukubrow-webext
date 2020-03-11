module Html where

import Prelude

import Halogen (AttrName(..))
import Halogen.HTML.Properties as HP

dataAttr :: forall r i. String -> String -> HP.IProp r i
dataAttr x = HP.attr $ AttrName $ "data-" <> x

