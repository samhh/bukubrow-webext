module CSS where

import Prelude

import Data.Tuple (Tuple(..))
import Types (Predicate)

-- | Conditionally append a BEM modifier.
modifier :: forall a. Tuple String String -> Predicate a -> a -> String
modifier (Tuple c m) f x = if f x then c <> "--" <> m else c

