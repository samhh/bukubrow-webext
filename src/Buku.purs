module Buku where

import Data.String (Pattern(..))
import Data.String.CodeUnits as SCU
import Data.String.NonEmpty (NonEmptyString)
import Data.String.NonEmpty.CodeUnits as NESCU

bukuTagDelimiter :: Char
bukuTagDelimiter = ','

bukuTagDelimiterS :: String
bukuTagDelimiterS = SCU.singleton bukuTagDelimiter

bukuTagDelimiterNES :: NonEmptyString
bukuTagDelimiterNES = NESCU.singleton bukuTagDelimiter

bukuTagDelimiterP :: Pattern
bukuTagDelimiterP = Pattern bukuTagDelimiterS

