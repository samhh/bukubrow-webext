module App.URLMatch where

import Prelude

data URLMatch = Exact | Domain | None

derive instance eqURLMatch :: Eq URLMatch

instance ordURLMatch :: Ord URLMatch where
    compare Exact Exact = EQ
    compare Domain Domain = EQ
    compare None None = EQ
    compare Exact Domain = GT
    compare Exact None = GT
    compare Domain None = GT
    compare _ _ = LT

