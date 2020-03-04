module LocalStorage where

import Prelude

import Bookmark (LocalBookmark)
import Config (bookmarkSchemaVer)
import Control.Alternative.Custom (ensure)
import Control.Promise (Promise, toAffE)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (decodeJson)
import Data.Array (fromFoldable)
import Data.Array.NonEmpty (NonEmptyArray, fromArray)
import Data.Either.Custom (fromRight)
import Data.Foldable (class Foldable)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Types (Predicate)

data LocalStorageKey
    = Bookmarks
    | BookmarksSchemaVersion

key :: LocalStorageKey -> String
key Bookmarks = "bookmarks"
key BookmarksSchemaVersion = "bookmarksSchemaVersion"

type LocalStorageState =
    { bookmarks :: Maybe (Array LocalBookmark)
    , bookmarksSchemaVersion :: Maybe Int
    }

emptyState :: LocalStorageState
emptyState =
    { bookmarks: Nothing
    , bookmarksSchemaVersion: Nothing
    }

foreign import getLocalStorageImpl :: Array String -> Effect (Promise Json)

getLocalStorage :: forall f. Foldable f => f LocalStorageKey -> Aff LocalStorageState
getLocalStorage = fromFoldable >>> map key >>> getLocalStorageImpl >>> toAffE >>> map (decodeJson >>> fromRight emptyState)

foreign import setLocalStorageImpl :: LocalStorageState -> Effect (Promise Unit)

setLocalStorage :: LocalStorageState -> Aff Unit
setLocalStorage = setLocalStorageImpl >>> toAffE

getBookmarks :: Unit -> Aff (Maybe (NonEmptyArray LocalBookmark))
getBookmarks _ = getLocalStorage ks <#> (ensure validSchema >=> _.bookmarks >=> fromArray)
    where
        ks :: Array LocalStorageKey
        ks = [ Bookmarks, BookmarksSchemaVersion ]

        validSchema :: Predicate LocalStorageState
        validSchema x = case x.bookmarksSchemaVersion of
            Just v -> v == bookmarkSchemaVer
            Nothing -> false

setBookmarks :: forall f. Foldable f => f LocalBookmark -> Aff Unit
setBookmarks xs = setLocalStorage { bookmarks: Just (fromFoldable xs), bookmarksSchemaVersion: Just bookmarkSchemaVer }

