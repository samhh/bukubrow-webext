module Url.Test where

import Prelude

import Data.Maybe (Maybe(..))
import Foreign (unsafeFromForeign)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, shouldNotSatisfy, shouldSatisfy)
import Url (UrlMatch(..), Url, domainFromHost, hrefSansProtocol, httpFromProtocol, mkUrl, mkUrlImpl)
import Url as URL

mkUrlUnsafe :: String -> Url
mkUrlUnsafe = (mkUrlImpl >>> unsafeFromForeign)

spec :: Spec Unit
spec = describe "Url" do
    describe "mkUrl" do
       it "parses url with protocol" do
            let expectedUrl = { href: "https://samhh.com/", protocol: "https:", host: "samhh.com", hostname: "samhh.com", pathname: "/" }
            mkUrl "https://samhh.com" `shouldEqual` Just expectedUrl
       it "does not parse url without protocol" do
            mkUrl ""          `shouldEqual` Nothing
            mkUrl "samhh.com" `shouldEqual` Nothing

    describe "UrlMatch ord instance" do
        it "is consistent with number comparison" do
            compare 2 1 `shouldEqual` GT
        it "compares appropriately" do
            compare Exact  Domain `shouldEqual` GT
            compare Exact  None   `shouldEqual` GT
            compare Domain None   `shouldEqual` GT
            compare Exact  Exact  `shouldEqual` EQ
            compare Domain Domain `shouldEqual` EQ
            compare None   None   `shouldEqual` EQ
            compare Domain Exact  `shouldEqual` LT
            compare None   Exact  `shouldEqual` LT
            compare None   Domain `shouldEqual` LT

    describe "domainFromHost" do
        it "returns unaltered without subdomain" do
            domainFromHost "samhh.com" `shouldEqual` "samhh.com"
        it "strips subdomains" do
            domainFromHost "sub.do.mains.samhh.com" `shouldEqual` "samhh.com"

    describe "hrefSansProtocol" do
        it "strips protocol" do
            hrefSansProtocol (mkUrlUnsafe "https://a.b.c.samhh.com/x/y/z.html") `shouldEqual` "a.b.c.samhh.com/x/y/z.html"

    describe "httpFromProtocol" do
        it "matches against http and https only" do
            "http:"  `shouldSatisfy`    httpFromProtocol
            "https:" `shouldSatisfy`    httpFromProtocol
            "ftp:"   `shouldNotSatisfy` httpFromProtocol

    describe "compare" do
        it "matches exactly irrespective of http(s)" do
            URL.compare (mkUrlUnsafe "http://samhh.com") (mkUrlUnsafe "http://samhh.com")                `shouldEqual` Exact
            URL.compare (mkUrlUnsafe "http://samhh.com") (mkUrlUnsafe "https://samhh.com")               `shouldEqual` Exact
        it "matches domain if subdomain differs" do
            URL.compare (mkUrlUnsafe "http://samhh.com") (mkUrlUnsafe "https://a.b.c.samhh.com")         `shouldEqual` Domain
        it "matches domain if path differs" do
            URL.compare (mkUrlUnsafe "http://samhh.com") (mkUrlUnsafe "https://a.b.c.samhh.com/x/y/z")   `shouldEqual` Domain
        it "does not match different tlds" do
            URL.compare (mkUrlUnsafe "http://samhh.com") (mkUrlUnsafe "https://a.b.c.samhh.co.uk/x/y/z") `shouldEqual` None
        it "does not match non-http(s)" do
            URL.compare (mkUrlUnsafe "ftp://samhh.com")  (mkUrlUnsafe "ftp://samhh.com")                 `shouldEqual` None

