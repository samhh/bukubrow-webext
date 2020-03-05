-- | "Local" and "remote" bookmarks can be thought of as loosely isomorphic,
-- | however no formal isomorphism is defined as the handling of tags is not
-- | strictly isomorphic (e.g. ",," -> [] -> ",").

module Bookmark where

import Prelude

import Bookmarklet (Bookmarklet)
import Bookmarklet as Bml
import Buku (tagDelimiter, tagDelimiterS)
import Control.Alt ((<|>))
import Data.Argonaut.Decode (class DecodeJson, decodeJson)
import Data.Compactable (compact)
import Data.Foldable (class Foldable, surround)
import Data.Functor.Custom ((>#>))
import Data.Maybe (fromMaybe)
import Data.Natural (Natural)
import Data.String (split)
import Data.Symbol (SProxy(..))
import Record as R
import Tag (Tag)
import Tag as Tag
import Type.Row (class Lacks)
import Url (UrlMatch, Url)
import Url as Url

data Link
    = BookmarkletLink Bookmarklet
    | UrlLink Url
    | MiscLink String

derive instance eqLink :: Eq Link

instance showLink :: Show Link where
    show = unLink

instance decodeLink :: DecodeJson Link where
    decodeJson = decodeJson >#> mkLink

mkLink :: String -> Link
mkLink x =
        (Bml.fromString x <#> BookmarkletLink)
    <|> (Url.fromString x <#> UrlLink)
      # fromMaybe (MiscLink x)

unLink :: Link -> String
unLink (BookmarkletLink x) = Bml.toString x
unLink (UrlLink x) = Url.toString x
unLink (MiscLink x) = x

type Saved a =
    ( id :: Natural
    | a
    )

type Common a =
    ( desc :: String
    , url :: Link
    , flags :: Int
    | a
    )

type Remote =
    ( metadata :: String
    , tags :: String
    )

type RemoteI a =
    { metadata :: String
    , tags :: String
    | a
    }

type Local =
    ( title :: String
    , tags :: Array Tag
    )

type LocalI a =
    { title :: String
    , tags :: Array Tag
    | a
    }

type LocalD =
    ( title :: String
    , tags :: Array Tag
    )

-- | A new bookmark ready to be inserted into a Buku database (where it will be
-- | assigned its ID)
type RemoteBookmarkUnsaved = Record (Common Remote)

-- | A bookmark as stored in a Buku database
type RemoteBookmark = Record (Saved (Common Remote))

-- | A new locally-formatted bookmark ready to be transformed into a
-- | `RemoteBookmarkUnsaved`
type LocalBookmarkUnsaved = Record (Common Local)

-- | A locally-formatted bookmark
type LocalBookmark = Record (Saved (Common Local))

type LocalBookmarkWeighted =
    { weight :: UrlMatch
    | Saved (Common Local)
    }

remoteTags :: forall f. Functor f => Foldable f => f Tag -> String
remoteTags = map Tag.toString >>> surround tagDelimiterS

localTags :: String -> Array Tag
localTags = split tagDelimiter >#> Tag.fromString >>> compact

remote ::
    forall a.
    Lacks "title" a =>
    Lacks "tags" a =>
    LocalI a ->
    RemoteI a
remote x = x
    # R.delete (SProxy :: SProxy "title")
    # R.delete (SProxy :: SProxy "tags")
    # R.union { metadata: x.title, tags: remoteTags x.tags }

local ::
    forall a.
    Lacks "metadata" a =>
    Lacks "tags" a =>
    RemoteI a ->
    LocalI a
local x = x
    # R.delete (SProxy :: SProxy "metadata")
    # R.delete (SProxy :: SProxy "tags")
    # R.union { title: x.metadata, tags: localTags x.tags }

