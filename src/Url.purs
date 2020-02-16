module App.Url where

import Prelude

import Data.Maybe (Maybe(..))
import Foreign (Foreign, isNull, unsafeFromForeign)

foreign import mkUrlImpl :: String -> Foreign

mkUrl :: String -> Maybe Url
mkUrl = mkUrlImpl >>> (\x -> if isNull x then Nothing else Just (unsafeFromForeign x))

type Url =
    { href :: String
    , protocol :: String
    , host :: String
    , hostname :: String
    , pathname :: String
    }

data UrlMatch = Exact | Domain | None

derive instance eqUrlMatch :: Eq UrlMatch

instance ordUrlMatch :: Ord UrlMatch where
    compare Exact Exact = EQ
    compare Domain Domain = EQ
    compare None None = EQ
    compare Exact Domain = GT
    compare Exact None = GT
    compare Domain None = GT
    compare _ _ = LT

