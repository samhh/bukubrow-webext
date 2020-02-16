module App.Url where

import Prelude

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

