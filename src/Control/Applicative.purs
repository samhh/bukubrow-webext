module Control.Applicative.Custom where

import Prelude

import Data.Filterable (class Filterable, filter)
import Types (Predicate)

ensure :: forall f a. Applicative f => Filterable f => Predicate a -> a -> f a
ensure p = pure >>> filter p

