-- | "Local" and "Remote" bookmark variants all form isomorphisms with each
-- | other, where the only interchanging values/formats are those of the
-- | title/metadata and tags
module Bookmark where

import Prelude

import Buku (bukuTagDelimiterS)
import Data.Array (filter)
import Data.Foldable (class Foldable, surround)
import Data.List (List, fromFoldable)
import Data.String (Pattern(..), split)
import Data.Symbol (SProxy(..))
import Record as R
import Type.Row (class Lacks)
import Url (UrlMatch)

type Saved a =
    ( id :: Int -- TODO which number type?
    | a
    )

type Common a =
    ( desc :: String
    , url :: String
    , flags :: Int -- TODO which number type?
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
    , tags :: List String
    )

type LocalI a =
    { title :: String
    , tags :: List String
    | a
    }

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

remoteTags :: forall f. Foldable f => f String -> String
remoteTags = surround bukuTagDelimiterS

localTags :: String -> Array String
localTags = split (Pattern bukuTagDelimiterS) >>> filter (_ /= "")

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
    # R.union { title: x.metadata, tags: fromFoldable $ localTags x.tags }

