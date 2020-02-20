module Url where

import Prelude

import Data.Array (takeEnd)
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.List (elem, fromFoldable)
import Data.Maybe (Maybe)
import Data.String (Pattern(..), joinWith, split)
import Foreign (Foreign)
import Foreign.Custom (unsafeFromNullable)

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

domainFromHost :: String -> String
domainFromHost = split (Pattern ".") >>> takeEnd 2 >>> joinWith "."

domain :: Url -> String
domain x = domainFromHost x.host

hrefSansProtocol :: Url -> String
hrefSansProtocol x = x.host <> x.pathname

httpFromProtocol :: String -> Boolean
httpFromProtocol = flip elem $ fromFoldable [ "http:", "https:" ]

http :: Url -> Boolean
http x = httpFromProtocol x.protocol

compare :: Url -> Url -> UrlMatch
compare x y = do
    -- Never match URLs with non-HTTP(S) protocols
    if (not $ http x) || (not $ http y) then None else do
        -- Match URLs as exact irrespective of protocol equality
        if hrefSansProtocol x == hrefSansProtocol y then Exact else do
            -- Check equality of domain (ignoring subdomain(s))
            if domain x == domain y then Domain
            else None

