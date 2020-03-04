module Buku where

import Data.String (Pattern(..))
import Data.String.CodeUnits as SCU

tagDelimiterC :: Char
tagDelimiterC = ','

tagDelimiterS :: String
tagDelimiterS = SCU.singleton tagDelimiterC

tagDelimiter :: Pattern
tagDelimiter = Pattern tagDelimiterS

