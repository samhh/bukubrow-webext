module Bukubrow where

import Prelude

import Bookmark (BookmarkId, RemoteBookmark, RemoteBookmarkUnsaved)
import Config (appName, minHostVer)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode.Custom (Decoder', decodeJson')
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (Either(..), hush)
import Data.Foldable (class Foldable)
import Data.Functor.Custom ((>#>))
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import NativeMessaging (Error(..))
import NativeMessaging as NM
import Result (Result, fromMaybe)
import Version (Compatible(..), Outdated(..), Version, compat)

sendNativeMessage :: forall a. EncodeJson (Shaped a) => Shaped a -> Aff (Either Error Json)
sendNativeMessage = NM.sendNativeMessage appName

sendNativeMessage' :: forall a. EncodeJson (Shaped a) => Shaped a -> Aff (Maybe Json)
sendNativeMessage' = sendNativeMessage >#> hush

data Method
    = Check
    | Get
    | Insert
    | Update
    | Delete

instance encodeMethod :: EncodeJson Method where
    encodeJson = bukubrowMethod >>> encodeJson

bukubrowMethod :: Method -> String
bukubrowMethod Check  = "OPTIONS"
bukubrowMethod Get    = "GET"
bukubrowMethod Insert = "POST"
bukubrowMethod Update = "PUT"
bukubrowMethod Delete = "DELETE"

type Shaped a =
    { method :: Method
    , data :: Maybe a
    }

shape :: forall a. Method -> a -> Shaped a
shape x y = { method: x, data: Just y }

shape' :: Method -> Shaped Void
shape' x = { method: x, data: Nothing }

type GetResponse =
    { bookmarks :: Array RemoteBookmark
    , moreAvailable :: Boolean
    }

get :: Unit -> Aff (Maybe GetResponse)
get _ = do
    res <- sendNativeMessage' (shape' Get)
    pure $ res >>= decodeJson'

type CheckResponse =
    { binaryVersion :: Version
    }

data HostStatus
    = Connected
    | HostOutdated
    | WebExtOutdated
    | NoHostComms
    | UnknownError

commsError :: Error -> HostStatus
commsError NoComms = NoHostComms
commsError Unknown = UnknownError

compatible :: Compatible -> HostStatus
compatible Compatible       = Connected
compatible Corrupt          = UnknownError
compatible (Incompatible x) = case x of
    FirstOutdated -> WebExtOutdated
    SecondOutdated -> HostOutdated

check :: Unit -> Aff HostStatus
check _ = do
    res <- sendNativeMessage $ shape' Check
    pure case res of
        Left e -> commsError e
        Right json -> do
            let decoded = (decodeJson' :: Decoder' CheckResponse) json <#> _.binaryVersion
            case decoded of
                Just v -> compat minHostVer v # compatible
                Nothing -> UnknownError

type BareResponse =
    { success :: Result
    }

decodeResult :: Maybe Json -> Result
decodeResult = map ((decodeJson' :: Decoder' BareResponse) >#> _.success) >>> fromMaybe

insert :: forall f. Foldable f => EncodeJson (f RemoteBookmarkUnsaved) => f RemoteBookmarkUnsaved -> Aff Result
insert = { bookmarks: _ } >>> shape Insert >>> sendNativeMessage' >#> decodeResult

update :: forall f. Foldable f => EncodeJson (f RemoteBookmark) => f RemoteBookmark -> Aff Result
update = { bookmarks: _ } >>> shape Update >>> sendNativeMessage' >#> decodeResult

delete :: forall f. Foldable f => EncodeJson (f BookmarkId) => f BookmarkId -> Aff Result
delete = { bookmark_ids: _ } >>> shape Delete >>> sendNativeMessage' >#> decodeResult

