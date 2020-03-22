module Bukubrow where

import Prelude

import Bookmark (BookmarkId, RemoteBookmark, RemoteBookmarkUnsaved)
import Config (appName)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Decode.Custom (Decoder)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Either (hush)
import Data.Foldable (class Foldable)
import Data.Functor.Custom ((>#>))
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import NativeMessaging (sendNativeMessage)
import Result (Result, fromEither)
import Version (Version)

sendNativeMessage' :: forall a. EncodeJson (Shaped a) => Shaped a -> Aff Json
sendNativeMessage' = sendNativeMessage appName

data Method
    = Get
    | Info
    | Insert
    | Update
    | Delete

instance encodeMethod :: EncodeJson Method where
    encodeJson = bukubrowMethod >>> encodeJson

bukubrowMethod :: Method -> String
bukubrowMethod Get    = "GET"
bukubrowMethod Info   = "OPTIONS"
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
get = const (shape' Get) >>> sendNativeMessage' >#> decodeJson >#> hush

type InfoResponse =
    { binaryVersion :: Version
    }

info :: Unit -> Aff (Maybe Version)
info = const (shape' Info) >>> sendNativeMessage' >#> ((decodeJson :: Decoder InfoResponse) >#> _.binaryVersion) >#> hush

type BareResponse =
    { success :: Result
    }

decodeResult :: Json -> Result
decodeResult = (decodeJson :: Decoder BareResponse) >#> _.success >>> fromEither

insert :: forall f. Foldable f => EncodeJson (f RemoteBookmarkUnsaved) => f RemoteBookmarkUnsaved -> Aff Result
insert = shape Insert >>> sendNativeMessage' >#> decodeResult

update :: forall f. Foldable f => EncodeJson (f RemoteBookmark) => f RemoteBookmark -> Aff Result
update = shape Update >>> sendNativeMessage' >#> decodeResult

delete :: forall f. Foldable f => EncodeJson (f BookmarkId) => f BookmarkId -> Aff Result
delete = shape Delete >>> sendNativeMessage' >#> decodeResult

