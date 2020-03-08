module Data.Functor.Custom where

import Prelude

-- | Compose two functions where the first returns a functor and the second is
-- | to be applied within said functor (right-to-left).
composeMap :: forall a b c f. Functor f => (b -> c) -> (a -> f b) -> a -> f c
composeMap = map >>> map

infixl 10 composeMap as <$<

-- | Compose two functions where the first returns a functor and the second is
-- | to be applied within said functor (left-to-right).
composeMapFlipped :: forall a b c f. Functor f => (a -> f b) -> (b -> c) -> a -> f c
composeMapFlipped = flip composeMap

infixl 10 composeMapFlipped as >#>

