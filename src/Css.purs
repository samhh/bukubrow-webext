module Css where

import Prelude

import Data.Array (catMaybes)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Halogen (ClassName(..))
import Types (Predicate)

foreign import addHtmlClass :: String -> Effect Unit

foreign import removeHtmlClass :: String -> Effect Unit

-- | Conditionally append a BEM modifier.
modifierM :: forall a. ClassName -> (a -> Maybe String) -> a -> Array ClassName
modifierM (ClassName c) f x = [c] <> catMaybes [f x <#> ((c <> "--") <> _)] <#> ClassName

-- | Conditionally append a static string BEM modifier dependent upon a
-- | predicate.
modifierP :: forall a. ClassName -> String -> Predicate a -> a -> Array ClassName
modifierP c m f x = modifierM c (const (if f x then Just m else Nothing)) x

