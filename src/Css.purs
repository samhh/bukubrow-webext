module Css where

import Prelude

import Effect (Effect)
import Halogen (ClassName(..))
import Types (Predicate)

foreign import addHtmlClass :: String -> Effect Unit

foreign import removeHtmlClass :: String -> Effect Unit

-- | Conditionally append a BEM modifier.
modifier :: forall a. ClassName -> String -> Predicate a -> a -> ClassName
modifier (ClassName c) m f x = if f x
    then ClassName (c <> "--" <> m)
    else ClassName c

