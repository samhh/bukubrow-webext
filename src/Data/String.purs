module Data.String.Custom where

import Prelude

import Data.Array (intercalate, replicate)
import Data.Array as A
import Data.Natural (Natural, toInt)
import Data.String.CodeUnits (fromCharArray, toCharArray)

reverse :: String -> String
reverse = toCharArray >>> A.reverse >>> fromCharArray

repeat :: Natural -> String -> String
repeat n = replicate (toInt n) >>> intercalate ""

