module Url where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (decodeJson)
import Data.Array (elem, takeEnd)
import Data.Either (hush)
import Data.Filterable (filter)
import Data.Function (on)
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.Lens (Prism', preview, prism', review)
import Data.Maybe (Maybe)
import Data.String (Pattern(..), joinWith, split)
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

foreign import mkUrlImpl :: String -> Json

urlPrism :: Prism' String Url
urlPrism = prism' (_.href) (mkUrlImpl >>> decodeJson >>> hush >>> filter http)

fromString :: String -> Maybe Url
fromString = preview urlPrism

toString :: Url -> String
toString = review urlPrism

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
compare x y
    -- Match URLs as exact irrespective of protocol equality
    | (eq `on` hrefSansProtocol) x y = Exact
    -- Check equality of domain (ignoring subdomain(s))
    | (eq `on` domain) x y           = Domain
    | otherwise                  = None

