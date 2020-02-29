module Search where

import Prelude

import Control.Monad.Custom (filter)
import Data.Array.NonEmpty (NonEmptyArray, head)
import Data.Maybe (Maybe(..))
import Data.String.Regex (Regex, match)
import Data.String.Regex.Custom (matchAllFirstGroups)
import Data.String.Regex.Flags (global, noFlags)
import Data.String.Regex.Unsafe (unsafeRegex)

nameR :: Regex
nameR = unsafeRegex     """^.*?(?:(?=^[#>:*].+)|(?= +[#>:*].+)|$)""" noFlags

descR :: Regex
descR = unsafeRegex     """(?:^| )>(.+?)(?= +[#>:*]|$)"""            global

urlR :: Regex
urlR = unsafeRegex      """(?:^| ):(.+?)(?= +[#>:*]|$)"""            global

tagsR :: Regex
tagsR = unsafeRegex     """(?:^| )#(.+?)(?= +[#>:*]|$)"""            global

wildcardR :: Regex
wildcardR = unsafeRegex """(?:^| )\*(.+?)(?= +[#>:*]|$)"""           global

type Result =
    { name :: Maybe String
    , desc :: Maybe (NonEmptyArray String)
    , url :: Maybe (NonEmptyArray String)
    , tags :: Maybe (NonEmptyArray String)
    , wildcard :: Maybe (NonEmptyArray String)
    }

empty :: Result
empty = { name: Nothing, desc: Nothing, url: Nothing, tags: Nothing, wildcard: Nothing }

parse :: String -> Result
parse x =
    { name: match nameR x >>= head >>> filter (_ /= "")
    , desc: matchAllFirstGroups descR x
    , url: matchAllFirstGroups urlR x
    , tags: matchAllFirstGroups tagsR x
    , wildcard: matchAllFirstGroups wildcardR x
    }

