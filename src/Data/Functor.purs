module Data.Functor.Custom where

import Prelude

composeMap :: forall a b c f. Functor f => (a -> f b) -> (b -> c) -> a -> f c
composeMap f g = f >>> map g

infixl 10 composeMap as >#>

composeMapFlipped :: forall a b c f. Functor f => (b -> c) -> (a -> f b) -> a -> f c
composeMapFlipped = flip composeMap

infixl 10 composeMapFlipped as <$<

