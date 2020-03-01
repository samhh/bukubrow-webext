-- | "Local" and "remote" bookmarks can be thought of as loosely isomorphic,
-- | however no formal isomorphism is defined as the handling of tags is not
-- | strictly isomorphic (e.g. ",," -> [] -> ",").

module Bookmark where

import Prelude

import Buku (bukuTagDelimiterS)
import Data.Compactable (compact)
import Data.Foldable (class Foldable, surround)
import Data.Lens (Iso', iso)
import Data.String (Pattern(..), split)
import Data.String.NonEmpty (NonEmptyString, fromString, toString)
import Data.String.NonEmpty.Custom (NonEmptyStringN, mkNonEmptyStringN, unNonEmptyStringN)
import Data.Symbol (SProxy(..))
import Record as R
import Type.Row (class Lacks)
import Url (UrlMatch)

isoLocalBookmarkD :: Iso' LocalBookmark LocalBookmarkD
isoLocalBookmarkD = iso
    (\x -> x { tags = map mkNonEmptyStringN x.tags })
    (\x -> x { tags = map unNonEmptyStringN x.tags })

type Saved a =
    ( id :: Int
    | a
    )

type Common a =
    ( desc :: String
    , url :: String
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
    , tags :: Array NonEmptyString
    )

type LocalI a =
    { title :: String
    , tags :: Array NonEmptyString
    | a
    }

type LocalD =
    ( title :: String
    , tags :: Array NonEmptyStringN
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

-- | A decode-able locally-formatted bookmark (necessary to workaround orphan
-- | instance restriction)
type LocalBookmarkD = Record (Saved (Common LocalD))

type LocalBookmarkWeighted =
    { weight :: UrlMatch
    | Saved (Common Local)
    }

remoteTags :: forall f. Functor f => Foldable f => f NonEmptyString -> String
remoteTags = map toString >>> surround bukuTagDelimiterS

localTags :: String -> Array NonEmptyString
localTags = split (Pattern bukuTagDelimiterS) >>> map fromString >>> compact

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

