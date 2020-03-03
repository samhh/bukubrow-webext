module Control.Alternative.Custom where

import Control.Alternative (class Alternative, empty, pure)
import Types (Predicate)

ensure :: forall f a. Alternative f => Predicate a -> a -> f a
ensure p x = if p x then pure x else empty

