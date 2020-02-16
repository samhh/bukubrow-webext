-- | The pairs `RemoteBookmarkUnsaved` and `LocalBookmarkUnsaved`, and
-- | `LocalBookmark` and `RemoteBookmark`, each form isomorphisms
module App.Bookmark where

import Prelude

import Data.Array (filter)
import Data.Foldable (class Foldable, intercalate)
import Data.List (List, fromFoldable)
import Data.String (Pattern(..), split)

type Saved a = { id :: Int | a } -- TODO which number type?

type RemoteBookmarkBase =
    ( metadata :: String
    , desc :: String
    , url :: String
    , tags :: String
    , flags :: Int -- TODO which number type?
    )

-- | A new bookmark ready to be inserted into a Buku database (where it will be
-- | assigned its ID)
type RemoteBookmarkUnsaved = Record RemoteBookmarkBase

-- | A bookmark as stored in a Buku database
type RemoteBookmark = Saved RemoteBookmarkBase

type LocalBookmarkBase =
    ( title :: String
    , desc :: String
    , url :: String
    , tags :: List String
    , flags :: Int -- TODO which number type?
    )

-- | A new locally-formatted bookmark ready to be transformed into a
-- | `RemoteBookmarkUnsaved`
type LocalBookmarkUnsaved = Record LocalBookmarkBase

-- | A locally-formatted bookmark
type LocalBookmark = Saved LocalBookmarkBase

-- TODO is this needed?
{-- export interface LocalBookmarkWeighted extends LocalBookmark { --}
{-- 	weight: URLMatch; --}
{-- } --}

bukuTagDelimiter :: String
bukuTagDelimiter = ","

-- Tried with forall, record building, and Lacks class, but can't figure out
-- how to write the below in a more DRY way without tripping type-checker

-- TODO will need to fix this: https://github.com/SamHH/bukubrow-webext/issues/139
remoteTags :: forall f. Foldable f => f String -> String
remoteTags xs = bukuTagDelimiter <> intercalate bukuTagDelimiter xs <> bukuTagDelimiter

remoteUnsaved :: LocalBookmarkUnsaved -> RemoteBookmarkUnsaved
remoteUnsaved x =
    { metadata: x.title
    , desc: x.desc
    , url: x.url
    , tags: remoteTags x.tags
    , flags: x.flags
    }

remote :: LocalBookmark -> RemoteBookmark
remote x =
    { id: x.id
    , metadata: x.title
    , desc: x.desc
    , url: x.url
    , tags: remoteTags x.tags
    , flags: x.flags
    }

localTags :: String -> Array String
localTags = split (Pattern bukuTagDelimiter) >>> filter (_ /= "")

localUnsaved :: RemoteBookmarkUnsaved -> LocalBookmarkUnsaved
localUnsaved x =
    { title: x.metadata
    , desc: x.desc
    , url: x.url
    , tags: fromFoldable $ localTags x.tags
    , flags: x.flags
    }

local :: RemoteBookmark -> LocalBookmark
local x =
    { id: x.id
    , title: x.metadata
    , desc: x.desc
    , url: x.url
    , tags: fromFoldable $ localTags x.tags
    , flags: x.flags
    }

