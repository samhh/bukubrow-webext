module Data.String.Custom where

import Prelude

import Data.Array as A
import Data.String.CodeUnits (fromCharArray, toCharArray)

reverse :: String -> String
reverse = toCharArray >>> A.reverse >>> fromCharArray

