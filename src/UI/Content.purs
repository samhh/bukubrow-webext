module UI.Content (content) where

import Prelude

import Bookmark (RemoteBookmark, local)
import Bukubrow (HostFailure)
import Capability.RemoteData (class RemoteData, checkConnection, getRemoteBookmarks)
import Data.Either (Either(..))
import Data.FunctorWithIndex (mapWithIndex)
import Data.Maybe (Maybe(..), fromMaybe)
import Halogen as H
import Halogen.HTML as HH
import Type.Proxy (Proxy(..))
import UI.Components.Bookmark (bookmark, Output(..))
import UI.Components.Bookmark as Bookmark
import UI.Components.Onboarding (onboarding)

type Slots =
    ( onboardingSlot :: forall q. H.Slot q Void Unit
    , bookmarkSlot :: forall q. H.Slot q Bookmark.Output Int
    )

_onboarding = Proxy :: Proxy "onboardingSlot"
_bookmark = Proxy :: Proxy "bookmarkSlot"

data Bookmarks
    = Unbegun
    | Fetched (Either HostFailure (Array RemoteBookmark))

type State =
    { bookmarks :: Bookmarks
    }

data Action
    = Init
    | BookmarkLinkClicked

initialState :: State
initialState =
    { bookmarks: Unbegun
    }

content :: forall q i o m. RemoteData m => H.Component q i o m
content = H.mkComponent
    { initialState: const initialState
    , render
    , eval: H.mkEval H.defaultEval
        { handleAction = handler
        , initialize = Just Init
        }
    }

handler :: forall i o m. RemoteData m => Action -> H.HalogenM State Action i o m Unit
handler = case _ of
    Init -> do
       status <- checkConnection
       bms <- getRemoteBookmarks
       H.modify_ \s -> s { bookmarks = Fetched $ const (fromMaybe [] bms) <$> status }
    BookmarkLinkClicked -> H.modify_ (\s -> s { bookmarks = Fetched (Right []) }) -- TEMP TODO

handleBookmarkClick :: Bookmark.Output -> Action
handleBookmarkClick LinkClicked = BookmarkLinkClicked

render :: forall m. State -> H.ComponentHTML Action Slots m
render s = case s.bookmarks of
    Unbegun     -> HH.div_ []
    Fetched res -> case res of
        Left _    -> HH.slot_ _onboarding unit onboarding unit

        Right bms -> HH.div_ $ mapWithIndex (\i rembm ->
            HH.slot _bookmark i bookmark { bookmark: local rembm } handleBookmarkClick
        ) bms

