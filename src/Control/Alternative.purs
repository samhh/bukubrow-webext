module Control.Alternative.Custom where

import Control.Alternative (class Alternative, empty, pure)

ensure :: forall f a. Alternative f => (a -> Boolean) -> a -> f a
ensure p x = if p x then pure x else empty

