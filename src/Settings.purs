module Settings where

import Prelude

import Control.Bind (bindFlipped)
import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Argonaut.Decode.Custom (decodeJson')
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (note)
import Data.Functor.Custom ((>#>))
import Data.Lens (Prism', preview, prism', review)
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import SyncStorage as SS

type Settings =
    { theme :: Maybe Theme
    , badgeDisplay :: Maybe Badge
    }

getAll :: Unit -> Aff (Maybe Settings)
getAll _ = SS.get [ "theme", "badgeDisplay" ] <#> decodeJson'

setAll :: Settings -> Aff Unit
setAll = encodeJson >>> SS.set

data Theme
    = Light
    | Dark

instance decodeTheme :: DecodeJson Theme where
    decodeJson = decodeJson >=> preview themePrism >>> note "Value is not a Theme"

instance encodeTheme :: EncodeJson Theme where
    encodeJson = review themePrism >>> encodeJson

themePrism :: Prism' String Theme
themePrism = prism' to from
    where
        to :: Theme -> String
        to Light = "light"
        to Dark  = "dark"

        from :: String -> Maybe Theme
        from "light" = Just Light
        from "dark"  = Just Dark
        from _       = Nothing

getTheme :: Unit -> Aff (Maybe Theme)
getTheme = getAll >#> bindFlipped _.theme

data Badge
    = WithCount
    | WithoutCount
    | None

instance decodeBadge :: DecodeJson Badge where
    decodeJson = decodeJson >=> preview badgePrism >>> note "Value is not a Badge"

instance encodeBadge :: EncodeJson Badge where
    encodeJson = review badgePrism >>> encodeJson

badgePrism :: Prism' String Badge
badgePrism = prism' to from
    where
        to :: Badge -> String
        to WithCount    = "with_count"
        to WithoutCount = "without_count"
        to None         = "none"

        from :: String -> Maybe Badge
        from "with_count"    = Just WithCount
        from "without_count" = Just WithoutCount
        from _               = Nothing

getBadge :: Unit -> Aff (Maybe Badge)
getBadge = getAll >#> bindFlipped _.badgeDisplay

