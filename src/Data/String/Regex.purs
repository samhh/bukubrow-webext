module Data.String.Regex.Custom where

import Prelude

import Data.Array.NonEmpty (NonEmptyArray, fromArray)
import Data.Maybe (Maybe)
import Data.String.Regex (Regex)

foreign import matchAllFirstGroupsImpl :: Regex -> String -> Array String

matchAllFirstGroups :: Regex -> String -> Maybe (NonEmptyArray String)
matchAllFirstGroups r = matchAllFirstGroupsImpl r >>> fromArray

