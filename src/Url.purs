module Url where

import Prelude

import Data.Array (elem, takeEnd)
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.Maybe (Maybe)
import Data.String (Pattern(..), joinWith, split)
import Foreign (Foreign)
import Foreign.Custom (unsafeFromNullable)
import Types (Predicate, Endomorphism)

type Url =
    { href :: String
    , protocol :: String
    , host :: String
    , hostname :: String
    , pathname :: String
    }

data UrlMatch = Exact | Domain | None

derive instance genericUrlMatch :: Generic UrlMatch _
derive instance eqUrlMatch :: Eq UrlMatch
instance showUrlMatch :: Show UrlMatch where
  show = genericShow

instance ordUrlMatch :: Ord UrlMatch where
    compare Exact Exact = EQ
    compare Domain Domain = EQ
    compare None None = EQ
    compare Exact Domain = GT
    compare Exact None = GT
    compare Domain None = GT
    compare _ _ = LT

foreign import mkUrlImpl :: String -> Foreign

mkUrl :: String -> Maybe Url
mkUrl = mkUrlImpl >>> unsafeFromNullable

domainFromHost :: Endomorphism String
domainFromHost = split (Pattern ".") >>> takeEnd 2 >>> joinWith "."

domain :: Url -> String
domain = _.host >>> domainFromHost

hrefSansProtocol :: Url -> String
hrefSansProtocol x = x.host <> x.pathname

httpFromProtocol :: Predicate String
httpFromProtocol = flip elem [ "http:", "https:" ]

http :: Predicate Url
http = _.protocol >>> httpFromProtocol

compare :: Url -> Url -> UrlMatch
compare x y = do
    -- Never match URLs with non-HTTP(S) protocols
    if (not $ http x) || (not $ http y) then None else do
        -- Match URLs as exact irrespective of protocol equality
        if hrefSansProtocol x == hrefSansProtocol y then Exact else do
            -- Check equality of domain (ignoring subdomain(s))
            if domain x == domain y then Domain
            else None

