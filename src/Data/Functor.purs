module Data.Functor.Custom where

import Prelude

-- | The following are equivalent:
-- | g <$< f == map g <<< f
composeMap :: forall a b c f. Functor f => (b -> c) -> (a -> f b) -> a -> f c
composeMap = map >>> map

infixl 10 composeMap as <$<


-- | The following are equivalent:
-- | f >#> g == f >>> map g
composeMapFlipped :: forall a b c f. Functor f => (a -> f b) -> (b -> c) -> a -> f c
composeMapFlipped = flip composeMap

infixl 10 composeMapFlipped as >#>

